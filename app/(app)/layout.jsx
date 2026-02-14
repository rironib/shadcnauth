import { Footer } from "@/components/app/footer";
import { Header } from "@/components/app/header";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export default async function HomeLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      <Header session={session} />
      <div className="mx-auto w-full max-w-7xl flex-1 grow px-2 py-6 sm:px-3 md:px-4 lg:px-6 xl:px-0">
        {children}
      </div>
      <Footer />
    </div>
  );
}
