import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const baseUrl = import.meta.env.VITE_AZURACAST_BASE_URL as string | undefined;
const stationId = import.meta.env.VITE_AZURACAST_STATION_ID as string | undefined;
const apiKey = import.meta.env.VITE_AZURACAST_API_KEY as string | undefined;

type AzuraPodcast = {
  id: number | string;
  title: string;
  description?: string;
  art?: string | null;
  url?: string;
  link?: string;
  duration?: string | number | null;
  published_at?: string;
};

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState<AzuraPodcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      // Vérification de la configuration
      if (!baseUrl || !stationId || !apiKey) {
        setError(
          "Configuration AzuraCast manquante. Vérifiez vos variables d'environnement."
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `${baseUrl}/api/station/${stationId}/podcasts`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erreur API AzuraCast");
        }

        const data = await res.json();
        setPodcasts(data);
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les podcasts depuis AzuraCast.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-primary glow-text-cyan">
              Podcasts AIRVS
            </h1>
            <p className="text-xl text-muted-foreground">
              Retrouvez nos émissions et rediffusions
            </p>
          </div>

          {/* Podcasts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {isLoading && (
            <p className="text-center text-muted-foreground col-span-full">
              Chargement des podcasts...
            </p>
          )}

          {error && !isLoading && (
            <p className="text-center text-destructive col-span-full">
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            podcasts.map((podcast) => {
              // Détermine d'abord un "chemin" renvoyé par l'API (souvent relatif)
              let listenPath = podcast.link || podcast.url || "";

              // Si aucun chemin n'est fourni, on tente le chemin public standard AzuraCast
              if (!listenPath && baseUrl && stationId) {
                listenPath = `/public/${stationId}/podcast/${podcast.id}`;
              }

              // Construit l'URL finale : si déjà absolue (http...), on la garde telle quelle,
              // sinon on la préfixe par l'URL de base AzuraCast.
              const listenUrl =
                listenPath && baseUrl
                  ? listenPath.startsWith("http")
                    ? listenPath
                    : `${baseUrl.replace(/\/+$/, "")}${
                        listenPath.startsWith("/") ? "" : "/"
                      }${listenPath}`
                  : "#";

              const publishedDate = podcast.published_at
                ? new Date(podcast.published_at)
                : null;

              return (
                <Card
                  key={podcast.id}
                  className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all group overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        podcast.art ||
                        "https://placehold.co/400x400?text=Podcast"
                      }
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {podcast.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {podcast.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {podcast.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {podcast.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{podcast.duration}</span>
                        </div>
                      )}
                      {publishedDate && (
                        <>
                          {podcast.duration && <span>•</span>}
                          <span>
                            {publishedDate.toLocaleDateString("fr-FR")}
                          </span>
                        </>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={!listenUrl || listenUrl === "#"}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Écouter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>{podcast.title}</DialogTitle>
                          {podcast.description && (
                            <DialogDescription className="line-clamp-3">
                              {podcast.description}
                            </DialogDescription>
                          )}
                        </DialogHeader>
                        {listenUrl && listenUrl !== "#" ? (
                          <div className="mt-4 w-full">
                            <iframe
                              src={listenUrl}
                              className="w-full h-80 rounded-md border border-border"
                              allow="autoplay"
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aucun lecteur disponible pour ce podcast.
                          </p>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Box */}
          <Card className="mt-12 border-secondary/20 bg-secondary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2 text-secondary">
              Podcasts AirVs
              </h3>
              <p className="text-sm text-muted-foreground">
              Les podcasts affichés ici sont des rediffusions de nos émissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Podcasts;
