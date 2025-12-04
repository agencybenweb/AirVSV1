import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "https://facebook.com" },
    { icon: Instagram, label: "Instagram", url: "https://instagram.com" },
    { icon: Twitter, label: "X (Twitter)", url: "https://twitter.com" },
  ];

  return (
    <footer className="border-t border-border/50 bg-card mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-primary glow-text-cyan mb-1">
              AIRVS
            </h3>
            <p className="text-sm text-muted-foreground">
              La radio en un clic
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              Suivez-nous :
            </span>
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} AIRVS. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
