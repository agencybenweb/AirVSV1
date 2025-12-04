import { useEffect, useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X, Radio } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

const baseUrl = import.meta.env.VITE_AZURACAST_BASE_URL as string | undefined;
const stationId = import.meta.env.VITE_AZURACAST_STATION_ID as string | undefined;
const apiKey = import.meta.env.VITE_AZURACAST_API_KEY as string | undefined;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [listeners, setListeners] = useState<number | null>(null);

  useEffect(() => {
    if (!baseUrl || !stationId) return;

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(
          `${baseUrl.replace(/\/+$/, "")}/api/nowplaying/${stationId}`,
          apiKey
            ? {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                },
              }
            : undefined
        );
        const data = await res.json();
        const np = data.now_playing || data;
        const current =
          (np.listeners && np.listeners.current) || data.listeners?.current;
        if (typeof current === "number") {
          setListeners(current);
        }
      } catch (e) {
        console.error("Erreur récupération auditeurs:", e);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { to: "/", label: "Accueil" },
    { to: "/podcasts", label: "Podcasts" },
    { to: "/derniers-sons", label: "Derniers Sons" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + Auditeurs */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-2 group">
              <Radio className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
              <span className="text-2xl font-bold text-primary glow-text-cyan">
                AIRVS
              </span>
            </NavLink>
            {listeners !== null && (
              <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {listeners}{" "}
                  {listeners > 1 ? "auditeurs en direct" : "auditeur en direct"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all"
                  activeClassName="text-primary bg-muted"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Theme toggle */}
            <ModeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                activeClassName="text-primary bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
