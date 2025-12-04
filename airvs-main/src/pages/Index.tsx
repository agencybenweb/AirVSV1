import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Radio, Music, Podcast, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const ICECAST_STREAM_URL = "https://icecast-vps-ovh.airvs.fr/stream4";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section 
          className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay adaptatif au thème */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background pointer-events-none" />
          
          <div className="relative container mx-auto px-4 text-center animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 glow-text-cyan">
              AIRVS
            </h1>
            <p className="text-2xl md:text-3xl text-secondary glow-text-green mb-8">
              La radio en un clic
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 text-lg px-8 py-6"
              asChild
            >
              <a href="#player">
                <Radio className="mr-2 h-5 w-5" />
                Écouter maintenant
              </a>
            </Button>
          </div>
        </section>

        {/* Player Section */}
        <section id="player" className="py-16 px-4 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4 text-primary">
                En Direct
              </h2>
              <p className="text-muted-foreground text-lg">
                Écoutez AIRVS en direct 24h/24
              </p>
            </div>
            <AudioPlayer streamUrl={ICECAST_STREAM_URL} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Music className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Derniers Sons</h3>
                  <p className="text-muted-foreground mb-4">
                    Découvrez l'historique des titres diffusés
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/derniers-sons">Voir l'historique</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-card/50 backdrop-blur hover:border-secondary/50 transition-all group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Podcast className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Podcasts</h3>
                  <p className="text-muted-foreground mb-4">
                    Retrouvez nos émissions à la demande
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/podcasts">Écouter les podcasts</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-card/50 backdrop-blur hover:border-accent/50 transition-all group">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                    <MessageSquare className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Contact</h3>
                  <p className="text-muted-foreground mb-4">
                    Une question ? Contactez-nous
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/contact">Nous contacter</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 px-4 bg-card/30">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Votre radio moderne disponible 24h/24
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-4">
                <div className="text-4xl mb-2">🎵</div>
                <p className="text-muted-foreground">
                  Musique en continu
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-muted-foreground">
                  Compatible mobile & desktop
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-muted-foreground">
                  Thème moderne et fluide
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
