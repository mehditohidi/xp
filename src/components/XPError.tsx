import React, { useEffect, useRef, useState } from "react";
import errorSound from "../music/error.mp3";
import "./XPError.css";

const TITLES = [
  "System Error",
  "Application Error",
  "Explorer.exe",
  "Critical Error",
  "Fatal Exception",
  "Windows - Error",
  "svchost.exe",
  "Runtime Error",
];

const MESSAGES = [
  "A fatal exception 0E has occurred at 0028:C0011E36. The current application will be terminated.",
  "Explorer.exe has encountered a problem and needs to close.",
  "The instruction at 0x77f4a1d0 referenced memory at 0x00000000. The memory could not be read.",
  "A required .DLL file, USER32.DLL, was not found.",
  "STOP: 0x0000007B (0xF741B84C, 0xC0000034, 0x00000000, 0x00000000)",
  "Your computer has run out of virtual memory.",
  "Not enough memory to complete this operation.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Props {
  onClose: () => void;
  initialTitle?: string;
  initialMessage?: string;
  initialPos?: { x: number; y: number };
  playDelayMs?: number;
}

const XPError: React.FC<Props> = ({ onClose, initialTitle, initialMessage, initialPos, playDelayMs = 0 }) => {
  const [title] = useState(() => initialTitle || pick(TITLES));
  const [message] = useState(() => initialMessage || pick(MESSAGES));
  const [pos, setPos] = useState(() => initialPos || { x: Math.max(20, window.innerWidth / 2 - 170), y: Math.max(20, window.innerHeight / 2 - 100) });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // play error.mp3 on mount — staggered via playDelayMs for 5-error burst
    const audio = new Audio(errorSound);
    audio.preload = "auto";
    audio.volume = 0.9;
    // ensure we can play after any user gesture; keep reference to retry
    audioRef.current = audio;
    let cancelled = false;
    let retryTimer: number | null = null;

    const tryPlay = () => {
      if (cancelled) return;
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof (p as any).catch === "function") {
        (p as Promise<void>).catch(() => {
          // autoplay blocked — retry on next user interaction
          const unlock = () => {
            if (cancelled) return;
            audio.play().catch(() => {});
            window.removeEventListener("click", unlock);
            window.removeEventListener("keydown", unlock);
            window.removeEventListener("touchstart", unlock);
          };
          window.addEventListener("click", unlock, { once: true });
          window.addEventListener("keydown", unlock, { once: true });
          window.addEventListener("touchstart", unlock, { once: true } as any);
          // also retry after 1s in case gesture already happened
          retryTimer = window.setTimeout(() => {
            audio.play().catch(() => {});
          }, 1000);
        });
      }
    };

    const t = window.setTimeout(tryPlay, playDelayMs + 60);
    return () => {
      cancelled = true;
      clearTimeout(t);
      if (retryTimer) clearTimeout(retryTimer);
      try { audio.pause(); } catch {}
      audioRef.current = null;
    };
  }, [playDelayMs]);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleOk = () => {
    // XP style: OK sometimes spawns another — we just close for startup demo
    onClose();
  };

  return (
    <div className="xp-error-window" style={{ left: pos.x, top: pos.y }} onMouseDown={(e) => e.stopPropagation()}>
      <div className="xp-error-titlebar" onMouseDown={onMouseDown}>
        <div className="xp-error-title-left">
          <svg className="xp-error-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#e21818" stroke="white" strokeWidth="1"/><text x="8" y="12" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">X</text></svg>
          <span>{title}</span>
        </div>
        <div className="xp-error-close" onClick={onClose}>×</div>
      </div>
      <div className="xp-error-body">
        <div className="xp-error-bigicon">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="g-err" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#ff6b6b"/>
                <stop offset="60%" stopColor="#e21818"/>
                <stop offset="100%" stopColor="#a10000"/>
              </radialGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="url(#g-err)"/>
            <text x="16" y="23" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">X</text>
          </svg>
        </div>
        <div className="xp-error-message">{message}</div>
      </div>
      <div className="xp-error-buttons">
        <button className="xp-error-btn" autoFocus onClick={handleOk}>OK</button>
        <button className="xp-error-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default XPError;
