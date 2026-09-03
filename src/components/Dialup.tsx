import React, { useState, useRef, useCallback, useEffect } from "react";
import "./Dialup.css";
import dialupMp3 from "../music/dialup.mp3";

type ConnState = "form" | "dialing" | "verifying" | "connected" | "failed";

interface DialupConnectionProps {
  onClose?: () => void;
  onConnected?: () => void;
  isp?: string;
  dialNumber?: string;
}

const DialupConnection: React.FC<DialupConnectionProps> = ({
  onClose,
  onConnected,
  isp = "DCANet",
  dialNumber = "555-0199",
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [savePassword, setSavePassword] = useState(true);
  const [saveFor, setSaveFor] = useState<"me" | "anyone">("anyone");
  const [dialValue, setDialValue] = useState(dialNumber);
  const [dialingFrom, setDialingFrom] = useState("New Location");

  const [state, setState] = useState<ConnState>("form");
  const [statusText, setStatusText] = useState("");
  const [showDialingRules, setShowDialingRules] = useState(false);
  const [showProperties, setShowProperties] = useState(false);

  const timers = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endedHandlerRef = useRef<(() => void) | null>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(dialupMp3);
      audioRef.current.preload = "auto";
    }
    return audioRef.current;
  }, []);

  const stopModemSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (endedHandlerRef.current) {
      audio.removeEventListener("ended", endedHandlerRef.current);
      endedHandlerRef.current = null;
    }
    audio.pause();
    audio.currentTime = 0;
    // also remove any pending loadedmetadata listeners by cloning? easiest: replace with new Audio on next play
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      stopModemSound();
      // fully release audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [stopModemSound]);

  const handleDial = () => {
    if (!username.trim()) return;
    clearTimers();
    // ensure any previous ended handler is removed before new dial
    if (audioRef.current && endedHandlerRef.current) {
      audioRef.current.removeEventListener("ended", endedHandlerRef.current);
      endedHandlerRef.current = null;
    }

    setState("dialing");
    setStatusText(`Dialing ${dialValue}...`);

    const audio = getAudio();
    if (endedHandlerRef.current) {
      audio.removeEventListener("ended", endedHandlerRef.current);
    }

    // Connection becomes OK only after the song finishes — use song length
    const onEnded = () => {
      clearTimers();
      setState("connected");
      setStatusText(`Connected at 52,000 bps`);
    };
    endedHandlerRef.current = onEnded;
    audio.addEventListener("ended", onEnded, { once: true });

    const scheduleFromDuration = () => {
      const dur = audio.duration;
      if (isFinite(dur) && dur > 0 && dur < 300) {
        // show "Verifying..." ~2.5s before the end so user sees both phases
        // but keep at least 1s of dialing
        const verifyAtMs = Math.max(1000, (dur - 2.5) * 1000);
        const t1 = window.setTimeout(() => {
          setState("verifying");
          setStatusText("Verifying user name and password...");
        }, verifyAtMs);
        timers.current.push(t1);

        // Fallback: if 'ended' doesn't fire (autoplay blocked, etc.), force connected shortly after duration
        const t2 = window.setTimeout(() => {
          setState((prev) => (prev === "connected" ? prev : "connected"));
          setStatusText((prev) => (prev.includes("Connected") ? prev : `Connected at 52,000 bps`));
        }, dur * 1000 + 400);
        timers.current.push(t2);
      } else {
        // Fallback fixed timings if duration unavailable
        const t1 = window.setTimeout(() => {
          setState("verifying");
          setStatusText("Verifying user name and password...");
        }, 2800);
        const t2 = window.setTimeout(() => {
          setState("connected");
          setStatusText(`Connected at 52,000 bps`);
        }, 5200);
        timers.current.push(t1, t2);
      }
    };

    // If metadata already available, schedule immediately
    if (audio.readyState >= 1 && isFinite(audio.duration) && audio.duration > 0) {
      scheduleFromDuration();
    } else {
      // Wait for metadata, then schedule; also schedule a fallback check shortly after
      const onMeta = () => scheduleFromDuration();
      audio.addEventListener("loadedmetadata", onMeta, { once: true });
      // Fallback in case loadedmetadata never fires (cached, error) — try after short delay
      const fallbackTimer = window.setTimeout(() => {
        if (timers.current.length === 0) scheduleFromDuration();
      }, 600);
      timers.current.push(fallbackTimer);
    }

    try {
      audio.currentTime = 0;
      audio.volume = 0.6;
      const p = audio.play();
      if (p && typeof (p as Promise<void>).catch === "function") {
        (p as Promise<void>).catch(() => {
          // Autoplay blocked — keep timers so UI still progresses based on duration/timeout
        });
      }
    } catch {
      // ignore, fallback timers will still progress
    }
  };

  const handleCancelDialing = () => {
    clearTimers();
    stopModemSound();
    // also clear ended handler ref already done in stopModemSound
    setState("form");
    setStatusText("");
  };

  const handleFinishConnected = () => {
    stopModemSound();
    setState("form");
    onConnected?.();
  };

  return (
    <div className="dcn-window">
      <div className="dcn-banner">
        <svg viewBox="0 0 340 130" className="dcn-banner-svg" aria-hidden="true">
          <defs>
            <linearGradient id="dcnSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3fae" />
              <stop offset="100%" stopColor="#2f6fe0" />
            </linearGradient>
            <radialGradient id="dcnGlobe" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#7fe0a0" />
              <stop offset="55%" stopColor="#2e9e57" />
              <stop offset="100%" stopColor="#0f6b30" />
            </radialGradient>
          </defs>
          <rect width="340" height="130" fill="url(#dcnSky)" />
          <circle cx="170" cy="60" r="38" fill="url(#dcnGlobe)" stroke="#0b4a22" strokeWidth="1" />
          <path
            d="M132 60 Q170 40 208 60 Q170 80 132 60 Z M170 22 Q182 60 170 98 Q158 60 170 22 Z"
            fill="none"
            stroke="#0b4a22"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            d="M40 92 Q100 55 170 78 Q240 100 300 70"
            fill="none"
            stroke="#8fe0ff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* left laptop */}
          <g transform="translate(20,78)">
            <rect x="0" y="18" width="46" height="6" rx="1" fill="#c9d3e0" />
            <rect x="4" y="-6" width="38" height="26" rx="2" fill="#e8edf5" stroke="#9aa7bb" />
            <rect x="7" y="-3" width="32" height="18" fill="#3b6fc4" />
          </g>
          {/* right laptop */}
          <g transform="translate(268,78)">
            <rect x="0" y="18" width="46" height="6" rx="1" fill="#c9d3e0" />
            <rect x="4" y="-6" width="38" height="26" rx="2" fill="#e8edf5" stroke="#9aa7bb" />
            <rect x="7" y="-3" width="32" height="18" fill="#3b6fc4" />
          </g>
        </svg>
      </div>

      <div className="dcn-body">
        <div className="dcn-row">
          <label htmlFor="dcn-user">User name:</label>
          <input
            id="dcn-user"
            className="dcn-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={`Your ${isp} username`}
          />
        </div>

        <div className="dcn-row">
          <label htmlFor="dcn-pass">Password:</label>
          <input
            id="dcn-pass"
            className="dcn-input"
            type="password"
            value={password}
            onFocus={() => setPasswordTouched(true)}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              passwordTouched ? "" : "[To change the saved password, click here]"
            }
          />
        </div>

        <label className="dcn-checkbox">
          <input
            type="checkbox"
            checked={savePassword}
            onChange={(e) => setSavePassword(e.target.checked)}
          />
          Save this user name and password for the following users:
        </label>

        <div className="dcn-radios">
          <label className={!savePassword ? "dcn-disabled" : ""}>
            <input
              type="radio"
              name="dcn-saveFor"
              disabled={!savePassword}
              checked={saveFor === "me"}
              onChange={() => setSaveFor("me")}
            />
            Me only
          </label>
          <label className={!savePassword ? "dcn-disabled" : ""}>
            <input
              type="radio"
              name="dcn-saveFor"
              disabled={!savePassword}
              checked={saveFor === "anyone"}
              onChange={() => setSaveFor("anyone")}
            />
            Anyone who uses this computer
          </label>
        </div>

        <div className="dcn-row">
          <label htmlFor="dcn-dial">Dial:</label>
          <div className="dcn-combo">
            <input
              id="dcn-dial"
              className="dcn-input"
              value={dialValue}
              onChange={(e) => setDialValue(e.target.value)}
            />
            <span className="dcn-combo-arrow">▾</span>
          </div>
        </div>

        <div className="dcn-row">
          <label htmlFor="dcn-from">Dialing from:</label>
          <div className="dcn-combo dcn-combo-narrow">
            <select
              id="dcn-from"
              className="dcn-select"
              value={dialingFrom}
              onChange={(e) => setDialingFrom(e.target.value)}
            >
              <option>New Location</option>
              <option>Home</option>
              <option>Office</option>
            </select>
          </div>
          <button className="dcn-btn" onClick={() => setShowDialingRules(true)}>
            Dialing Rules...
          </button>
        </div>
      </div>

      <div className="dcn-footer">
        <button
          className="dcn-btn dcn-btn-primary"
          disabled={!username.trim()}
          onClick={handleDial}
        >
          Dial
        </button>
        <button className="dcn-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="dcn-btn" onClick={() => setShowProperties(true)}>
          Properties
        </button>
        <button
          className="dcn-btn"
          onClick={() => alert("DCANet Dial-Up Networking Help")}
        >
          Help
        </button>
      </div>

      {state !== "form" && (
        <div className="dcn-overlay">
          <div className="dcn-dialing-modal">
            <div className="dcn-titlebar dcn-titlebar-small">
              <div className="dcn-title">Connect {isp}</div>
              {state !== "connected" && (
                <div className="dcn-title-btns">
                  <button className="dcn-title-btn dcn-close" onClick={handleCancelDialing}>
                    ×
                  </button>
                </div>
              )}
            </div>
            <div className="dcn-dialing-body">
              <div className="dcn-dialing-icon">
                {state === "connected" ? "🖥️" : "☎️"}
                {state !== "connected" && <span className="dcn-dialing-wave" />}
              </div>
              <div className="dcn-dialing-status">{statusText}</div>
              {state !== "connected" && (
                <div className="dcn-dialing-progress">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>
            <div className="dcn-dialing-actions">
              {state !== "connected" ? (
                <button className="dcn-btn" onClick={handleCancelDialing}>
                  Cancel
                </button>
              ) : (
                <button className="dcn-btn dcn-btn-primary" onClick={handleFinishConnected}>
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showDialingRules && (
        <div className="dcn-overlay">
          <div className="dcn-mini-modal">
            <div className="dcn-titlebar dcn-titlebar-small">
              <div className="dcn-title">Dialing Rules</div>
              <div className="dcn-title-btns">
                <button className="dcn-title-btn dcn-close" onClick={() => setShowDialingRules(false)}>
                  ×
                </button>
              </div>
            </div>
            <div className="dcn-mini-body">
              Location: <strong>{dialingFrom}</strong>
              <br />
              Country/region: United States of America (1)
              <br />
              Area code rules configured for this location.
            </div>
            <div className="dcn-dialing-actions">
              <button className="dcn-btn dcn-btn-primary" onClick={() => setShowDialingRules(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showProperties && (
        <div className="dcn-overlay">
          <div className="dcn-mini-modal">
            <div className="dcn-titlebar dcn-titlebar-small">
              <div className="dcn-title">{isp} Properties</div>
              <div className="dcn-title-btns">
                <button className="dcn-title-btn dcn-close" onClick={() => setShowProperties(false)}>
                  ×
                </button>
              </div>
            </div>
            <div className="dcn-mini-body">
              General | Options | Security | Networking | Sharing
              <br />
              Phone number: {dialValue}
              <br />
              Connect using: Standard 56000 bps Modem
            </div>
            <div className="dcn-dialing-actions">
              <button className="dcn-btn dcn-btn-primary" onClick={() => setShowProperties(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialupConnection;