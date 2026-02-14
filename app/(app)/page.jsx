import { Button } from "@/components/ui/button";
import { generateSeoMetadataServer } from "@/lib/seo";
import { CheckCircle2, Code, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("home", {
    title: "ShadcnUI Auth - Premium Next.js Authentication Starter Kit",
    description:
      "The ultimate authentication starter kit built with Next.js 15, Shadcn UI, and MongoDB.",
    isAbsolute: true,
  });
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm duration-1000 fade-in slide-in-from-bottom-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Modern Authentication Suite</span>
          </div>
          <h1 className="mb-8 animate-in text-4xl font-extrabold tracking-tight delay-100 duration-1000 fade-in slide-in-from-bottom-8 sm:text-6xl md:text-7xl">
            Secure Your App with <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Confidence and Elegance
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-[700px] animate-in text-lg text-muted-foreground delay-200 duration-1000 fade-in slide-in-from-bottom-12 sm:text-xl">
            The ultimate authentication starter kit built with Next.js 15,
            Shadcn UI, and MongoDB. Beautiful, secure, and ready for production.
          </p>
          <div className="flex animate-in flex-col items-center justify-center gap-4 delay-300 duration-1000 fade-in slide-in-from-bottom-16 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-semibold"
              >
                View Demo Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We&apos;ve handled the complexities of auth so you can focus on
              building your features.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Secure by Default"
              description="Built-in protection against common vulnerabilities. Sessions are handled securely via NextAuth."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Lightning Fast"
              description="Optimized with Next.js Server Components and Actions for maximum performance and SEO."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-primary" />}
              title="Beautiful UI"
              description="Crafted with Shadcn UI components that follow best practices in accessibility and design."
            />
            <FeatureCard
              icon={<Code className="h-6 w-6 text-primary" />}
              title="Developer Friendly"
              description="Clean codebase written in modern JavaScript. Easy to extend and customize to your needs."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
              title="Full Auth Flow"
              description="Registration, login, password reset, and profile management out of the box."
            />
            <FeatureCard
              icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
              title="Admin Dashboard"
              description="Fully functional sidebar-based dashboard for managing your users and settings."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="border-t py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <h2 className="relative mb-6 text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to start your next project?
            </h2>
            <p className="relative mx-auto mb-10 max-w-[600px] text-lg text-primary-foreground/80">
              Join thousands of developers building secure applications with our
              authentication system.
            </p>
            <div className="relative">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-10 text-base font-bold"
                >
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group relative rounded-2xl border bg-background p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function LayoutDashboard(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
