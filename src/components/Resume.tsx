import React, { useState, useRef, useEffect, useCallback } from "react";

const FONT_LINK_ID = "resumexp-fonts";

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Kalam:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const PAPER = {
  yellow: { bg: "#fdf6a3", fold: "#e8dc6e", pin: "#d94848" },
  pink: { bg: "#ffd3e6", fold: "#f0a8c5", pin: "#5b8bd9" },
  blue: { bg: "#c9ecff", fold: "#9fd3ec", pin: "#e8b23a" },
  green: { bg: "#d8f5c2", fold: "#b3e090", pin: "#c94f8b" },
  orange: { bg: "#ffdfae", fold: "#f0bd7d", pin: "#3d7a3d" },
} as const;

const NOTES = [
  {
    id: "header",
    color: "yellow" as keyof typeof PAPER,
    rot: -3,
    w: 320,
    title: "Mehdi Tohidi",
    body: (
      <>
        <div style={{ fontFamily: "Kalam, cursive", fontWeight: 700, fontSize: 15 }}>
          Backend / Full-Stack Developer
        </div>
        <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, opacity: 0.85 }}>
          Flutter · Node.js · Web3
        </div>
        <div style={{ marginTop: 10, fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.7 }}>
          mehditohidi9@gmail.com
          <br />
          github.com/mehditohidi
          <br />
          linkedin.com/in/mehditohidi
          <br />
          Tehran / Remote
        </div>
      </>
    ),
  },
  {
    id: "summary",
    color: "pink" as keyof typeof PAPER,
    rot: 3,
    w: 320,
    title: "Summary",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13.5, lineHeight: 1.6 }}>
        Backend systems, Node.js/TypeScript, Flutter, databases and Web3 apps.
        REST APIs, auth, payment infra, blockchain integrations, DB
        architecture and production deploys — comfortable across the whole
        lifecycle from design to debugging in prod.
      </div>
    ),
  },
  {
    id: "skills",
    color: "blue" as keyof typeof PAPER,
    rot: -2,
    w: 320,
    title: "Core Skills",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.75 }}>
        <b>Languages</b> TS/JS, Dart, Solidity, PHP, SQL, Bash
        <br />
        <b>Backend</b> Node.js, Express, REST, JWT, webhooks
        <br />
        <b>Data</b> PostgreSQL, MongoDB, Redis, Supabase, Firestore
        <br />
        <b>Mobile</b> Flutter, Dart, Android, iOS
        <br />
        <b>Frontend</b> React, TS, Vite, Tailwind
      </div>
    ),
  },
  {
    id: "web3",
    color: "green" as keyof typeof PAPER,
    rot: 2,
    w: 320,
    title: "Web3 / Blockchain",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.7 }}>
        Ethereum, Solana, TRON, BSC · Ethers.js, Hardhat, Solidity
        <br />
        Crypto payment integrations, deposit &amp; withdrawal systems,
        blockchain transaction monitoring, wallet infrastructure.
      </div>
    ),
  },
  {
    id: "devops",
    color: "orange" as keyof typeof PAPER,
    rot: -3,
    w: 320,
    title: "DevOps / Infra",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.7 }}>
        Linux (Ubuntu), Docker/Compose, Nginx, Cloudflare, SSL/Certbot, SSH,
        Git. Comfortable diagnosing prod issues straight from logs, configs
        and network behavior — DNS, CORS, container debugging.
      </div>
    ),
  },
  {
    id: "tamgram",
    color: "pink" as keyof typeof PAPER,
    rot: -2,
    w: 320,
    title: "Project · Tamgram",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.65 }}>
        Social network + restaurant app — Flutter, Dart, Firebase, Firestore.
        <br />
        Provider state mgmt, social feed, wallet + balance, table
        reservations, onboarding &amp; persistent state.
      </div>
    ),
  },
  {
    id: "MedMate",
    color: "yellow" as keyof typeof PAPER,
    rot: -2,
    w: 320,
    title: "Project · MedMate",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.65 }}>
        Social network + Voice/Video Chat App — Flutter, Dart, Firebase, Firestore.
        <br />
        Provider state mgmt, social feed, chatting, groups
        reservations, onboarding &amp; persistent state.
      </div>
    ),
  },
  {
    id: "HamTesti",
    color: "green" as keyof typeof PAPER,
    rot: -2,
    w: 320,
    title: "Project · HamTesti",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.65 }}>
        Duel Challenge — Flutter, Dart, Firebase, Firestore.
        <br />
        A game like Quiz of Kings with a duel challenge system. Users can challenge each other to answer questions and compete for points.
      </div>
    ),
  },
  {
    id: "editor",
    color: "blue" as keyof typeof PAPER,
    rot: 2,
    w: 320,
    title: "Project · Flutter Visual Editor",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.65 }}>
        React, TS, Vite, Flutter. Drag-and-drop visual builder — canvas,
        widget tree, properties panel, built for extensibility.
      </div>
    ),
  },
  {
    id: "web3infra",
    color: "green" as keyof typeof PAPER,
    rot: -3,
    w: 320,
    title: "Web3 Infrastructure",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.65 }}>
        Solana transaction/balance investigation, USDT processing, deposit
        monitoring, withdrawal + fee calc, webhook-based confirmation,
        smart contract dev.
      </div>
    ),
  },
  {
    id: "about",
    color: "orange" as keyof typeof PAPER,
    rot: 3,
    w: 320,
    title: "About Me",
    body: (
      <div style={{ fontFamily: "Kalam, cursive", fontSize: 13, lineHeight: 1.7 }}>
        Strong debugger, backend-first thinker, comfortable across app,
        backend, DB and infra layers. Idea → working infrastructure.
        <br />
        <b>Languages</b> Persian (native), English (professional)
        <br />
        <b>Looking for</b> Backend / Full-Stack / Web3 / Flutter roles,
        remote or international teams.
      </div>
    ),
  },
] as const;

