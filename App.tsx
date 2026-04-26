import { useEffect, useMemo, useRef, useState } from "react";
import perfilImg from "./assets/perfil.gif";
import musicaSrc from "./assets/musica.mp3";

const DISCORD_URL = "https://discord.com";

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
};

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [views, setViews] = useState(0);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 12,
        size: 2 + Math.random() * 4,
      })),
    [],
  );

  useEffect(() => {
    const stored = Number(localStorage.getItem("fjn_views") ?? "0");
    const next = stored + 1;
    localStorage.setItem("fjn_views", String(next));
    setViews(next);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const tryPlayAudible = async () => {
      try {
        audio.muted = false;
        await audio.play();
      } catch {
        try {
          audio.muted = true;
          await audio.play();
        } catch {
          /* will retry on first interaction */
        }
      }
    };

    tryPlayAudible();

    const onFirstInteract = async () => {
      audio.muted = false;
      try {
        await audio.play();
      } catch {
        /* ignore */
      }
    };

    const opts = { once: true } as AddEventListenerOptions;
    window.addEventListener("pointermove", onFirstInteract, opts);
    window.addEventListener("pointerdown", onFirstInteract, opts);
    window.addEventListener("touchstart", onFirstInteract, opts);
    window.addEventListener("touchmove", onFirstInteract, opts);
    window.addEventListener("keydown", onFirstInteract, opts);
    window.addEventListener("scroll", onFirstInteract, opts);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      window.removeEventListener("pointermove", onFirstInteract);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
      window.removeEventListener("touchmove", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("scroll", onFirstInteract);
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const tiltFromPoint = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    tiltFromPoint(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    tiltFromPoint(t.clientX, t.clientY);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", `0deg`);
    card.style.setProperty("--ry", `0deg`);
  };

  return (
    <div className="page">
      <div className="particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>

      <button
        className={`sound ${isPlaying ? "playing" : ""}`}
        onClick={toggleSound}
        aria-label="Som"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm-2.5-9.5v2.06A7 7 0 0 1 19 12a7 7 0 0 1-5 6.71v2.06A9 9 0 0 0 21 12 9 9 0 0 0 14 2.5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.4 4.4 0 0 0 .05-.63zM19 12a7 7 0 0 1-.43 2.41l1.5 1.5A8.94 8.94 0 0 0 21 12a9 9 0 0 0-7-8.77V5.3a7 7 0 0 1 5 6.7zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.51-1.42.92-2.25 1.17v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
          </svg>
        )}
        <span className="sound-pulse" />
      </button>

      <div
        className="card-3d-wrap"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetTilt}
      >
        <div ref={cardRef} className="container">
          <div className="card-shine" />

          <div className="avatar-wrap">
            <div className="avatar-ring" />
            <img src={perfilImg} className="avatar" alt="Perfil FJN" />
          </div>

          <div className="title">FJN</div>
          <div className="subtitle"></div>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="discord-link"
            aria-label="Discord"
          >
            <svg viewBox="0 0 127.14 96.36" className="discord-svg" aria-hidden="true">
              <path
                fill="currentColor"
                d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
              />
            </svg>
          </a>

          <div className="views">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="14"
              height="14"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{views.toLocaleString("pt-BR")}</span> visualizações
          </div>
        </div>
      </div>

      <div className="footer">By Developer FJN</div>

      <audio ref={audioRef} loop autoPlay playsInline>
        <source src={musicaSrc} type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
