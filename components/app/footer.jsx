import { RiFacebookFill, RiTelegram2Line, RiWhatsappLine } from "@/lib/icons";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { url: "#", icon: RiFacebookFill },
    { url: "#", icon: RiTelegram2Line },
    { url: "#", icon: RiWhatsappLine },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/page/about" },
    { name: "Contact", href: "/page/contact" },
  ];

  const legalLinks = [
    { name: "DMCA", href: "/page/dmca" },
    { name: "Privacy Policy", href: "/page/privacy" },
    { name: "Terms of Service", href: "/page/tos" },
  ];

  return (
    <footer className="mt-12 border-t bg-background py-10">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6 xl:px-0">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">ShadcnUI Auth</h3>
            <p className="mb-4 max-w-md text-justify text-sm leading-relaxed text-muted-foreground italic">
              Built from the frustration of limitations and the hope for
              something better. This is the next chapter—a faster, cleaner, and
              more powerful space designed to give you exactly what you need,
              without the clutter. We are moving forward, together.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-primary"
                    aria-label={`Visit our ${
                      social.url.includes("facebook")
                        ? "Facebook"
                        : social.url.includes("telegram")
                          ? "Telegram"
                          : "WhatsApp"
                    } page`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>© {currentYear} ShadcnUI Auth | All Rights Reserved.</p>
            <p className="flex items-center gap-1.5">
              Built with{" "}
              <span className="animate-pulse text-destructive">❤️</span> for
              developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
