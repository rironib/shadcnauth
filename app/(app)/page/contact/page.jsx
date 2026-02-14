import ContactForm from "@/app/(app)/page/contact/ContactForm";
import { generateSeoMetadataServer } from "@/lib/seo";

export const generateMetadata = async () => {
  return await generateSeoMetadataServer("contact", {
    title: "Contact Us",
    description:
      "Have a question or want to work together? Reach out to the ShadcnAuth team. We're here to help you with your authentication and user management needs.",
    link: "/page/contact",
  });
};

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-sm md:max-w-4xl">
      <ContactForm />
    </div>
  );
}
