import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  streamUrl?: string;
  title?: string;
}

interface NowPlayingMetadata {
  title?: string;
  artist?: string;
  artwork?: string;
}

interface RequestableSong {
  id: string;
  title: string;
  artist?: string;
  artwork?: string | null;
}

const baseUrl = import.meta.env.VITE_AZURACAST_BASE_URL as string | undefined;
const stationId = import.meta.env.VITE_AZURACAST_STATION_ID as string | undefined;
const apiKey = import.meta.env.VITE_AZURACAST_API_KEY as string | undefined;

export const AudioPlayer = ({ streamUrl, title = "AIRVS Radio" }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<NowPlayingMetadata>({ title: "En attente..." });
  const [isOnline, setIsOnline] = useState(true);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestableSongs, setRequestableSongs] = useState<RequestableSong[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Récupération des métadonnées via AzuraCast (nowplaying)
  const fetchMetadata = async () => {
    if (!baseUrl || !stationId) return;

    try {
      const response = await fetch(
        `${baseUrl.replace(/\/+$/, "")}/api/nowplaying/${stationId}`,
        apiKey
          ? {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            }
          : undefined
      );

      const data = await response.json();

      const np = data.now_playing || data;
      const song = np.song || {};

      if (song.title || song.text) {
        setCurrentTrack({
          title: song.title || song.text,
          artist: song.artist,
          artwork: song.art,
        });
      }

      setIsOnline(true);
    } catch (error) {
      console.error("Erreur récupération métadonnées:", error);
      setIsOnline(false);
    }
  };

  // Auto-reconnect on error
  const handleStreamError = () => {
    setIsPlaying(false);
    setIsOnline(false);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (audioRef.current && streamUrl) {
        console.log("Tentative de reconnexion...");
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsOnline(true);
          toast({
            title: "Reconnecté",
            description: "Le flux audio a été rétabli.",
          });
        }).catch(() => {
          setIsOnline(false);
        });
      }
    }, 5000);
  };

  // Start metadata polling when playing
  useEffect(() => {
    if (isPlaying && streamUrl) {
      fetchMetadata();
      metadataIntervalRef.current = setInterval(fetchMetadata, 10000);
    } else {
      if (metadataIntervalRef.current) {
        clearInterval(metadataIntervalRef.current);
        metadataIntervalRef.current = null;
      }
    }

    return () => {
      if (metadataIntervalRef.current) {
        clearInterval(metadataIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isPlaying, streamUrl]);

  const togglePlay = async () => {
    if (!streamUrl) {
      toast({
        title: "URL du flux manquante",
        description: "Le flux IceCast n'est pas encore configuré.",
        variant: "destructive",
      });
      return;
    }

    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Erreur de lecture:", error);
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire le flux audio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const volumeValue = newValue[0];
    setVolume(volumeValue);
    if (isMuted && volumeValue > 0) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  // Récupère la liste des titres demandables depuis AzuraCast
  const fetchRequestableSongs = async () => {
    if (!baseUrl || !stationId || !apiKey) {
      setRequestError(
        "La fonction de demande de titres n'est pas configurée (clé API ou station manquante)."
      );
      return;
    }

    try {
      setIsRequestLoading(true);
      setRequestError(null);

      const res = await fetch(
        `${baseUrl.replace(/\/+$/, "")}/api/station/${stationId}/requests`,
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

      const mapped: RequestableSong[] = (data ?? []).map((item: any) => ({
        id: item.request_id || item.id,
        title: item.song?.title || item.title || "Titre inconnu",
        artist: item.song?.artist || item.artist || undefined,
        artwork: item.song?.art || item.art || null,
      }));

      setRequestableSongs(mapped);
    } catch (e) {
      console.error(e);
      setRequestError("Impossible de charger la liste des titres demandables.");
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleRequestSong = async (songId: string) => {
    if (!baseUrl || !stationId || !apiKey) {
      toast({
        title: "Fonction non disponible",
        description: "La fonction de demande de titres n'est pas configurée.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRequestLoading(true);
      const res = await fetch(
        `${baseUrl.replace(
          /\/+$/,
          ""
        )}/api/station/${stationId}/request/${encodeURIComponent(songId)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Erreur lors de la demande de ce titre.");
      }

      toast({
        title: "Demande envoyée",
        description:
          "Votre titre a été ajouté aux demandes et sera diffusé dans les prochaines minutes.",
      });
      setIsRequestDialogOpen(false);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Erreur",
        description:
          e?.message || "Impossible d'envoyer la demande pour ce titre.",
        variant: "destructive",
      });
    } finally {
      setIsRequestLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative rounded-2xl border border-primary/30 bg-card p-8 glow-border-cyan">
        {/* Visualizer Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
        
        <div className="relative space-y-6">
          {/* Title and Status */}
          <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl font-bold text-primary glow-text-cyan">
                  {title}
                </h3>
                <div
                  className={`h-3 w-3 rounded-full ${
                    isOnline ? "bg-secondary animate-pulse" : "bg-destructive"
                  }`}
                  title={isOnline ? "En ligne" : "Hors ligne"}
                />
              </div>
            </div>

            {isPlaying && currentTrack.title && (
              <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
                {currentTrack.artwork && (
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-muted shadow-xl border border-border/50">
                    <img
                      src={currentTrack.artwork}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="max-w-md px-4">
                  <p className="text-lg md:text-xl font-semibold text-secondary glow-text-green truncate text-center">
                    {currentTrack.title}
                  </p>
                  {currentTrack.artist && (
                    <p className="text-sm md:text-base text-muted-foreground truncate text-center mt-1">
                      {currentTrack.artist}
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {isPlaying ? "En lecture..." : "En pause"}
            </p>
          </div>

          {/* Play + Request + Dedication Buttons */}
          <div className="flex flex-col items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={togglePlay}
              disabled={isLoading}
              className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 transition-all hover:scale-105"
            >
              {isLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-foreground/30 border-t-primary-foreground" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>

            <Dialog
              open={isRequestDialogOpen}
              onOpenChange={(open) => {
                setIsRequestDialogOpen(open);
                if (open && !requestableSongs.length) {
                  fetchRequestableSongs();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="px-4">
                  Demander un son
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Demander un son</DialogTitle>
                  <DialogDescription>
                    Choisissez un titre à ajouter à la file de diffusion. Il sera joué dans les prochaines minutes selon les règles de programmation.
                  </DialogDescription>
                </DialogHeader>

                {isRequestLoading && (
                  <p className="text-sm text-muted-foreground">
                    Chargement de la liste des titres demandables...
                  </p>
                )}

                {requestError && !isRequestLoading && (
                  <p className="text-sm text-destructive">{requestError}</p>
                )}

                {!isRequestLoading && !requestError && (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {requestableSongs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Aucun titre n'est disponible à la demande pour le moment.
                      </p>
                    ) : (
                      requestableSongs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/60 p-2"
                        >
                          {song.artwork && (
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                              <img
                                src={song.artwork}
                                alt={song.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {song.title}
                            </p>
                            {song.artist && (
                              <p className="text-xs text-muted-foreground truncate">
                                {song.artist}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRequestSong(song.id)}
                            disabled={isRequestLoading}
                          >
                            Demander
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="shrink-0"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-10 text-right">
              {isMuted ? 0 : volume}%
            </span>
          </div>

          {/* Visualizer Bars */}
          {isPlaying && (
            <div className="flex items-end justify-center gap-1 h-16">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full animate-pulse-glow"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dedication Button - Centered below player */}
      <div className="flex justify-center mt-10">
        <Button
          variant="outline"
          className="px-4"
          onClick={() =>
            toast({
              title: "Dédicace",
              description:
                "Le module de dédicaces sera bientôt disponible. Merci pour votre message !",
            })
          }
        >
          Envoyer une dédicace
        </Button>
      </div>

      {/* Hidden Audio Element */}
      {streamUrl && (
        <audio
          ref={audioRef}
          src={streamUrl}
          preload="none"
          onError={handleStreamError}
        />
      )}
    </div>
  );
};
