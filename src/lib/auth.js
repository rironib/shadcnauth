import connectDB from "@/lib/mongodb";
import { env } from "@/lib/validateEnv";
import User from "@/models/User";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required.");
        }

        // Find user by email
        const input = credentials.email.trim().toLowerCase();
        const user = await User.findOne({ email: input }).select("+password");

        if (!user) {
          throw new Error("Invalid email or password.");
        }

        // If user has no password (e.g. social login user trying to use credentials), block it
        if (!user.password) {
          throw new Error("Please login with your social account.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        if (!user.emailVerified) {
          throw new Error(
            "Please verify your email address before logging in.",
          );
        }

        if (user.status === "deleted") {
          throw new Error("This account has been deleted.");
        }

        if (user.status === "banned" || user.status === "suspended") {
          throw new Error(
            "Your account has been restricted. Please contact support.",
          );
        }

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google" || account.provider === "facebook") {
        await connectDB();
        try {
          const email = user.email;
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            // Create new social user
            // Generate a random username or use email prefix
            let username = email
              .split("@")[0]
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "");
            let usernameExists = await User.findOne({ username });

            // Allow sparse unique index to handle this or just try to make it unique
            // Simple retry logic
            if (usernameExists) {
              username += Math.floor(Math.random() * 10000).toString();
            }

            const newUser = new User({
              name: user.name,
              email: email,
              username: username,
              emailVerified: true,
              provider: account.provider,
            });

            await newUser.save();
            return true;
          } else {
            // If user exists but is deleted/banned?
            if (existingUser.status === "deleted") return false;
            if (
              existingUser.status === "banned" ||
              existingUser.status === "suspended"
            )
              return false;

            return true;
          }
        } catch (error) {
          console.error(
            "Error checking/creating user in signIn callback",
            error,
          );
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Handle session update
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.username) token.username = session.user.username;
        if (session.user.role) token.role = session.user.role;
      }

      // On initial sign in, user is defined
      if (user) {
        token.id = user.id;

        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.email = dbUser.email;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.username = dbUser.username;
          token.emailVerified = dbUser.emailVerified ? true : false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        username: token.username,
        emailVerified: token.emailVerified,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