type DragPos = { x: number; y: number };

export default function ResumeStickyWall() {
  useGoogleFonts();

  const [items, setItems] = useState(() => NOTES.map((n) => n));
  const [offsets, setOffsets] = useState<Record<string, DragPos>>({});
  const [zMap, setZMap] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    NOTES.forEach((n, i) => (m[n.id] = NOTES.length - i));
    return m;
  });
  const zCounter = useRef(NOTES.length + 10);
  const draggingId = useRef<string | null>(null);
  const dragStart = useRef<DragPos>({ x: 0, y: 0 });
  const startOffset = useRef<DragPos>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<string | null>(null);

  // ---- container drag (drag all notes together) ----
  const [containerPos, setContainerPos] = useState<DragPos>({ x: 0, y: 0 });
  const containerDragging = useRef(false);
  const containerStart = useRef<DragPos>({ x: 0, y: 0 });
  const containerStartPos = useRef<DragPos>({ x: 0, y: 0 });
  const [isContainerDragging, setIsContainerDragging] = useState(false);

  const bringToFront = useCallback((id: string) => {
    zCounter.current += 1;
    setZMap((prev) => ({ ...prev, [id]: zCounter.current }));
  }, []);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    // don't start drag when clicking close button
    const target = e.target as HTMLElement;
    if (target.closest("[data-close]")) return;

    const isTouch = "touches" in e;
    const clientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    draggingId.current = id;
    dragStart.current = { x: clientX, y: clientY };
    startOffset.current = offsets[id] || { x: 0, y: 0 };
    setDragging(id);
    bringToFront(id);
    // prevent text selection while dragging
    e.preventDefault();
  };

  const handleContainerPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // ignore if clicking close buttons or a note (those have their own drag)
    if (target.closest("[data-close]") || target.closest("[data-note]")) return;
    const isTouch = "touches" in e;
    const clientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    containerDragging.current = true;
    containerStart.current = { x: clientX, y: clientY };
    containerStartPos.current = containerPos;
    setIsContainerDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const isTouch = "touches" in e;
      const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      if (draggingId.current) {
        const dx = clientX - dragStart.current.x;
        const dy = clientY - dragStart.current.y;
        const id = draggingId.current;
        if (!id) return;
        setOffsets((prev) => ({
          ...prev,
          [id]: { x: startOffset.current.x + dx, y: startOffset.current.y + dy },
        }));
      } else if (containerDragging.current) {
        const dx = clientX - containerStart.current.x;
        const dy = clientY - containerStart.current.y;
        setContainerPos({ x: containerStartPos.current.x + dx, y: containerStartPos.current.y + dy });
      }
    };

    const onUp = () => {
      draggingId.current = null;
      setDragging(null);
      containerDragging.current = false;
      setIsContainerDragging(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false } as any);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const handleClose = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    // clean up offsets/z
    setOffsets((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCloseAll = () => {
    setItems([]);
    setOffsets({});
  };

  const handleReset = () => {
    setItems(NOTES.map((n) => n));
    setOffsets({});
    setContainerPos({ x: 0, y: 0 });
    const m: Record<string, number> = {};
    NOTES.forEach((n, i) => (m[n.id] = NOTES.length - i));
    setZMap(m);
    zCounter.current = NOTES.length + 10;
  };



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        background: "transparent",
        boxSizing: "border-box",
        overflow: "visible",
        pointerEvents: "none",
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
      }}
    >
      <div
        style={{
          transform: `translate(${containerPos.x}px, ${containerPos.y}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "auto",
          overflow: "visible",
          maxWidth: "100%",
          willChange: "transform",
          cursor: isContainerDragging ? "grabbing" : undefined,
        }}
      >
        {/* draggable handle + Close All — drags all notes together */}
        {items.length > 0 && (
          <div
            onMouseDown={handleContainerPointerDown}
            onTouchStart={handleContainerPointerDown}
            style={{
              marginBottom: 8,
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "4px 10px 4px 8px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.38)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              cursor: isContainerDragging ? "grabbing" : "grab",
              touchAction: "none",
              userSelect: "none",
            }}
            title="Drag to move all notes together"
          >
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: 2, lineHeight: 1 }}>⋮⋮</span>
            <span style={{ fontFamily: "Kalam, cursive", fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>Drag all</span>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)", margin: "0 2px" }} />
            <button
              onClick={handleCloseAll}
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.18)",
                background: "rgba(220, 55, 55, 0.92)",
                color: "#fff",
                fontFamily: "Kalam, cursive",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
              title="Close all sticky notes"
            >
              Close All ×
            </button>
            <span style={{ fontFamily: "Kalam, cursive", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>
              {items.length} notes
            </span>
          </div>
        )}
        <div
          style={{
            position: "relative",
            width: "min(380px, 92vw)",
            height: "min(520px, calc(100vh - 150px))",
            maxWidth: "100%",
            pointerEvents: "auto",
            overflow: "visible",
          }}
        >
        {items.map((note, idx) => {
          const palette = PAPER[note.color];
          const off = offsets[note.id] || { x: 0, y: 0 };
          const isDragging = dragging === note.id;
          const depth = idx;
          const baseX = Math.min(depth * 6, 28);
          const baseY = Math.min(depth * 6, 28);
          return (
            <div
              key={note.id}
              data-note
              onMouseDown={(e) => handlePointerDown(e, note.id)}
              onTouchStart={(e) => handlePointerDown(e, note.id)}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translate(${baseX + off.x}px, ${baseY + off.y}px)`,
                zIndex: zMap[note.id] ?? NOTES.length - idx,
                transition: isDragging ? "none" : "transform 200ms cubic-bezier(.2,.8,.2,1)",
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
                willChange: "transform",
                filter: isDragging ? "drop-shadow(0 14px 20px rgba(0,0,0,0.45))" : undefined,
              }}
            >
              <div
                style={{
                  width: note.w,
                  maxWidth: "min(320px, 92vw)",
                  transform: `rotate(${note.rot}deg)`,
                  position: "relative",
                  transition: isDragging ? "none" : "transform 160ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!dragging) (e.currentTarget as HTMLElement).style.transform = `rotate(0deg) scale(1.02)`;
                }}
                onMouseLeave={(e) => {
                  if (!dragging) (e.currentTarget as HTMLElement).style.transform = `rotate(${note.rot}deg)`;
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -11,
                    left: "50%",
                    marginLeft: -9,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, #fff8 0%, ${palette.pin} 40%, #0004 100%)`,
                    boxShadow: "0 3px 4px rgba(0,0,0,0.45)",
                    border: "1px solid rgba(0,0,0,0.15)",
                    zIndex: 2,
                  }}
                />
                {/* close button */}
                <button
                  data-close
                  aria-label="Close note"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose(note.id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.15)",
                    background: "rgba(255,255,255,0.7)",
                    color: "#555",
                    fontSize: 14,
                    lineHeight: "18px",
                    textAlign: "center",
                    cursor: "pointer",
                    zIndex: 3,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                  title="Close"
                >
                  ×
                </button>

                <div
                  style={{
                    background: palette.bg,
                    padding: "18px 16px 22px",
                    boxShadow:
                      "3px 6px 10px rgba(0,0,0,0.28), inset 0 -16px 16px -16px rgba(0,0,0,0.12)",
                    position: "relative",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Caveat, cursive",
                      fontWeight: 700,
                      fontSize: 20,
                      marginBottom: 7,
                      color: "#2b2b2b",
                      borderBottom: "1px dashed rgba(0,0,0,0.25)",
                      paddingBottom: 4,
                      paddingRight: 18,
                    }}
                  >
                    {note.title}
                  </div>
                  <div style={{ color: "#3a3a3a" }}>{note.body}</div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: "0 0 18px 18px",
                      borderColor: `transparent transparent ${palette.fold} transparent`,
                      filter: "drop-shadow(-1px -1px 2px rgba(0,0,0,0.22))",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

        {items.length < NOTES.length && (
          <button
            onClick={handleReset}
            style={{
              marginTop: 10,
              pointerEvents: "auto",
              padding: "5px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.85)",
              fontFamily: "Kalam, cursive",
              fontSize: 12,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            Restore {NOTES.length - items.length} closed note{NOTES.length - items.length > 1 ? "s" : ""}
          </button>
        )}
      </div>
    </div>
  );
}
