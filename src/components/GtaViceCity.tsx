import React, { useEffect, useState, useRef } from "react";
import "./GtaViceCity.css";

interface Props {
  onCrash: () => void;
  onClose?: () => void;
  onFullscreen?: () => void;
}

const GtaViceCity: React.FC<Props> = ({ onCrash, onClose, onFullscreen }) => {
  const [progress, setProgress] = useState(0);
  const [showIframe, setShowIframe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasCrashed = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(0);
    setShowIframe(false);
    setIsLoading(true);
    hasCrashed.current = false;

    const progInterval = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 99) return 99;
        const inc = p < 60 ? 8 + Math.random() * 8 : p < 85 ? 4 + Math.random() * 4 : 1.2 + Math.random() * 1.8;
        return Math.min(99, p + inc);
      });
    }, 180);

    // Show iframe after 3 seconds
    const iframeTimer = window.setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
      setShowIframe(true);
      window.clearInterval(progInterval);
    }, 3000);

    return () => {
      window.clearInterval(progInterval);
      window.clearTimeout(iframeTimer);
    };
  }, []);

  // auto full-screen after 2 seconds
  useEffect(() => {
    const t = window.setTimeout(() => {
      onFullscreen?.();
      const el: any = wrapRef.current || document.getElementById("windowGTA");
      if (el && !document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el && (el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    }, 2000);
    return () => window.clearTimeout(t);
  }, [onFullscreen]);

  // exit fullscreen when component unmounts
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, []);

  return (
    <div ref={wrapRef} className="gta-wrap" style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Loading Screen - Hidden when iframe is shown */}
      {isLoading && (
        <>
          <div className="gta-bg" />
          <img
            id="gtaSplash"
            className="gta-splash"
            src={require("../img/gtasplash.png")}
            alt="GTA Vice City"
          />
          <div className="gta-vignette" />
          <div className="gta-content" />

          {/* Footer with full-width loading bar */}
          <div className="gta-footer">
            <div className="gta-progress-track gta-progress-track--footer">
              <div
                className="gta-progress-fill"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #7c4dff, #b388ff, #e040fb)'
                }}
              />
              <div className="gta-progress-glow" />
            </div>
            <div className="gta-footer-row">
              <span>© 2002 Rockstar Games</span>
              <span style={{ opacity: 0.7 }}>v1.0 — DirectPlay</span>
            </div>
          </div>
        </>
      )}

      {/* Iframe - Shows after 3 seconds */}
      {showIframe && (
        <iframe
          src="https://gta.mehditohidi.ir/"
          style={{ 
            width: "100%", 
            height: "100vh", 
            border: "none",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20
          }}
          allow="fullscreen; autoplay; gamepad"
          allowFullScreen
          title="GTA Vice City"
        />
      )}
    </div>
  );
};

export default GtaViceCity;