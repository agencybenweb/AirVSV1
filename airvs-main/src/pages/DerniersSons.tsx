import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Music2, Clock } from "lucide-react";

interface Track {
  id: number | string;
  title: string;
  artist?: string;
  time: string;
  artwork?: string;
  likes?: number;
  hasLiked?: boolean;
}

// Config AzuraCast (mêmes variables que pour les podcasts)
const baseUrl = import.meta.env.VITE_AZURACAST_BASE_URL as string | undefined;
const stationId = import.meta.env.VITE_AZURACAST_STATION_ID as string | undefined;

const DerniersSons = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_AZURACAST_API_KEY as string | undefined;

  // Récupère l'historique des titres via l'API AzuraCast
  const fetchTrackHistory = async () => {
    try {
      if (!baseUrl || !stationId) {
        setError(
          "Configuration AzuraCast manquante. Vérifiez vos variables d'environnement."
        );
        setIsLoading(false);
        return;
      }

      setError(null);

      let recent: Track[] = [];

      const rawVotes = localStorage.getItem("airvs-track-votes");
      const votes: Record<string, number> = rawVotes ? JSON.parse(rawVotes) : {};

      // 1) Tentative d'utiliser l'endpoint d'historique détaillé (permet de demander 15 entrées)
      if (apiKey) {
        const historyRes = await fetch(
          `${baseUrl.replace(
            /\/+$/,
            ""
          )}/api/station/${stationId}/history?limit=15`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          recent = (historyData ?? []).slice(0, 15).map((item: any, index: number) => {
            const started = item.played_at
              ? new Date(item.played_at * 1000)
              : new Date();

            const id = (item.id ?? item.sh_id ?? index).toString();

            return {
              id,
              title: item.song?.title || item.title || "Titre inconnu",
              artist: item.song?.artist || item.artist || undefined,
              time: started.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              artwork: item.song?.art ?? item.art ?? undefined,
              likes: votes[id] ?? 0,
            } as Track;
          });
        }
      }

      // 2) Si on n'a pas réussi à remplir avec l'historique complet, on retombe sur /nowplaying
      if (!recent.length) {
        const response = await fetch(
          `${baseUrl.replace(/\/+$/, "")}/api/nowplaying/${stationId}`
        );
        const data = await response.json();

        const songHistory = data.song_history || [];

        recent = songHistory.slice(0, 15).map((item: any, index: number) => {
          const started = item.played_at
            ? new Date(item.played_at * 1000)
            : new Date();

          const id = (item.sh_id ?? index).toString();

          return {
            id,
            title: item.song?.title || "Titre inconnu",
            artist: item.song?.artist || undefined,
            time: started.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            artwork: item.song?.art ?? undefined,
            likes: votes[id] ?? 0,
          } as Track;
        });
      }

      setTracks(recent);
      setLastUpdate(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur récupération historique:", error);
      setError("Impossible de récupérer l'historique depuis AzuraCast.");
      setIsLoading(false);
    }
  };

  const toggleLike = (trackId: string) => {
    setTracks((prev) => {
      const rawVotes = localStorage.getItem("airvs-track-votes");
      const votes: Record<string, number> = rawVotes ? JSON.parse(rawVotes) : {};

      const next = prev.map((t) => {
        if (t.id.toString() !== trackId) return t;
        const currentLikes = votes[trackId] ?? t.likes ?? 0;
        const hasLiked = !t.hasLiked;
        const newLikes = hasLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
        votes[trackId] = newLikes;
        return { ...t, likes: newLikes, hasLiked };
      });

      localStorage.setItem("airvs-track-votes", JSON.stringify(votes));
      return next;
    });
  };

  // Initial fetch and auto-update
  useEffect(() => {
    fetchTrackHistory();
    const interval = setInterval(fetchTrackHistory, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-primary glow-text-cyan">
              Derniers Sons Diffusés
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Historique des titres joués sur AIRVS
            </p>
            <Badge variant="outline" className="border-secondary/50">
              <Clock className="h-3 w-3 mr-1" />
              Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
            </Badge>
          </div>

          {/* Tracks List */}
          <div className="space-y-4 animate-slide-up">
            {isLoading ? (
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary mb-4" />
                  <p className="text-muted-foreground">Chargement de l'historique...</p>
                </CardContent>
              </Card>
            ) : tracks.length === 0 ? (
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <Music2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun titre disponible pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              tracks.map((track, index) => (
              <Card
                key={track.id}
                className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Artwork */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {track.artwork ? (
                          <img
                            src={track.artwork}
                            alt={track.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {index === 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5">
                          En cours
                        </Badge>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {track.title}
                      </h3>
                      {track.artist && (
                        <p className="text-sm text-muted-foreground truncate">
                          {track.artist}
                        </p>
                      )}
                    </div>

                    {/* Time + Likes */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {track.time}
                      </Badge>
                      <Button
                        variant={track.hasLiked ? "default" : "outline"}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => toggleLike(track.id.toString())}
                      >
                        <Heart
                          className={`h-3 w-3 mr-1 ${
                            track.hasLiked ? "fill-current" : ""
                          }`}
                        />
                        {track.likes ?? 0}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>

          {/* Info Box */}
          <Card className="mt-12 border-secondary/20 bg-secondary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2 text-secondary">
                Historique en temps réel
              </h3>
              <p className="text-sm text-muted-foreground">
                Cette liste affiche les 15 derniers titres diffusés, récupérés en temps réel depuis votre instance AzuraCast.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DerniersSons;
