import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "./Media.css";
import "./Explorer.css";
import "./Notepad.css";
import Browser from "./Browser";
import myComputerIcon from "./img/computer.png";
import fileIcon from "./img/mp3.png";
import jackson from "./music/music.mp3";
import shajaryan from "./music/shajaryan.mp3";
import { chrome, game, notepadImg, galleryIcon, dialup, taskmanager, snake, tictactoe, minesweeper, calculator, paint, vscodeIcon, gtaViceCity, virusIcon } from "./img";
import "./Properties.css";
import bg from "./img/bg.jpg";
import bg2 from "./img/bg4.jpg";
import bg3 from "./img/bg3.jpg";
import bg4 from "./img/bg2.jpg";
import {
  computer,
  profileImg,
  startIcon,
  trashbin,
  cmd,
  instagram,
  linkedin,
  telegram,
  email,
  mediaPlayer,
  off,
  myDocuments,
  runApp,
  help,
  controlPanel,
  searchIcon,
  mediaMenu,
  dance,
  textIcon,
  bootLogo
} from "./img";
import Notepad from "./Notepad";
import Calculator from "./components/Calculator";
import Paint from "./components/Paint";
import RunDialog from "./components/RunDialog";
import Window from "./components/Window";
import Minesweeper from "./components/Minesweeper";
import TicTacToe from "./components/TicTacToe";
import GalleryViewer from "./components/GalleryViewer";
import TaskManager from "./components/TaskManager";
import MyComputer from "./components/MyComputer";
import RecycleBin from "./components/RecycleBin";
import Snake from "./components/Snake";
import Dialup from "./components/Dialup";
import Resume from "./components/Resume";
import VSCode from "./components/VSCode";
import XPError from "./components/XPError";
import GtaViceCity from "./components/GtaViceCity";

//Notepad TEXT

export const initial =
  "welcome! make here your own windows! I hope you liked my website! I know it still needs more programs but it's not gonna be just windows XP! allrights are reserved to Mehditohidi.com and the windows xp rights are reserved to microsoft.com :). If you want to create cool websites get in touch with me through these ways: Email: Mehditohidi9@gmail.com | LinkedIn: @mehditohidi | Telegram: @themeht";

const App: React.FC = () => {
  const [commands, setCommands] = useState<string[]>([]);
  const musicRef = useRef<HTMLAudioElement>(null);
  const music = musicRef.current;

  // Professional: boot, clock, run, calendar, maximized
  const [booting, setBooting] = useState(true);
  const [showRun, setShowRun] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [now, setNow] = useState(new Date());
  const [maximized, setMaximized] = useState<{ [key: string]: boolean }>({});
  const [minimized, setMinimized] = useState<{ [key: string]: boolean }>({});
  const [volume, setVolume] = useState(0.8);
  const [deletedItems, setDeletedItems] = useState<Array<{id:string;name:string}>>([]);
  const [startupErrors, setStartupErrors] = useState<Array<{ id: number; title: string; message: string; x: number; y: number }>>([]);

  //Bring the apps to front!

  const [zIndex, setZIndex] = useState<{ [key: string]: number }>({
    windowCmd: 1,
    windowMehdi: 1,
    windowMedia: 1,
    windowExplorer: 1,
    windowBrowser: 1,
    windowNote: 1,
    windowProperties: 1,
    windowgame: 1,
    windowCalculator: 1,
    windowPaint: 1,
    windowMinesweeper: 1,
    windowTicTacToe: 1,
    windowGallery: 1,
    windowTaskManager: 1,
    windowMyComputer: 1,
    windowRecycleBin: 1,
    windowSnake: 1,
    windowDialup: 1,
    windowVSCode: 1,
    windowGTA: 1,
  });
  const bringToFront = (windowId: string) => {
    setZIndex((prevZIndex) => {
      const newZIndex = { ...prevZIndex };
      Object.keys(newZIndex).forEach((id) => {
        if (id === windowId) {
          newZIndex[id] = Math.max(...Object.values(newZIndex)) + 1;
        }
      });
      return newZIndex;
    });
  };

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = secs.toString().padStart(2, "0");
    return `${minutesStr}:${secondsStr}`;
  }

  const lights = document.querySelector(".party-lights") as HTMLElement | null;
  const dancing = document.querySelector(".dancing") as HTMLElement | null;

  const [files] = useState([
    { name: "Info.txt", icon: textIcon },
    { name: "Shajaryan.mp3", icon: fileIcon },
    { name: "Micheal Jackson.mp3", icon: fileIcon },
  ]);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(
    null
  );

  const [noteText, setNoteText] = useState("welcome! make here your home!");
  const [isfromfile, setisfromfile] = useState<boolean>(false);

  const progressRef = useRef<HTMLDivElement>(null);
  const [refreshTime, setRefreshTime] = useState<number>(0);
  const [musicTime, setMusicTime] = useState<number>(0);

  //default positions for apps on launch

  // new positions

  const [position, setPosition] = useState<{
    [key: string]: { x: number; y: number };
  }>({
    windowCmd: { x: 49, y: 10 },
    windowMehdi: { x: 40, y: 200 },
    windowMedia: { x: 54, y: 50 },
    windowExplorer: { x: 60, y: 60 },
    windowBrowser: { x: 64, y: 50 },
    windowNote: { x: 54, y: 50 },
    windowProperties: { x: 62, y: 42 },
    windowgame: { x: 10, y: 0 },
    windowCalculator: { x: 120, y: 80 },
    windowPaint: { x: 80, y: 40 },
    windowMinesweeper: { x: 140, y: 60 },
    windowTicTacToe: { x: 160, y: 90 },
    windowGallery: { x: 100, y: 40 },
    windowTaskManager: { x: 200, y: 80 },
    windowMyComputer: { x: 180, y: 100 },
    windowRecycleBin: { x: 220, y: 120 },
    windowSnake: { x: 300, y: 80 },
    windowDialup: {x:500, y: 90},
    windowVSCode: { x: 80, y: 30 },
    windowGTA: { x: 140, y: 40 }
  });

  // === Virus file — deleting it prevents future XP errors (persisted) ===
  const VIRUS_ID = "virus-exe";
  const VIRUS_NAME = "virus.exe";
  const VIRUS_FLAG = "virusDeleted";
  const BUILT_IN_IDS = ["myComputer","recycleBin","mediaPlayer","browser","profile","commandPrompt","notepad","game","minesweeper","tictactoe","snake","gallery","shajaryan","jackson","calculator","paint","taskManager","dialup","vscode","gtaViceCity","run"];
  const isVirusDeleted = () => {
    try { return localStorage.getItem(VIRUS_FLAG) === "true"; } catch { return false; }
  };

  // === Desktop icons: draggable + file creation ===
  const [desktopItems, setDesktopItems] = useState<Array<{ id: string; name: string; icon: string; kind: "folder" | "text"; x: number; y: number }>>([]);
  // spawn virus file on first load unless user deleted it
  useEffect(() => {
    if (isVirusDeleted()) return;
    setDesktopItems((prev) => {
      if (prev.some((d) => d.id === VIRUS_ID)) return prev;
      // avoid stacking on mobile
      const vx = window.innerWidth < 700 ? 140 : 420;
      return [...prev, { id: VIRUS_ID, name: VIRUS_NAME, icon: virusIcon, kind: "text", x: vx, y: 80 }];
    });
  }, []);
  const [hiddenIcons, setHiddenIcons] = useState<Set<string>>(new Set());
  const [iconPositions, setIconPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const iconDragOffset = useRef({ x: 0, y: 0 });
  const pendingIconDrag = useRef<string | null>(null);
  const pendingIconStart = useRef({ x: 0, y: 0 });
  const [iconContextMenu, setIconContextMenu] = useState<{ x: number; y: number; targetId: string } | null>(null);
  const lastDesktopClickPos = useRef<{ x: number; y: number } | null>(null);

  const [size, setSize] = useState({ width: 300, height: 400 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 600, height: 400 });
  const [startMenuOpened, setStartMenuOpened] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const clickTimeout = useRef<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const startSelectionCoords = useRef<{ x: number; y: number } | null>(null);
  let currentMusic = 0;
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    // desktop background right-click — remember pos for New Folder/Text
    lastDesktopClickPos.current = { x: event.clientX, y: event.clientY };
    const menuW = 252;
    const menuH = 340;
    let x = event.clientX;
    let y = event.clientY;
    if (x + menuW > window.innerWidth) x = window.innerWidth - menuW - 4;
    if (y + menuH > window.innerHeight) y = window.innerHeight - menuH - 32;
    setIconContextMenu(null);
    setContextMenu({ x, y });
  };

  const handleMenuItemClick = (action: string) => {
    setContextMenu(null);
    switch (action) {
      case "refresh":
        setRefreshTime((refreshTime || 0) + 1);
        const icons = document.querySelector(".icons") as HTMLElement | null;
        if (icons) {
          icons.style.display = "none";
          setTimeout(() => {
            icons.style.display = "flex";
          }, 200);
        }
        break;
      case "properties":
        handleProgramDoubleClick("properties");
        break;
      case "arrange-name":
        setDesktopItems((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        // also reset positions to grid
        setIconPositions({});
        break;
      case "arrange-type":
        setDesktopItems((prev) => [...prev].sort((a, b) => a.kind.localeCompare(b.kind)));
        setIconPositions({});
        break;
      case "arrange-auto":
        setIconPositions({});
        setDesktopItems((prev) => prev.map((it, idx) => ({ ...it, x: (idx % 4) * 90 + 10, y: Math.floor(idx / 4) * 90 + 10 })));
        break;
      case "new-folder": {
        const base = lastDesktopClickPos.current || { x: 120 + desktopItems.length * 20, y: 120 + desktopItems.length * 10 };
        const id = `folder-${Date.now()}`;
        const count = desktopItems.filter((d) => d.kind === "folder").length + 1;
        const name = count === 1 ? "New Folder" : `New Folder (${count})`;
        setDesktopItems((prev) => [...prev, { id, name, icon: myDocuments, kind: "folder", x: base.x, y: base.y }]);
        setSelectedWindow(id);
        break;
      }
      case "new-text": {
        const base = lastDesktopClickPos.current || { x: 140 + desktopItems.length * 20, y: 140 + desktopItems.length * 10 };
        const id = `text-${Date.now()}`;
        const count = desktopItems.filter((d) => d.kind === "text").length + 1;
        const name = count === 1 ? "New Text Document.txt" : `New Text Document (${count}).txt`;
        setDesktopItems((prev) => [...prev, { id, name, icon: textIcon, kind: "text", x: base.x, y: base.y }]);
        setNoteText("");
        setSelectedWindow(id);
        break;
      }
      case "new-shortcut":
        handleProgramDoubleClick("browser");
        break;
      case "instagram":
        window.open("https://instagram.com/themeht_", "_blank");
        break;
        case "linkedin":
        window.open("https://linkedin.com/in/mehditohidi", "_blank");
        break;
      case "telegram":
        window.open("https://t.me/Themeht", "_blank");
        break;
      case "contact":
        window.open("mailto:mehditohidi9@gmail.com", "_blank");
        break;
      case "undo":
      default:
        break;
    }
  };

  const handleIconContextMenu = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleProgramClick(targetId);
    const menuW = 220;
    const menuH = 280;
    let x = e.clientX;
    let y = e.clientY;
    if (x + menuW > window.innerWidth) x = window.innerWidth - menuW - 4;
    if (y + menuH > window.innerHeight) y = window.innerHeight - menuH - 32;
    setContextMenu(null);
    setIconContextMenu({ x, y, targetId });
  };

  const handleIconMenuAction = (action: string, targetId: string) => {
    setIconContextMenu(null);
    const isCustom = desktopItems.some((d) => d.id === targetId);
    switch (action) {
      case "open":
        if (isCustom) {
          const item = desktopItems.find((d) => d.id === targetId);
          if (item?.kind === "folder") handleProgramDoubleClick("documents");
          else if (item?.kind === "text") { setNoteText(`Content of ${item.name}`); handleProgramDoubleClick("notepad"); }
        } else {
          handleProgramDoubleClick(targetId);
        }
        break;
      case "rename": {
        const cur = desktopItems.find((d) => d.id === targetId)?.name || targetId;
        const next = window.prompt("Rename:", cur);
        if (next && next.trim()) {
          setDesktopItems((prev) => prev.map((d) => (d.id === targetId ? { ...d, name: next.trim() } : d)));
        } else if (!isCustom) {
          // for built-in icons, just show alert (XP would rename)
          window.alert("Renaming system icons not allowed in demo.");
        }
        break;
      }
      case "delete":
        if (targetId === "recycleBin") {
          window.alert("Recycle Bin cannot be deleted.");
          break;
        }
        {
          let name = targetId;
          const isBuilt = BUILT_IN_IDS.includes(targetId);
          const custItem = desktopItems.find((d) => d.id === targetId);
          const isCust = !!custItem;
          if (isCust && custItem) {
            name = custItem.name;
            setDeletedItems((prev) => (prev.some((d) => d.id === targetId) ? prev : [...prev, { id: targetId, name }]));
            setDesktopItems((prev) => prev.filter((d) => d.id !== targetId));
          } else if (isBuilt) {
            const map: Record<string,string> = {
              myComputer:"My Computer", mediaPlayer:"Media Player", browser:"Internet Browser", profile:"Mehdi Tohidi", commandPrompt:"Command Prompt", notepad:"Notepad", game:"T-Rex Game", minesweeper:"Minesweeper", tictactoe:"Tic-Tac-Toe", snake:"Snake", gallery:"Pictures", shajaryan:"Shajaryan.mp3", jackson:"Micheal Jackson.mp3", calculator:"Calculator", paint:"Paint", taskManager:"Task Manager", dialup:"Dial Up", vscode:"VS Code", gtaViceCity:"Grand Theft Auto Vice City", run:"Run"
            };
            name = map[targetId] || targetId;
            setHiddenIcons((prev) => new Set(prev).add(targetId));
            setIconPositions((prev) => {
              const { [targetId]: _, ...rest } = prev as any;
              return rest;
            });
            setDeletedItems((prev) => (prev.some((d) => d.id === targetId) ? prev : [...prev, { id: targetId, name }]));
          } else {
            // fallback for unknown
            setDeletedItems((prev) => (prev.some((d) => d.id === targetId) ? prev : [...prev, { id: targetId, name }]));
          }
          if (targetId === VIRUS_ID) {
            try { localStorage.setItem(VIRUS_FLAG, "true"); } catch {}
          }
          setSelectedWindow(null);
        }
        break;
      case "cut":
      case "copy":
        // placeholder - XP would copy to clipboard
        break;
      case "properties":
        handleProgramDoubleClick("properties");
        break;
      case "send-to":
        break;
      default:
        break;
    }
  };

  const isOverTrash = (draggedId: string) => {
    if (!draggedId || draggedId === "recycleBin") return false;
    const trashEl = document.querySelector('[data-icon-id="recycleBin"]') as HTMLElement | null;
    const draggedEl = document.querySelector(`[data-icon-id="${draggedId}"]`) as HTMLElement | null;
    if (!trashEl || !draggedEl) return false;
    const tr = trashEl.getBoundingClientRect();
    const dr = draggedEl.getBoundingClientRect();
    // check intersection with small tolerance
    const overlap = !(dr.right < tr.left - 12 || dr.left > tr.right + 12 || dr.bottom < tr.top - 12 || dr.top > tr.bottom + 12);
    return overlap;
  };

  const handleTrashDrop = (draggedId: string) => {
    if (!draggedId || draggedId === "recycleBin") return false;
    if (!isOverTrash(draggedId)) return false;
    const isBuiltIn = BUILT_IN_IDS.includes(draggedId);
    const isCustom = desktopItems.some((d) => d.id === draggedId);
    let name = draggedId;
    if (isBuiltIn) {
      const map: Record<string,string> = {
        myComputer:"My Computer", recycleBin:"Recycle Bin", mediaPlayer:"Media Player", browser:"Internet Browser", profile:"Mehdi Tohidi", commandPrompt:"Command Prompt", notepad:"Notepad", game:"T-Rex Game", minesweeper:"Minesweeper", tictactoe:"Tic-Tac-Toe", snake:"Snake", gallery:"Pictures", shajaryan:"Shajaryan.mp3", jackson:"Micheal Jackson.mp3", calculator:"Calculator", paint:"Paint", taskManager:"Task Manager", dialup:"Dial Up", vscode:"VS Code", gtaViceCity:"Grand Theft Auto Vice City", run:"Run"
      };
      name = map[draggedId] || draggedId;
    } else if (isCustom) {
      const item = desktopItems.find((d) => d.id === draggedId);
      if (item) name = item.name;
    }
    // hide from desktop
    if (isBuiltIn) {
      setHiddenIcons((prev) => new Set(prev).add(draggedId));
      setIconPositions((prev) => {
        const { [draggedId]: _, ...rest } = prev as any;
        return rest;
      });
    } else if (isCustom) {
      setDesktopItems((prev) => prev.filter((d) => d.id !== draggedId));
    }
    setDeletedItems((prev) => {
      if (prev.some((d) => d.id === draggedId)) return prev;
      return [...prev, { id: draggedId, name }];
    });
    if (draggedId === VIRUS_ID) {
      try { localStorage.setItem(VIRUS_FLAG, "true"); } catch {}
    }
    setSelectedWindow(null);
    return true;
  };

  const handleIconMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return;
    handleProgramClick(id);
    const startX = e.clientX;
    const startY = e.clientY;
    // remember pending drag — actual drag starts only after 5px movement so double-click stays responsive
    pendingIconDrag.current = id;
    pendingIconStart.current = { x: startX, y: startY };
    const isCustom = desktopItems.some((d) => d.id === id);
    const pos = isCustom ? (desktopItems.find((d)=>d.id===id) || {x:0,y:0} as any) : (iconPositions[id] || { x: 0, y: 0 });
    iconDragOffset.current = { x: startX - (pos as any).x, y: startY - (pos as any).y };
    e.stopPropagation();
  };

  // Icon drag: global mouse handling — free dragging everywhere
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // pending drag -> check threshold (smaller for easier drag)
      if (pendingIconDrag.current && !draggingIcon) {
        const dx = e.clientX - pendingIconStart.current.x;
        const dy = e.clientY - pendingIconStart.current.y;
        if (Math.hypot(dx, dy) > 2) {
          setDraggingIcon(pendingIconDrag.current);
        } else {
          return;
        }
      }
      if (!draggingIcon) return;
      // free dragging — no viewport clamping, just keep roughly on screen with loose bounds
      const newX = e.clientX - iconDragOffset.current.x;
      const newY = e.clientY - iconDragOffset.current.y;
      const isCustom = desktopItems.some((d) => d.id === draggingIcon);
      if (isCustom) {
        setDesktopItems((prev) => prev.map((d) => (d.id === draggingIcon ? { ...d, x: newX, y: newY } : d)));
      } else {
        setIconPositions((prev) => ({ ...prev, [draggingIcon]: { x: newX, y: newY } }));
      }
    };
    const onUp = () => {
      const dragged = draggingIcon;
      if (dragged && isOverTrash(dragged)) {
        handleTrashDrop(dragged);
      }
      pendingIconDrag.current = null;
      setDraggingIcon(null);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [draggingIcon, desktopItems, hiddenIcons]);

  // Touch drag for icons — same pending threshold
  const handleIconTouchStart = (e: React.TouchEvent, id: string) => {
    handleProgramClick(id);
    const touch = e.touches[0];
    pendingIconDrag.current = id;
    pendingIconStart.current = { x: touch.clientX, y: touch.clientY };
    const isCustom = desktopItems.some((d) => d.id === id);
    const pos = isCustom ? (desktopItems.find((d)=>d.id===id) || {x:0,y:0} as any) : (iconPositions[id] || { x: 0, y: 0 });
    iconDragOffset.current = { x: touch.clientX - (pos as any).x, y: touch.clientY - (pos as any).y };
  };
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (pendingIconDrag.current && !draggingIcon) {
        const dx = touch.clientX - pendingIconStart.current.x;
        const dy = touch.clientY - pendingIconStart.current.y;
        if (Math.hypot(dx, dy) > 2) setDraggingIcon(pendingIconDrag.current);
        else return;
      }
      if (!draggingIcon) return;
      const newX = touch.clientX - iconDragOffset.current.x;
      const newY = touch.clientY - iconDragOffset.current.y;
      const isCustom = desktopItems.some((d) => d.id === draggingIcon);
      if (isCustom) {
        setDesktopItems((prev) => prev.map((d) => (d.id === draggingIcon ? { ...d, x: newX, y: newY } : d)));
      } else {
        setIconPositions((prev) => ({ ...prev, [draggingIcon]: { x: newX, y: newY } }));
      }
    };
    const onTouchEnd = () => {
      const dragged = draggingIcon;
      if (dragged && isOverTrash(dragged)) {
        handleTrashDrop(dragged);
      }
      pendingIconDrag.current = null; setDraggingIcon(null);
    };
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [draggingIcon, desktopItems, hiddenIcons]);

  // Trash hover highlight — when dragging over recycle bin
  useEffect(() => {
    const trashEl = document.querySelector('[data-icon-id="recycleBin"]') as HTMLElement | null;
    if (!trashEl) return;
    if (draggingIcon && draggingIcon !== "recycleBin" && isOverTrash(draggingIcon)) {
      trashEl.classList.add("trash-hover");
    } else {
      trashEl.classList.remove("trash-hover");
    }
  }, [draggingIcon, iconPositions, desktopItems]);

  // Professional: live clock + boot + music progress (fixed leak)
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1800);
    return () => clearTimeout(t);
  }, []);
  // Show 5 XP errors 5s after startup, one every 450ms (error.html spawnTimer 450) — suppressed if virus.exe deleted
  useEffect(() => {
    if (!booting) {
      if (isVirusDeleted()) return;
      const titles = ["System Error","Application Error","Explorer.exe","Critical Error","Windows - Error"];
      const messages = [
        "A fatal exception 0E has occurred at 0028:C0011E36. The current application will be terminated.",
        "Explorer.exe has encountered a problem and needs to close.",
        "The instruction at 0x77f4a1d0 referenced memory at 0x00000000. The memory could not be read.",
        "A required .DLL file, USER32.DLL, was not found.",
        "Your computer has run out of virtual memory.",
      ];
      let spawnTimer: number | null = null;
      let spawnCount = 0;
      const spawnOne = () => {
        if (isVirusDeleted()) {
          if (spawnTimer) window.clearInterval(spawnTimer);
          return;
        }
        if (spawnCount >= 5) {
          if (spawnTimer) window.clearInterval(spawnTimer);
          return;
        }
        const baseX = Math.max(20, window.innerWidth / 2 - 170);
        const baseY = Math.max(20, window.innerHeight / 2 - 120);
        const idx = spawnCount;
        const err = {
          id: Date.now() + idx + Math.floor(Math.random() * 1000),
          title: titles[idx % titles.length],
          message: messages[idx % messages.length],
          x: Math.min(window.innerWidth - 360, Math.max(20, baseX + (idx % 3) * 28 + (Math.random() * 18 - 9))),
          y: Math.min(window.innerHeight - 220, Math.max(20, baseY + Math.floor(idx / 3) * 34 + (Math.random() * 18 - 9))),
        };
        setStartupErrors((prev) => [...prev, err]);
        spawnCount += 1;
      };
      const t = window.setTimeout(() => {
        spawnOne(); // first at 5s
        spawnTimer = window.setInterval(spawnOne, 450);
      }, 5000);
      return () => {
        window.clearTimeout(t);
        if (spawnTimer) window.clearInterval(spawnTimer);
      };
    }
  }, [booting]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    const id = window.setInterval(() => {
      const m = musicRef.current;
      const p = progressRef.current;
      if (m && p && !m.paused && m.duration) {
        setMusicTime(Math.round(m.currentTime));
        const barTime = (m.currentTime / m.duration) * 100;
        p.style.width = barTime.toFixed(2) + "%";
      }
    }, 500);
    return () => clearInterval(id);
  }, []);
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.closest(".context-menu")) {
      setContextMenu(null);
      setIconContextMenu(null);
    }

    if (target.closest(".menu-column")) {
      const startMenu = document.querySelector(
        ".start-menu"
      ) as HTMLElement | null;
      if (startMenu) {
        setStartMenuOpened(false);
        startMenu.style.display = "none";
      }
    }

    if (!target.closest(".window") && !target.closest(".program")) {
      setSelectedWindow(null);
    }
    if (!target.closest(".start-menu") && !target.closest(".taskbar")) {
      const startMenu = document.querySelector(
        ".start-menu"
      ) as HTMLElement | null;
      if (startMenu) {
        setStartMenuOpened(false);
        startMenu.style.display = "none";
      }
    }
    if (!target.closest("#images") && !target.closest(".user-image")) {
      const myImage = document.querySelector(
        ".imageShow"
      ) as HTMLElement | null;
      if (myImage) {
        myImage.style.display = "none";
      }
    }
    if (target.closest(".user-image")) {
      const startMenu = document.querySelector(
        ".start-menu"
      ) as HTMLElement | null;
      if (startMenu) {
        setStartMenuOpened(false);
        startMenu.style.display = "none";
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const centerWindow = () => {
      setPosition((prev) => ({
        ...prev,
        windowCmd: { x: 49, y: 10 },
        windowMehdi: { x: 40, y: 200 },
        windowMedia: { x: 54, y: 50 },
        windowExplorer: { x: 60, y: 60 },
        windowBrowser: { x: 64, y: 50 },
        windowNote: { x: 54, y: 50 },
        windowProperties: { x: 62, y: 42 },
        windowgame: { x: 10, y: 0 },
      }));
    };

    window.addEventListener("resize", centerWindow);
    return () => window.removeEventListener("resize", centerWindow);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    if (e.button === 0) {
      bringToFront(id);
      setDragging(true);
      setDraggingElementId(id);
      offset.current = {
        x: e.clientX - (position[id]?.x ?? 0),
        y: e.clientY - (position[id]?.y ?? 0),
      };
    } else if (e.button === 2) {
      handleContextMenu(e);
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    elementId: string
  ) => {
    setDragging(true);
    console.log("TouchStart Triggered for element:", elementId);
    const touch = e.touches[0];
    bringToFront(elementId);
    setDraggingElementId(elementId);

    const element = document.querySelector(`#${elementId}`) as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      console.log("Element Rect:", rect);
      offset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      console.log("Offset Set:", offset.current);
    } else {
      console.error("Element not found:", elementId);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging && draggingElementId) {
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;

      // Apply constraints
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + size.width > window.innerWidth)
        newX = window.innerWidth - size.width;
      if (newY + size.height > window.innerHeight)
        newY = window.innerHeight - size.height;

      // Update the position for the dragged element
      setPosition((prevPosition) => ({
        ...prevPosition,
        [draggingElementId]: { x: newX, y: newY },
      }));
    } else if (isSelecting && startSelectionCoords.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const startX = startSelectionCoords.current.x;
        const startY = startSelectionCoords.current.y;
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        setSelection({
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
        });
      }
    }
  };

  const partyLights = document.getElementById("partyLights");
  // Function to turn on the party lights
  function turnOnLights() {
    if (partyLights) {
      partyLights.classList.add("on");
    }
  }

  // Function to turn off the party lights
  function turnOffLights() {
    if (partyLights) {
      partyLights.classList.remove("on");
    }
  }

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setIsSelecting(false);

    // Optionally, finalize the selection rectangle here if needed
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setResizing(true);
    offset.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && draggingElementId) {
        // Dragging logic
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;

        // Apply constraints to prevent the window from going outside the viewport
        const windowWidth = size.width;
        const windowHeight = size.height;
        const constrainedX = Math.max(
          0,
          Math.min(newX, window.innerWidth - windowWidth)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, window.innerHeight - windowHeight)
        );

        setPosition((prevPosition) => ({
          ...prevPosition,
          [draggingElementId]: { x: constrainedX, y: constrainedY },
        }));
      } else if (resizing) {
        setSize({
          width: startSize.current.width + (e.clientX - offset.current.x),
          height: startSize.current.height + (e.clientY - offset.current.y),
        });
      } else if (isSelecting && startSelectionCoords.current) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const startX = startSelectionCoords.current.x;
          const startY = startSelectionCoords.current.y;
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;

          setSelection({
            x: Math.min(startX, currentX),
            y: Math.min(startY, currentY),
            width: Math.abs(currentX - startX),
            height: Math.abs(currentY - startY),
          });
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, resizing, isSelecting]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputField = event.target as HTMLInputElement;
      const command = inputField.value.trim();

      let response = "";
      switch (command.toLowerCase()) {
        case "help":
          response = "Available commands: help, about, clear";
          break;
        case "about":
          response = `
          Hello! I'm Mehdi Tohidi. Currently I'm living in Iran. I Can Code Everything!

          You can run the 'Mehdi Tohidi' App to know more about me.
        `;
          break;
        case "clear":
          setCommands([]);
          inputField.value = "";
          return;
        default:
          response = `'${command}' is not recognized as an internal or external command, operable program or batch file.`;
      }

      setCommands((prev) => [
        ...prev,
        `C:\\Users\\MehdiTohidi\\Desktop> ${command}`,
        response,
      ]);
      inputField.value = "";
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    console.log("Touch Move: ", e.touches[0].clientX, e.touches[0].clientY);
    if (dragging && draggingElementId) {
      const touch = e.touches[0];
      let newX = touch.clientX - offset.current.x;
      let newY = touch.clientY - offset.current.y;

      console.log("New X:", newX, "New Y:", newY);

      // Apply constraints
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + size.width > window.innerWidth)
        newX = window.innerWidth - size.width;
      if (newY + size.height > window.innerHeight)
        newY = window.innerHeight - size.height;

      console.log("Constrained X:", newX, "Constrained Y:", newY);

      // Update the position for the dragged element
      setPosition((prevPosition) => ({
        ...prevPosition,
        [draggingElementId]: { x: newX, y: newY },
      }));
    } else if (isSelecting && startSelectionCoords.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const touch = e.touches[0];
        const startX = startSelectionCoords.current.x;
        const startY = startSelectionCoords.current.y;
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;

        setSelection({
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
        });
      }
    }
  };

  const handleProgramClick = (programId: string) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    clickTimeout.current = window.setTimeout(() => {
      setSelectedWindow(programId);
    }, 200);
  };

  const handleProgramDoubleClick = (programId: string) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    setOpenWindows((prev) => (prev.includes(programId) ? prev : [...prev, programId]));
    setSelectedWindow(programId);
    // bring window to front if already open — map programId to windowId
    const windowIdMap: Record<string,string> = {
      documents:"windowExplorer", mediaPlayer:"windowMedia", browser:"windowBrowser", profile:"windowMehdi", commandPrompt:"windowCmd", notepad:"windowNote", properties:"windowProperties", game:"windowgame", calculator:"windowCalculator", paint:"windowPaint", minesweeper:"windowMinesweeper", tictactoe:"windowTicTacToe", gallery:"windowGallery", taskManager:"windowTaskManager", myComputer:"windowMyComputer", recycleBin:"windowRecycleBin", snake:"windowSnake", dialup:"windowDialup", vscode:"windowVSCode", gtaViceCity:"windowGTA"
    };
    const wid = windowIdMap[programId] || `window${programId.charAt(0).toUpperCase()+programId.slice(1)}`;
    bringToFront(wid);
    setMinimized((prev)=> ({...prev, [programId]: false}));
  };

  const closeWindow = (programId: string) => {
    setOpenWindows((prev) => prev.filter((win) => win !== programId));
    setMinimized((prev) => ({ ...prev, [programId]: false }));
    if (programId === "commandPrompt") {
      setCommands([]);
    }
  };

  const toggleMaximize = (id: string) => setMaximized((p) => ({ ...p, [id]: !p[id] }));
  const toggleMinimize = (id: string) => {
    setMinimized((p) => ({ ...p, [id]: !p[id] }));
    if (!minimized[id]) bringToFront(id);
  };
  const handleRun = (cmdStr: string) => {
    const c = cmdStr.toLowerCase().trim();
    if (c === "calc" || c === "calculator") handleProgramDoubleClick("calculator");
    else if (c === "mspaint" || c === "paint") handleProgramDoubleClick("paint");
    else if (c === "code" || c === "vscode" || c === "vs code") handleProgramDoubleClick("vscode");
    else if (c === "notepad") handleProgramDoubleClick("notepad");
    else if (c === "cmd" || c === "command") handleProgramDoubleClick("commandPrompt");
    else if (c === "winmine" || c === "minesweeper") handleProgramDoubleClick("minesweeper");
    else if (c === "tictactoe" || c === "tic") handleProgramDoubleClick("tictactoe");
    else if (c === "gallery" || c === "mspaint.gallery" || c === "images") handleProgramDoubleClick("gallery");
    else if (c === "taskmgr" || c === "task manager") handleProgramDoubleClick("taskManager");
    else if (c === "mycomputer" || c === "explorer") handleProgramDoubleClick("myComputer");
    else if (c === "recycle" || c === "bin") handleProgramDoubleClick("recycleBin");
    else if (c === "dialup" || c === "dialup") handleProgramDoubleClick("dialup");
    else if (c === "snake" || c === "nibbles") handleProgramDoubleClick("snake");
    else if (c === "gta" || c === "vice city" || c === "gtavc") handleProgramDoubleClick("gtaViceCity");
    else if (c.includes("browser") || c.startsWith("http")) handleProgramDoubleClick("browser");
    else handleProgramDoubleClick("commandPrompt");
  };

  const triggerGtaCrash = () => {
    if (isVirusDeleted()) return;
    const titles = ["gta-vc.exe - Application Error","Vice City - Fatal Exception","DirectX Error","gta-vc.exe","Unhandled Exception","System Error"];
    const messages = [
      "Exception at 0x004F12A0 in gta-vc.exe: The memory at 0x00000000 could not be read. Click OK to terminate.",
      "Failed to initialize Direct3D. Please reinstall DirectX 8.1 and restart Vice City.",
      "A fatal exception 0E has occurred at 0028:C0011E36. The current application will be terminated.",
      "gta-vc.exe has generated errors and will be closed by Windows. An error log is being created.",
      "The instruction at 0x77f4a1d0 referenced memory at 0x00000000. The memory could not be read.",
      "Your system is low on virtual memory. Vice City cannot allocate texture memory.",
    ];
    let count = 0;
    const spawnOne = () => {
      if (count >= 6) return;
      const baseX = Math.max(20, window.innerWidth / 2 - 170);
      const baseY = Math.max(20, window.innerHeight / 2 - 120);
      const err = {
        id: Date.now() + count + Math.floor(Math.random() * 10000),
        title: titles[count % titles.length],
        message: messages[count % messages.length],
        x: Math.min(window.innerWidth - 360, Math.max(10, baseX + (count % 3) * 32 + (Math.random() * 24 - 12))),
        y: Math.min(window.innerHeight - 220, Math.max(10, baseY + Math.floor(count / 3) * 38 + (Math.random() * 24 - 12))),
      };
      setStartupErrors((prev) => [...prev, err]);
      count += 1;
    };
    spawnOne();
    const iv = window.setInterval(() => {
      spawnOne();
      if (count >= 6) window.clearInterval(iv);
    }, 450);
  };

  const handleFileClick = (file: string) => {
    const m = musicRef.current;
    if (file == "Info.txt") {
      setisfromfile(true);
      setNoteText("welcome! make here your own windows!");
      handleProgramDoubleClick("notepad");
      setSelectedWindow("windowNote");
    } else if (file == "Shajaryan.mp3" && m) {
      handleProgramDoubleClick("mediaPlayer");
      currentMusic = 1;
      m.src = shajaryan;
      m.play();
      if (dancing && lights) {
        dancing.style.display = "none";
        lights.style.display = "none";
      }
    } else if (file == "Micheal Jackson.mp3" && m) {
      handleProgramDoubleClick("mediaPlayer");
      currentMusic = 0;
      m.src = jackson;
      m.play();
      if (dancing && lights) {
        dancing.style.display = "block";
        lights.style.display = "block";
      }
    }
  };

  const current_time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const current_date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const startSelection = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const isTouchEvent = e.type === "touchstart";
    const clientX = isTouchEvent
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;
    const clientY = isTouchEvent
      ? (e as React.TouchEvent).touches[0].clientY
      : (e as React.MouseEvent).clientY;

    // If it's a mouse event, check if it's a left click
    if (!isTouchEvent && (e as React.MouseEvent).button !== 0) {
      return; // Not a left click, so we ignore it
    }

    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      startSelectionCoords.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      setIsSelecting(true);
    }
  };

  const endSelection = () => {
    setIsSelecting(false);
    startSelectionCoords.current = null; // Clear the initial position
    setSelection({
      x: Math.min(0, 0),
      y: Math.min(0, 0),
      width: Math.abs(0),
      height: Math.abs(0),
    });
  };
  const shutdown = document.querySelector("#shut") as HTMLElement | null;
  if (shutdown) {
    shutdown.addEventListener("keydown", (event) => {
      shutdown.style.display = "none";
    });
  }

  return (
    <div className="app">
      <div id="shut" className="shutDown">
        Refresh to Power on again!
        <br />
        <button
          onClick={() => {
            window.location.reload();
          }}
          id="refreshPage"
        >
          Turn on
        </button>
      </div>
      <div className="imageShow">
        <img id="images" src={profileImg} />
      </div>

      {/* Browser */}

      <div
        id="windowBrowser"
        onClick={() => bringToFront("windowBrowser")}
        className="window"
        style={{
          display: openWindows.includes("browser") ? "flex" : "none",
          transform: `translate(${position["windowBrowser"]?.x}px, ${position["windowBrowser"]?.y}px)`,

          zIndex: zIndex["windowBrowser"],
        }}
      >
        <div
          className="title-bar"
          onMouseDown={(e) => handleMouseDown(e, "windowBrowser")}
          onTouchStart={(e) => handleTouchStart(e, "windowBrowser")}
        >
          <div className="title">Intenet Explorer</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("browser");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <Browser />
      </div>

      <div
        id="windowProperties"
        onClick={() => bringToFront("properties")}
        className="window"
        style={{
          display: openWindows.includes("properties") ? "flex" : "none",
          transform: `translate(${position["windowProperties"]?.x}px, ${position["windowProperties"]?.y}px)`,
          zIndex: zIndex["windowProperties"],
        }}
      >
        <div
          className="title-bar"
          onMouseDown={(e) => handleMouseDown(e, "windowProperties")}
          onTouchStart={(e) => handleTouchStart(e, "windowProperties")}
        >
          <div className="title">Properties</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("properties");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        {WindowsXPDisplayProperties()}
      </div>

      {/* Command Prompt Window */}
      <div
        id="windowCmd"
        onClick={() => bringToFront("windowCmd")}
        className="window"
        style={{
          display: openWindows.includes("commandPrompt") ? "flex" : "none",
          transform: `translate(${position["windowCmd"]?.x}px, ${position["windowCmd"]?.y}px)`,

          zIndex: zIndex["windowCmd"],
        }}
      >
        <div
          className="title-bar"
          onMouseDown={(e) => handleMouseDown(e, "windowCmd")}
          onTouchStart={(e) => handleTouchStart(e, "windowCmd")}
        >
          <div className="title">Command Prompt</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("commandPrompt");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <div className="terminal">
          <div id="output">
            <div>Microsoft Windows [Version 10.0.22621.3958]</div>
            <div>(c) Microsoft Corporation. All rights reserved.</div>
            <br />
            <div style={{ fontSize: 12 }}>
              Available commands: help, about, clear
            </div>
            <br />
            {commands.map((cmd, index) => (
              <div key={index}>{cmd}</div>
            ))}
            <div className="input-line">
              <span className="prompt">C:\Users\MehdiTohidi\Desktop{">"}</span>
              <input type="text" autoFocus onKeyDown={handleKeyDown} />
            </div>
          </div>
        </div>
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={(e) => handleTouchStart(e, "windowCmd")}
        ></div>
      </div>

      {/* Mehdi Tohidi */}
      <div
        id="windowMehdi"
        className="window"
        onClick={() => bringToFront("windowMehdi")}
        style={{
          display: openWindows.includes("profile") ? "flex" : "none",
          transform: `translate(${position["windowMehdi"]?.x}px, ${position["windowMehdi"]?.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: zIndex["windowMehdi"],
        }}
      >
        <div
          className="title-bar"
          style={{ backgroundColor: "darkPurple" }}
          onMouseDown={(e) => handleMouseDown(e, "windowMehdi")}
          onTouchStart={(e) => handleTouchStart(e, "windowMehdi")}
        >
          <div className="title">Mehdi Tohidi | About Me!</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("profile");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <div className="aboutMe">
          <p id="aboutText">
            I'm Mehdi Tohidi! Currently I'm living in Iran. My Skills:
            <ul id="skills">
              <li>Web Developer.</li>
              <li>Mobile App Developer.</li>
              <li>Telegram Mini App Developer.</li>
              <li>Telegram Bot Developer.</li>
            </ul>
            I love teamworks. I can speak in:
            <ul id="skills">
              <li>English</li>
              <li>Persian</li>
              <li>Kurdish</li>
              <li>Turkish: Azari</li>
            </ul>
            <br />
           
          </p>
        </div>
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={(e) => handleTouchStart(e, "windowMehdi")}
        ></div>
      </div>

      {/* Resume Sticky Notes — hidden by default, shown when Mehdi Tohidi app is open */}
      {openWindows.includes("profile") && (
        <div className="sticky-notes">
          <Resume />
        </div>
      )}

      {/* game  */}

      <div
        id="windowgame"
        className="window"
        onClick={() => bringToFront("windowgame")}
        style={{
          display: openWindows.includes("game") ? "flex" : "none",
          transform: `translate(${position["windowgame"]?.x}px, ${position["windowgame"]?.y}px)`,
          zIndex: zIndex["windowgame"],
        }}
      >
        <div
          className="title-bar"
          style={{ backgroundColor: "darkPurple" }}
          onMouseDown={(e) => handleMouseDown(e, "windowgame")}
          onTouchStart={(e) => handleTouchStart(e, "windowgame")}
        >
          <div className="title">Play T-Rex | MehdiTohidi.com</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("game");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <iframe id="game" src="https://dancemonkey.fun/trex"></iframe>
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={(e) => handleTouchStart(e, "windowMehdi")}
        ></div>
      </div>

      {/* Note Pad */}

      <div
        id="windowNote"
        className="window"
        onClick={() => bringToFront("windowNote")}
        style={{
          display: openWindows.includes("notepad") ? "flex" : "none",
          transform: `translate(${position["windowNote"]?.x}px, ${position["windowNote"]?.y}px)`,
          zIndex: zIndex["windowNote"] || 2,
        }}
      >
        <div
          className="title-bar"
          style={{ backgroundColor: "darkPurple" }}
          onMouseDown={(e) => handleMouseDown(e, "windowNote")}
          onTouchStart={(e) => handleTouchStart(e, "windowNote")}
        >
          <div className="title">Notepad 1.28</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("notepad");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <Notepad />
      </div>

      {/* Media Player */}
      <div
        id="windowMedia"
        className="window"
        style={{
          display: openWindows.includes("mediaPlayer") ? "flex" : "none",
          transform: `translate(${position["windowMedia"]?.x}px, ${position["windowMedia"]?.y}px)`,
          width: "300px",
          zIndex: zIndex["windowMedia"],
        }}
      >
        <div
          className="title-bar"
          style={{
            backgroundColor: "darkPurple",
          }}
          onMouseDown={(e) => {
            handleMouseDown(e, "windowMedia");
          }}
          onTouchStart={(e) => handleTouchStart(e, "windowMedia")}
        >
          <div className="title" id="mediaPlayer">
            Media Player
          </div>
          <button
            className="close"
            onClick={() => {
              const m = musicRef.current;
              if (m && lights && dancing) {
                dancing.style.display = "none";
                m.pause();
                m.currentTime = 0;
                lights.style.display = "none";
              }
              closeWindow("mediaPlayer");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <div id="mediaAll">
          <div className="screen">
            <div className="screen-content"></div>
          </div>
          <div className="controls-bar">
            <audio ref={musicRef} id="music" src={jackson}></audio>

            <button
              id="control-button"
              className="control-button play"
              onClick={() => {
                musicRef.current?.play();
              }}
            >
              ▶
            </button>

            <button
              id="control-button"
              className="control-button pause"
              onClick={() => {
                musicRef.current?.pause();
                  const lights = document.querySelector(
                    ".party-lights"
                  ) as HTMLElement | null;
                  const dancing = document.querySelector(
                    ".dancing"
                  ) as HTMLElement | null;
                  if (dancing && lights) {
                    dancing.style.display = "none";
                    lights.style.display = "none";
                  }
              }}
            >
              ||
            </button>
            <button
              id="control-button"
              className="control-button stop"
              onClick={() => {
                const m = musicRef.current;
                if (m) {
                  m.pause();
                  m.currentTime = 0;
                  const lights = document.querySelector(
                    ".party-lights"
                  ) as HTMLElement | null;
                  const dancing = document.querySelector(
                    ".dancing"
                  ) as HTMLElement | null;
                  if (dancing && lights) {
                    dancing.style.display = "none";
                    lights.style.display = "none";
                  }
                }
              }}
            >
              ■
            </button>
          </div>

          <div className="status-bar">
            <div className="status-text">
              {Math.floor(musicTime / 60) < 10
                ? "0" + Math.floor(musicTime / 60)
                : Math.floor(musicTime / 60)}
              :{musicTime % 60 < 10 ? "0" + (musicTime % 60) : musicTime % 60}/
              {musicRef.current ? formatDuration(musicRef.current.duration || 0) : "00:00"}
            </div>
            <div className="progress-bar">
              <div ref={progressRef} className="progress-level" style={{ width: "0%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Apps: Calculator & Paint using XP Window chrome */}
      {!minimized["calculator"] && (
        <Window
          id="windowCalculator"
          title="Calculator"
          icon={calculator}
          onClose={() => closeWindow("calculator")}
          onMinimize={() => toggleMinimize("calculator")}
          onMaximize={() => toggleMaximize("windowCalculator")}
          isMaximized={!!maximized["windowCalculator"]}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onFocus={() => bringToFront("windowCalculator")}
          style={{
            display: openWindows.includes("calculator") ? "flex" : "none",
            transform: maximized["windowCalculator"] ? "none" : `translate(${position["windowCalculator"]?.x}px, ${position["windowCalculator"]?.y}px)`,
            zIndex: zIndex["windowCalculator"],
            width: maximized["windowCalculator"] ? undefined : "260px",
            height: maximized["windowCalculator"] ? undefined : "320px",
          } as React.CSSProperties}
        >
          <Calculator />
        </Window>
      )}

      {!minimized["paint"] && (
        <Window
          id="windowPaint"
          title="Paint"
          icon={paint}
          onClose={() => closeWindow("paint")}
          onMinimize={() => toggleMinimize("paint")}
          onMaximize={() => toggleMaximize("windowPaint")}
          isMaximized={!!maximized["windowPaint"]}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onFocus={() => bringToFront("windowPaint")}
          style={{
            display: openWindows.includes("paint") ? "flex" : "none",
            transform: maximized["windowPaint"] ? "none" : `translate(${position["windowPaint"]?.x}px, ${position["windowPaint"]?.y}px)`,
            zIndex: zIndex["windowPaint"],
            width: maximized["windowPaint"] ? undefined : "640px",
            height: maximized["windowPaint"] ? undefined : "460px",
          } as React.CSSProperties}
        >
          <Paint />
        </Window>
      )}

      {!minimized["minesweeper"] && (
        <Window id="windowMinesweeper" title="Minesweeper" icon={minesweeper} onClose={() => closeWindow("minesweeper")} onMinimize={() => toggleMinimize("minesweeper")} onMaximize={() => toggleMaximize("windowMinesweeper")} isMaximized={!!maximized["windowMinesweeper"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowMinesweeper")} style={{ display: openWindows.includes("minesweeper") ? "flex" : "none", transform: maximized["windowMinesweeper"] ? "none" : `translate(${position["windowMinesweeper"]?.x}px, ${position["windowMinesweeper"]?.y}px)`, zIndex: zIndex["windowMinesweeper"], width: maximized["windowMinesweeper"] ? undefined : "300px", height: maximized["windowMinesweeper"] ? undefined : "360px" } as React.CSSProperties}>
          <Minesweeper />
        </Window>
      )}
      {!minimized["tictactoe"] && (
        <Window id="windowTicTacToe" title="Tic-Tac-Toe" icon={tictactoe} onClose={() => closeWindow("tictactoe")} onMinimize={() => toggleMinimize("tictactoe")} onMaximize={() => toggleMaximize("windowTicTacToe")} isMaximized={!!maximized["windowTicTacToe"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowTicTacToe")} style={{ display: openWindows.includes("tictactoe") ? "flex" : "none", transform: maximized["windowTicTacToe"] ? "none" : `translate(${position["windowTicTacToe"]?.x}px, ${position["windowTicTacToe"]?.y}px)`, zIndex: zIndex["windowTicTacToe"], width: "260px", height: "320px" } as React.CSSProperties}>
          <TicTacToe />
        </Window>
      )}
      {!minimized["gallery"] && (
        <Window id="windowGallery" title="Windows Picture Viewer" icon={galleryIcon} onClose={() => closeWindow("gallery")} onMinimize={() => toggleMinimize("gallery")} onMaximize={() => toggleMaximize("windowGallery")} isMaximized={!!maximized["windowGallery"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowGallery")} style={{ display: openWindows.includes("gallery") ? "flex" : "none", transform: maximized["windowGallery"] ? "none" : `translate(${position["windowGallery"]?.x}px, ${position["windowGallery"]?.y}px)`, zIndex: zIndex["windowGallery"], width: maximized["windowGallery"] ? undefined : "620px", height: maximized["windowGallery"] ? undefined : "420px" } as React.CSSProperties}>
          <GalleryViewer />
        </Window>
      )}
      {!minimized["taskManager"] && (
        <Window id="windowTaskManager" title="Windows Task Manager" icon={taskmanager} onClose={() => closeWindow("taskManager")} onMinimize={() => toggleMinimize("taskManager")} onMaximize={() => toggleMaximize("windowTaskManager")} isMaximized={!!maximized["windowTaskManager"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowTaskManager")} style={{ display: openWindows.includes("taskManager") ? "flex" : "none", transform: maximized["windowTaskManager"] ? "none" : `translate(${position["windowTaskManager"]?.x}px, ${position["windowTaskManager"]?.y}px)`, zIndex: zIndex["windowTaskManager"], width: "420px", height: "340px" } as React.CSSProperties}>
          <TaskManager openWindows={openWindows} />
        </Window>
      )}
      {!minimized["myComputer"] && (
        <Window id="windowMyComputer" title="My Computer" icon={computer} onClose={() => closeWindow("myComputer")} onMinimize={() => toggleMinimize("myComputer")} onMaximize={() => toggleMaximize("windowMyComputer")} isMaximized={!!maximized["windowMyComputer"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowMyComputer")} style={{ display: openWindows.includes("myComputer") ? "flex" : "none", transform: maximized["windowMyComputer"] ? "none" : `translate(${position["windowMyComputer"]?.x}px, ${position["windowMyComputer"]?.y}px)`, zIndex: zIndex["windowMyComputer"], width: "480px", height: "300px" } as React.CSSProperties}>
          <MyComputer />
        </Window>
      )}
      {!minimized["recycleBin"] && (
        <Window id="windowRecycleBin" title="Recycle Bin" icon={trashbin} onClose={() => closeWindow("recycleBin")} onMinimize={() => toggleMinimize("recycleBin")} onMaximize={() => toggleMaximize("windowRecycleBin")} isMaximized={!!maximized["windowRecycleBin"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowRecycleBin")} style={{ display: openWindows.includes("recycleBin") ? "flex" : "none", transform: maximized["windowRecycleBin"] ? "none" : `translate(${position["windowRecycleBin"]?.x}px, ${position["windowRecycleBin"]?.y}px)`, zIndex: zIndex["windowRecycleBin"], width: "380px", height: "300px" } as React.CSSProperties}>
          <RecycleBin items={deletedItems} onRestore={(id)=>{ const it=deletedItems.find(d=>d.id===id); if(it){ if(BUILT_IN_IDS.includes(it.id)){ setHiddenIcons(prev=>{ const n=new Set(prev); n.delete(it.id); return n; }); } else { const isVirus = it.id===VIRUS_ID; const icon = isVirus ? virusIcon : it.name.includes(".txt")? textIcon : myDocuments; setDesktopItems(prev=>[...prev,{id:it.id,name:it.name,icon,kind: isVirus ? "text" as const : it.name.endsWith(".txt")?"text":"folder", x: 160+Math.random()*120, y: 160+Math.random()*120 }]); if(isVirus){ try{ localStorage.removeItem(VIRUS_FLAG); }catch{} } } setDeletedItems(prev=>prev.filter(d=>d.id!==id)); } }} onEmpty={()=>{ const hadVirus = deletedItems.some(d=>d.id===VIRUS_ID); setDeletedItems([]); if(hadVirus){ try{ localStorage.setItem(VIRUS_FLAG, "true"); }catch{} } }} />
        </Window>
      )}
      {!minimized["snake"] && (
        <Window id="windowSnake" title="Snake - Nibbles" icon={snake} onClose={() => closeWindow("snake")} onMinimize={() => toggleMinimize("snake")} onMaximize={() => toggleMaximize("windowSnake")} isMaximized={!!maximized["windowSnake"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowSnake")} style={{ display: openWindows.includes("snake") ? "flex" : "none", transform: maximized["windowSnake"] ? "none" : `translate(${position["windowSnake"]?.x}px, ${position["windowSnake"]?.y}px)`, zIndex: zIndex["windowSnake"], width: "300px", height: "380px" } as React.CSSProperties}>
          <Snake />
        </Window>
      )}
      {!minimized["dialup"] && (
        <Window id="windowDialup" title="Connect to DCANet" icon={dialup} onClose={() => closeWindow("dialup")} onMinimize={() => toggleMinimize("dialup")} onMaximize={() => {}} isMaximized={false} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowDialup")} style={{ display: openWindows.includes("dialup") ? "flex" : "none", transform: `translate(${position["windowDialup"]?.x}px, ${position["windowDialup"]?.y}px)`, zIndex: zIndex["windowDialup"], width: "360px", height: "auto", overflow: "hidden" } as React.CSSProperties}>
          <Dialup />
        </Window>
      )}
      {!minimized["vscode"] && (
        <Window id="windowVSCode" title="Visual Studio Code - my-project" icon={vscodeIcon} onClose={() => closeWindow("vscode")} onMinimize={() => toggleMinimize("vscode")} onMaximize={() => toggleMaximize("windowVSCode")} isMaximized={!!maximized["windowVSCode"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowVSCode")} style={{ display: openWindows.includes("vscode") ? "flex" : "none", transform: maximized["windowVSCode"] ? "none" : `translate(${position["windowVSCode"]?.x}px, ${position["windowVSCode"]?.y}px)`, zIndex: zIndex["windowVSCode"], width: maximized["windowVSCode"] ? undefined : "860px", height: maximized["windowVSCode"] ? undefined : "520px" } as React.CSSProperties}>
          <VSCode />
        </Window>
      )}
      {!minimized["gtaViceCity"] && (
        <Window id="windowGTA" title="Grand Theft Auto: Vice City" icon={game} onClose={() => closeWindow("gtaViceCity")} onMinimize={() => toggleMinimize("gtaViceCity")} onMaximize={() => toggleMaximize("windowGTA")} isMaximized={!!maximized["windowGTA"]} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onFocus={() => bringToFront("windowGTA")} style={{ display: openWindows.includes("gtaViceCity") ? "flex" : "none", transform: maximized["windowGTA"] ? "none" : `translate(${position["windowGTA"]?.x}px, ${position["windowGTA"]?.y}px)`, zIndex: zIndex["windowGTA"], width: maximized["windowGTA"] ? undefined : "640px", height: maximized["windowGTA"] ? undefined : "460px" } as React.CSSProperties}>
          <GtaViceCity onCrash={triggerGtaCrash} onClose={() => closeWindow("gtaViceCity")} onFullscreen={() => setMaximized((p) => (p["windowGTA"] ? p : { ...p, windowGTA: true }))} />
        </Window>
      )}

      {/* Dancing */}

      <div
        className="dancing"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <img id="dancing" src={dance} />
      </div>

      {/* Taskbar */}
      <div className="taskbar" onContextMenu={(e) => e.preventDefault()}>
        <div className="taskbar-start">
          <div className="start-menu-button">
            <img
              id="startIcon"
              src={startIcon}
              alt="Start Menu"
              onClick={() => {
                // handle start menu click
                const startMenu = document.querySelector(
                  ".start-menu"
                ) as HTMLElement | null;

                if (startMenu && !startMenuOpened) {
                  startMenu.style.display = "flex";
                  setStartMenuOpened(true);
                } else if (startMenu && startMenuOpened) {
                  startMenu.style.display = "none";
                  setStartMenuOpened(false);
                }
              }}
            />
          </div>
        </div>
        <div className="taskbar-end">
          <div className="volume-control" title="Volume">
            <span style={{ fontSize: 12 }}>🔊</span>
            <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: 60 }} />
          </div>
          <div className="taskbar-clock" onClick={() => setShowCalendar(!showCalendar)} style={{ cursor: "pointer" }} title={current_date}>
            <div>{current_time}</div>
            <div style={{ fontSize: 10, opacity: 0.9 }}>{now.toLocaleDateString()}</div>
          </div>
          {showCalendar && (
            <div className="calendar-popup">
              <div className="cal-header">{now.toLocaleDateString([], { month: "long", year: "numeric" })}</div>
              <div className="cal-grid">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="cal-dow">{d}</div>)}
                {Array.from({ length: new Date(now.getFullYear(), now.getMonth(), 1).getDay() }).map((_, i) => <div key={"e"+i} />)}
                {Array.from({ length: new Date(now.getFullYear(), now.getMonth()+1, 0).getDate() }).map((_, i) => {
                  const day = i+1;
                  const isToday = day === now.getDate();
                  return <div key={day} className={`cal-day ${isToday?'today':''}`}>{day}</div>;
                })}
              </div>
              <button className="xp-btn" style={{ marginTop: 6, width: "100%" }} onClick={() => setShowCalendar(false)}>Close</button>
            </div>
          )}
        </div>
        <div className="taskbar-open-windows">
          {openWindows.includes("mediaPlayer") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={mediaPlayer}
                alt="Media Player"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("mediaPlayer")}
              />
              <p id="taskbarText">Media Player</p>
            </div>
          )}

          {openWindows.includes("game") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={taskmanager}
                alt="Media Player"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("game")}
              />
              <p id="taskbarText">Play T-Rex</p>
            </div>
          )}

          {openWindows.includes("notepad") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={notepadImg}
                alt="Notepad"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("notepad")}
              />
              <p id="taskbarText">Notepad</p>
            </div>
          )}

          {openWindows.includes("browser") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={chrome}
                alt="Recycle Bin"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("browser")}
              />
              <p id="taskbarText">Internet Browser</p>
            </div>
          )}
          {openWindows.includes("profile") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={profileImg}
                alt="Profile"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("profile")}
              />
              <p id="taskbarText">Mehdi Tohidi</p>
            </div>
          )}
          {openWindows.includes("commandPrompt") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={cmd}
                alt="Command Prompt"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("commandPrompt")}
              />
              <p id="taskbarText">Command Prompt</p>
            </div>
          )}
          {openWindows.includes("calculator") && (
            <div className="taskbar-item" onClick={() => minimized["calculator"] ? toggleMinimize("calculator") : bringToFront("windowCalculator")}>
              <img id="taskImage" src={calculator} alt="Calculator" className="taskbar-icon" />
              <p id="taskbarText">Calculator</p>
            </div>
          )}
          {openWindows.includes("paint") && (
            <div className="taskbar-item" onClick={() => minimized["paint"] ? toggleMinimize("paint") : bringToFront("windowPaint")}>
              <img id="taskImage" src={paint} alt="Paint" className="taskbar-icon" />
              <p id="taskbarText">Paint</p>
            </div>
          )}
          {openWindows.includes("minesweeper") && (
            <div className="taskbar-item" onClick={() => minimized["minesweeper"] ? toggleMinimize("minesweeper") : bringToFront("windowMinesweeper")}>
              <img id="taskImage" src={minesweeper} alt="Minesweeper" className="taskbar-icon" />
              <p id="taskbarText">Minesweeper</p>
            </div>
          )}
          {openWindows.includes("tictactoe") && (
            <div className="taskbar-item" onClick={() => minimized["tictactoe"] ? toggleMinimize("tictactoe") : bringToFront("windowTicTacToe")}>
              <img id="taskImage" src={tictactoe} alt="TicTacToe" className="taskbar-icon" />
              <p id="taskbarText">Tic-Tac-Toe</p>
            </div>
          )}
          {openWindows.includes("gallery") && (
            <div className="taskbar-item" onClick={() => minimized["gallery"] ? toggleMinimize("gallery") : bringToFront("windowGallery")}>
              <img id="taskImage" src={galleryIcon} alt="Gallery" className="taskbar-icon" />
              <p id="taskbarText">Pictures</p>
            </div>
          )}
          {openWindows.includes("taskManager") && (
            <div className="taskbar-item" onClick={() => minimized["taskManager"] ? toggleMinimize("taskManager") : bringToFront("windowTaskManager")}>
              <img id="taskImage" src={computer} alt="TaskManager" className="taskbar-icon" />
              <p id="taskbarText">Task Manager</p>
            </div>
          )}
          {openWindows.includes("myComputer") && (
            <div className="taskbar-item" onClick={() => minimized["myComputer"] ? toggleMinimize("myComputer") : bringToFront("windowMyComputer")}>
              <img id="taskImage" src={computer} alt="MyComputer" className="taskbar-icon" />
              <p id="taskbarText">My Computer</p>
            </div>
          )}
          {openWindows.includes("recycleBin") && (
            <div className="taskbar-item" onClick={() => minimized["recycleBin"] ? toggleMinimize("recycleBin") : bringToFront("windowRecycleBin")}>
              <img id="taskImage" src={trashbin} alt="RecycleBin" className="taskbar-icon" />
              <p id="taskbarText">Recycle Bin</p>
            </div>
          )}
          {openWindows.includes("snake") && (
            <div className="taskbar-item" onClick={() => minimized["snake"] ? toggleMinimize("snake") : bringToFront("windowSnake")}>
              <img id="taskImage" src={snake} alt="Snake" className="taskbar-icon" />
              <p id="taskbarText">Snake</p>
            </div>
          )}
          {openWindows.includes("dialup") && (
            <div className="taskbar-item" onClick={() => minimized["dialup"] ? toggleMinimize("dialup") : bringToFront("windowDialup")}>
              <img id="taskImage" src={dialup} alt="Dialup" className="taskbar-icon" />
              <p id="taskbarText">Dial Up</p>
            </div>
          )}
          {openWindows.includes("vscode") && (
            <div className="taskbar-item" onClick={() => minimized["vscode"] ? toggleMinimize("vscode") : bringToFront("windowVSCode")}>
              <img id="taskImage" src={vscodeIcon} alt="VS Code" className="taskbar-icon" />
              <p id="taskbarText">VS Code</p>
            </div>
          )}
          {openWindows.includes("gtaViceCity") && (
            <div className="taskbar-item" onClick={() => minimized["gtaViceCity"] ? toggleMinimize("gtaViceCity") : bringToFront("windowGTA")}>
              <img id="taskImage" src={gtaViceCity} alt="Vice City" className="taskbar-icon" />
              <p id="taskbarText">Vice City</p>
            </div>
          )}
          {openWindows.includes("properties") && (
            <div className="taskbar-item">
              <img id="taskImage" src={controlPanel} alt="Properties" className="taskbar-icon" />
              <p id="taskbarText">Properties</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Icons — now fully draggable + custom New Folder/Text */}
      <div className="icons">
        {[
          { id: "myComputer", label: "My Computer", icon: computer, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("myComputer") },
          { id: "recycleBin", label: "Recycle Bin", icon: trashbin, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("recycleBin") },
          { id: "mediaPlayer", label: "Media Player", icon: mediaMenu, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("mediaPlayer") },
          { id: "browser", label: "Internet Browser", icon: chrome, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("browser") },
          { id: "profile", label: "Mehdi Tohidi", icon: profileImg, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("profile"), extra: { borderRadius: 5 } },
          { id: "commandPrompt", label: "Command Prompt", icon: cmd, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("commandPrompt") },
          { id: "notepad", label: "Notepad", icon: notepadImg, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("notepad") },
          { id: "game", label: "T-Rex Game", icon: game, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("game") },
          { id: "minesweeper", label: "Minesweeper", icon: minesweeper, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("minesweeper") },
          { id: "tictactoe", label: "Tic-Tac-Toe", icon: tictactoe, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("tictactoe") },
          { id: "snake", label: "Snake", icon: snake, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("snake") },
          { id: "gallery", label: "Pictures", icon: galleryIcon, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("gallery") },
          { id: "shajaryan", label: "Shajaryan.mp3", icon: fileIcon, w: 45, h: 45, onDbl: () => { const m = musicRef.current; if (m) { if (lights && dancing) { lights.style.display="none"; dancing.style.display="none"; } m.src=shajaryan; m.play(); currentMusic=1; handleProgramDoubleClick("mediaPlayer"); } } },
          { id: "jackson", label: "Micheal Jackson.mp3", icon: fileIcon, w: 45, h: 45, onDbl: () => { const m=musicRef.current; if(m){ if(lights&&dancing){lights.style.display="block"; dancing.style.display="block";} m.src=jackson; m.play(); currentMusic=0; handleProgramDoubleClick("mediaPlayer"); } } },
          { id: "calculator", label: "Calculator", icon: calculator, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("calculator") },
          { id: "paint", label: "Paint", icon: paint, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("paint") },
          { id: "taskManager", label: "Task Manager", icon: taskmanager, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("taskManager") },
          { id: "dialup", label: "Dial Up", icon: dialup, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("dialup") },
          { id: "vscode", label: "VS Code", icon: vscodeIcon, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("vscode") },
          { id: "gtaViceCity", label: "Grand Theft Auto Vice City", icon: gtaViceCity, w: 45, h: 45, onDbl: () => handleProgramDoubleClick("gtaViceCity") },
          { id: "run", label: "Run", icon: runApp, w: 45, h: 45, onDbl: () => setShowRun(true) },
        ].filter((it) => !hiddenIcons.has(it.id)).map((it) => {
          const pos = iconPositions[it.id];
          const isTrash = it.id === "recycleBin";
          return (
            <div
              key={it.id}
              data-icon-id={it.id}
              className={`program ${selectedWindow === it.id ? "selected" : ""} ${draggingIcon === it.id ? "dragging" : ""} ${isTrash ? "trash-target" : ""}`}
              onClick={() => handleProgramClick(it.id)}
              onDoubleClick={it.onDbl}
              onMouseDown={(e) => handleIconMouseDown(e, it.id)}
              onTouchStart={(e) => handleIconTouchStart(e, it.id)}
              onContextMenu={(e) => handleIconContextMenu(e, it.id)}
              style={pos ? { transform: `translate(${pos.x}px, ${pos.y}px)`, zIndex: draggingIcon===it.id? 9999: undefined, transition: draggingIcon===it.id? "none": "transform 0.12s" } as React.CSSProperties : undefined}
            >
              <img id="iconImage" src={it.icon} alt="" style={{ width: it.w, height: it.h, marginBottom: 20, justifySelf: "center", ...(it.extra||{}) }} />
              <p id="programName">{it.label}</p>
            </div>
          );
        })}
        {/* Custom created folders / text files */}
        {desktopItems.map((item) => (
          <div
            key={item.id}
            data-icon-id={item.id}
            className={`program ${selectedWindow === item.id ? "selected" : ""} ${draggingIcon === item.id ? "dragging" : ""}`}
            onClick={() => handleProgramClick(item.id)}
            onDoubleClick={() => {
              if (item.id === VIRUS_ID) {
                setNoteText(`[${item.name}]\n\n⚠️ VIRUS DETECTED!\nThis file is spawning XP errors on startup and in GTA Vice City.\n\n→ Right-click → Delete, then empty Recycle Bin to stop the errors forever.\n→ Or restore from Recycle Bin to bring them back.`);
                handleProgramDoubleClick("notepad");
                return;
              }
              if (item.kind === "folder") handleProgramDoubleClick("documents");
              else { setNoteText(`[${item.name}]\n\nThis text document was created from Desktop → New → Text Document.`); handleProgramDoubleClick("notepad"); }
            }}
            onMouseDown={(e) => {
              // custom items have absolute pos stored in item.x/y, use separate drag offset
              handleProgramClick(item.id);
              iconDragOffset.current = { x: e.clientX - item.x, y: e.clientY - item.y };
              setDraggingIcon(item.id);
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              handleProgramClick(item.id);
              iconDragOffset.current = { x: t.clientX - item.x, y: t.clientY - item.y };
              setDraggingIcon(item.id);
            }}
            onContextMenu={(e) => handleIconContextMenu(e, item.id)}
            style={{ position: "absolute", left: item.x, top: item.y } as React.CSSProperties}
          >
            <img id="iconImage" src={item.icon} alt="" style={{ width: 45, justifySelf: "center", paddingBottom: 18 }} />
            <p id="programName" style={{ maxWidth: 74, wordBreak: "break-word", textAlign: "center" }}>{item.name}</p>
          </div>
        ))}
      </div>

      
      

      {/* Start Menu */}

      <div className="start-menu">
        <div className="start-menu-header">
          <img
            src={profileImg}
            alt="User"
            className="user-image"
            onClick={() => {
              const image = document.querySelector(
                ".imageShow"
              ) as HTMLElement | null;
              if (image) {
                image.style.display = "flex";
              }
            }}
          />
          <p className="username">Mehdi Tohidi</p>
        </div>
        <div className="start-menu-content">
          <div className="menu-column menu-column-left">
            <ul>
              <li onClick={() => handleProgramDoubleClick("browser")} className="xp-pinned">
                <img id="menuIcons" src={chrome} alt="" /> <span><b>Internet</b><br/><span style={{fontSize:10,color:"#666"}}>Internet Browser</span></span>
              </li>
              <li onClick={() => handleProgramDoubleClick("profile")} className="xp-pinned">
                <img id="menuIcons" src={email} alt="" style={{borderRadius:2}} /> <span><b>E-mail</b><br/><span style={{fontSize:10,color:"#666"}}>Mehdi Tohidi</span></span>
              </li>

              <li className="has-submenu all-programs-item">
                <img id="menuIcons" src={myDocuments} alt="" style={{width:20,height:20}} /> <b>All Programs</b> <span className="xp-arrow">▶</span>
                <ul className="xp-submenu all-programs-menu">
                  {/* Accessories */}
                  <li className="has-submenu">
                    <span className="xp-icon"><img src={myDocuments} alt="" style={{width:16,height:16}}/></span> Accessories <span className="xp-arrow">▶</span>
                    <ul className="xp-submenu">
                      <li className="has-submenu">
                        <span className="xp-icon">♿</span> Accessibility <span className="xp-arrow">▶</span>
                        <ul className="xp-submenu">
                          <li className="xp-menu-item disabled"><span className="xp-icon">🔍</span>Magnifier</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🔊</span>Narrator</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">⌨</span>On-Screen Keyboard</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">⚙</span>Utility Manager</li>
                        </ul>
                      </li>
                      <li className="has-submenu">
                        <span className="xp-icon">☎</span> Communications <span className="xp-arrow">▶</span>
                        <ul className="xp-submenu">
                          <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("dialup")}><span className="xp-icon"><img src={dialup} alt="" style={{width:16,height:16}}/></span>Dial Up Networking</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🌐</span>Network Connections</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">💻</span>Remote Desktop Connection</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">📡</span>HyperTerminal</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🧙</span>Network Setup Wizard</li>
                        </ul>
                      </li>
                      <li className="has-submenu">
                        <span className="xp-icon">🎵</span> Entertainment <span className="xp-arrow">▶</span>
                        <ul className="xp-submenu">
                          <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("mediaPlayer")}><span className="xp-icon"><img src={mediaMenu} alt="" style={{width:16,height:16}}/></span>Windows Media Player</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🔊</span>Volume Control</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🎙</span>Sound Recorder</li>
                        </ul>
                      </li>
                      <li className="has-submenu">
                        <span className="xp-icon">🛠</span> System Tools <span className="xp-arrow">▶</span>
                        <ul className="xp-submenu">
                          <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("taskManager")}><span className="xp-icon"><img src={taskmanager} alt="" style={{width:16,height:16}}/></span>Task Manager</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🧹</span>Disk Cleanup</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🧩</span>Disk Defragmenter</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">ℹ</span>System Information</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">🗺</span>Character Map</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">💾</span>Backup</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">📅</span>Scheduled Tasks</li>
                          <li className="xp-menu-item disabled"><span className="xp-icon">♻</span>System Restore</li>
                        </ul>
                      </li>
                      <li className="xp-separator"></li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("calculator")}><span className="xp-icon"><img src={calculator} alt="" style={{width:16,height:16}}/></span>Calculator</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("vscode")}><span className="xp-icon"><img src={vscodeIcon} alt="" style={{width:16,height:16}}/></span>Visual Studio Code</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("commandPrompt")}><span className="xp-icon"><img src={cmd} alt="" style={{width:16,height:16}}/></span>Command Prompt</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("notepad")}><span className="xp-icon"><img src={notepadImg} alt="" style={{width:16,height:16}}/></span>Notepad</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("paint")}><span className="xp-icon"><img src={paint} alt="" style={{width:16,height:16}}/></span>Paint</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("documents")}><span className="xp-icon"><img src={myDocuments} alt="" style={{width:16,height:16}}/></span>Windows Explorer</li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">📖</span>Address Book</li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">🔄</span>Synchronize</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("profile")}><span className="xp-icon"><img src={profileImg} alt="" style={{width:16,height:16,borderRadius:2}}/></span>Tour Windows XP</li>
                    </ul>
                  </li>
                  {/* Games */}
                  <li className="has-submenu">
                    <span className="xp-icon"><img src={game} alt="" style={{width:16,height:16}}/></span> Games <span className="xp-arrow">▶</span>
                    <ul className="xp-submenu">
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("gtaViceCity")}><span className="xp-icon"><img src={gtaViceCity} alt="" style={{width:16,height:16}}/></span>Grand Theft Auto: Vice City</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("minesweeper")}><span className="xp-icon"><img src={minesweeper} alt="" style={{width:16,height:16}}/></span>Minesweeper</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("snake")}><span className="xp-icon"><img src={snake} alt="" style={{width:16,height:16}}/></span>Snake</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("tictactoe")}><span className="xp-icon"><img src={tictactoe} alt="" style={{width:16,height:16}}/></span>Tic-Tac-Toe</li>
                      <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("game")}><span className="xp-icon"><img src={game} alt="" style={{width:16,height:16}}/></span>Play T-Rex</li>
                      <li className="xp-separator"></li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">♠</span>Solitaire</li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">♥</span>Hearts</li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">♦</span>FreeCell</li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">♣</span>Pinball</li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">🕷</span>Spider Solitaire</li>
                      <li className="xp-menu-item disabled"><span className="xp-icon">♟</span>Internet Checkers</li>
                    </ul>
                  </li>
                  <li className="has-submenu">
                    <span className="xp-icon">🚀</span> Startup <span className="xp-arrow">▶</span>
                    <ul className="xp-submenu">
                      <li className="xp-menu-item disabled"><span className="xp-icon"></span>(Empty)</li>
                    </ul>
                  </li>
                  <li className="xp-separator"></li>
                  <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("gallery")}><span className="xp-icon"><img src={galleryIcon} alt="" style={{width:16,height:16}}/></span>Windows Picture Viewer</li>
                  <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("browser")}><span className="xp-icon"><img src={chrome} alt="" style={{width:16,height:16}}/></span>Internet Browser</li>
                  <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("myComputer")}><span className="xp-icon"><img src={computer} alt="" style={{width:16,height:16}}/></span>My Computer</li>
                  <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("recycleBin")}><span className="xp-icon"><img src={trashbin} alt="" style={{width:16,height:16}}/></span>Recycle Bin</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="menu-column menu-column-right">
            <ul>
              <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("gallery")}><img id="menuIcons" src={galleryIcon} alt="" /> My Pictures</li>
              <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("mediaPlayer")}><img id="menuIcons" src={mediaMenu} alt="" /> My Music</li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("myComputer")}><img id="menuIcons" src={computer} alt="" /> My Computer</li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("properties")}><img id="menuIcons" src={controlPanel} alt="" /> Control Panel</li>
              <li className="has-submenu">
                <img id="menuIcons" src={dialup} alt="" /> Connect To <span className="xp-arrow">▶</span>
                <ul className="xp-submenu">
                  <li className="xp-menu-item" onClick={() => handleProgramDoubleClick("dialup")}><span className="xp-icon"><img src={dialup} alt="" style={{width:16,height:16}}/></span>DCANet Dial-Up</li>
                  <li className="xp-menu-item disabled"><span className="xp-icon">🌐</span>Show all connections</li>
                </ul>
              </li>
              <li className="xp-menu-item disabled"><span className="xp-icon">🖨</span> Printers and Faxes</li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item" onClick={() => alert("Help and Support — Windows XP Help")}><img id="menuIcons" src={help} alt="" /> Help and Support</li>
              <li className="xp-menu-item" onClick={() => alert("Search — Windows XP Search Companion")}><img id="menuIcons" src={searchIcon} alt="" /> Search</li>
              <li className="xp-menu-item" onClick={() => setShowRun(true)}><img id="menuIcons" src={runApp} alt="" /> Run...</li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item" onClick={() => window.open("https://t.me/themeht", "_blank")}><img id="menuIcons" src={telegram} alt="" /> Themeht</li>
              <li className="xp-menu-item" onClick={() => window.open("https://linkedin.com/in/mehditohidi", "_blank")}><img id="menuIcons" src={linkedin} alt="" /> MehdiTohidi</li>
            </ul>
          </div>
        </div>
        <div className="start-menu-footer">
          <div className="left"></div>
          <button
            id="shutButton"
            className="shutdown"
            onClick={() => {
              const shutdown = document.querySelector(
                "#shut"
              ) as HTMLElement | null;
              if (shutdown) {
                shutdown.style.display = "flex";
              }
            }}
          >
            <img id="offImg" src={off} />
            Shut Down
          </button>
        </div>
      </div>

      {/* App Container */}
      <div id="partyLights" className="party-lights"></div>
      <div
        onMouseDown={startSelection}
        onTouchStart={startSelection}
        onTouchEnd={endSelection}
        onMouseUp={endSelection}
        onMouseMove={(e) => handleMouseMove(e as any)} // Cast to any to match MouseEvent type
        onContextMenu={handleContextMenu}
        className="app-container"
        ref={containerRef}
      >
        <div className="content"></div>

        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="context-menu"
            style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          >
            <ul>
              <li className="xp-menu-item has-submenu">
                <span className="xp-icon">⊞</span>
                Arrange Icons By
                <span className="xp-arrow">▶</span>
                <ul className="xp-submenu">
                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("arrange-name")}><span className="xp-icon">✓</span>Name</li>
                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("arrange-type")}><span className="xp-icon"></span>Type</li>
                  <li className="xp-menu-item disabled"><span className="xp-icon"></span>Size</li>
                  <li className="xp-separator"></li>
                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("arrange-auto")}><span className="xp-icon"></span>Auto Arrange</li>
                </ul>
              </li>
              <li className="xp-menu-item" onClick={() => handleMenuItemClick("refresh")}>
                <span className="xp-icon">↻</span>
                Refresh
              </li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item disabled"><span className="xp-icon">📋</span>Paste</li>
              <li className="xp-menu-item disabled"><span className="xp-icon">📋</span>Paste Shortcut</li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item has-submenu">
                <span className="xp-icon">✦</span>
                New
                <span className="xp-arrow">▶</span>
                <ul className="xp-submenu">
                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("new-shortcut")}><span className="xp-icon">↗</span>Shortcut</li>
                  <li className="xp-separator"></li>
                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("new-text")}><span className="xp-icon"><img src={textIcon} alt="" style={{width:16,height:16}} /></span>Text Document</li>
                </ul>
              </li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item has-submenu">
                <span className="xp-icon">★</span>
                My Socials
                <span className="xp-arrow">▶</span>
                <ul className="xp-submenu">
                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("instagram")}><span className="xp-icon"><img src={instagram} alt="" style={{width:16,height:16}} /></span>@mehditohidi_</li>
                                    <li className="xp-menu-item" onClick={() => handleMenuItemClick("linkedin")}><span className="xp-icon"><img src={linkedin} alt="" style={{width:16,height:16}} /></span>@mehditohidi</li>

                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("telegram")}><span className="xp-icon"><img src={telegram} alt="" style={{width:16,height:16}} /></span>@themeht</li>
                  <li className="xp-menu-item" onClick={() => handleMenuItemClick("contact")}><span className="xp-icon"><img src={email} alt="" style={{width:16,height:16}} /></span>Mehditohidi9@gmail.com</li>
                </ul>
              </li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item bold" onClick={() => handleMenuItemClick("properties")}>
                <span className="xp-icon"><img src={controlPanel} alt="" style={{width:16,height:16}} /></span>
                Properties
              </li>
            </ul>
          </div>
        )}

        {/* Icon (application) context menu — XP authentic */}
        {iconContextMenu && (
          <div ref={contextMenuRef} className="context-menu" style={{ top: `${iconContextMenu.y}px`, left: `${iconContextMenu.x}px` }}>
            <ul>
              <li className="xp-menu-item bold" onClick={() => handleIconMenuAction("open", iconContextMenu.targetId)}>
                <span className="xp-icon">▶</span>Open
              </li>
              <li className="xp-menu-item" onClick={() => handleIconMenuAction("open", iconContextMenu.targetId)}>
                <span className="xp-icon">⧉</span>Explore
              </li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item disabled"><span className="xp-icon">✂</span>Cut<span style={{marginLeft:"auto", color:"#aca899", fontSize:10}}>Ctrl+X</span></li>
              <li className="xp-menu-item disabled"><span className="xp-icon">⎘</span>Copy<span style={{marginLeft:"auto", color:"#aca899", fontSize:10}}>Ctrl+C</span></li>
              <li className="xp-menu-item has-submenu">
                <span className="xp-icon">↗</span>Send To<span className="xp-arrow">▶</span>
                <ul className="xp-submenu">
                  <li className="xp-menu-item disabled"><span className="xp-icon"></span>Compressed Folder</li>
                  <li className="xp-menu-item disabled"><span className="xp-icon"></span>Desktop (create shortcut)</li>
                  <li className="xp-menu-item disabled"><span className="xp-icon"></span>Mail Recipient</li>
                </ul>
              </li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item" onClick={() => handleIconMenuAction("delete", iconContextMenu.targetId)}>
                <span className="xp-icon">🗑</span>Delete<span style={{marginLeft:"auto", fontSize:10}}>Del</span>
              </li>
              <li className="xp-menu-item" onClick={() => handleIconMenuAction("rename", iconContextMenu.targetId)}>
                <span className="xp-icon">✎</span>Rename<span style={{marginLeft:"auto", fontSize:10}}>F2</span>
              </li>
              <li className="xp-separator"></li>
              <li className="xp-menu-item" onClick={() => handleIconMenuAction("properties", iconContextMenu.targetId)}>
                <span className="xp-icon"><img src={controlPanel} alt="" style={{width:16,height:16}} /></span>Properties
              </li>
            </ul>
          </div>
        )}

        {isSelecting && (
          <div
            className="selection-rectangle"
            style={{
              left: selection.x,
              top: selection.y,
              width: selection.width,
              height: selection.height,
            }}
          />
        )}
      </div>
      {showRun && <RunDialog onClose={() => setShowRun(false)} onRun={handleRun} />}
      {!booting &&
        startupErrors.map((err) => (
          <XPError
            key={err.id}
            onClose={() => setStartupErrors((prev) => prev.filter((e) => e.id !== err.id))}
            initialTitle={err.title}
            initialMessage={err.message}
            initialPos={{ x: err.x, y: err.y }}
            playDelayMs={0}
          />
        ))}
      {booting && (
        <div className="boot-screen">
          <div className="boot-logo"><img id="bootlogo" src={bootLogo} alt="Windows XP" /></div>
          <div className="boot-bar"><div className="boot-progress"></div></div>
          <div className="boot-text">Professional • Starting up...</div>
        </div>
      )}
    </div>
  );

  //Properties
  function WindowsXPDisplayProperties() {
    const wallpapers = { bg, bg2, bg3, bg4 };

    // Mapping of wallpaper keys to custom display names
    const wallpaperNames = {
      bg: "Bliss",
      bg2: "Autumn Leaves",
      bg3: "Mountain Peak",
      bg4: "Serene Lake",
    };

    // Load the initial wallpaper from local storage or default to "bg"
    const getInitialWallpaper = () => {
      const savedWallpaper = localStorage.getItem("selectedWallpaper");
      return savedWallpaper
        ? (savedWallpaper as keyof typeof wallpapers)
        : "bg";
    };

    const [selectedWallpaper, setSelectedWallpaper] =
      useState<keyof typeof wallpapers>(getInitialWallpaper);

    useEffect(() => {
      // Set the body background image when the component mounts
      document.body.style.backgroundImage = `url(${wallpapers[selectedWallpaper]})`;
    }, [selectedWallpaper, wallpapers]);

    const handleOkClick = () => {
      // Save the selected wallpaper to local storage
      localStorage.setItem("selectedWallpaper", selectedWallpaper);
      // Change the body background image to the selected wallpaper
      document.body.style.backgroundImage = `url(${wallpapers[selectedWallpaper]})`;
      closeWindow("properties");
    };

    return (
      <div className="properties-window">
        <div className="window-body">
          <div className="tab-menu">
            <div className="tab">Themes</div>
            <div className="tab selected">Desktop</div>
            <div className="tab">Settings</div>
          </div>
          <div className="content">
            <div className="wallpaper-selection">
              <div
                className="wallpaper-preview"
                style={{
                  backgroundImage: `url(${wallpapers[selectedWallpaper]})`,
                }}
              >
                <div
                  className={`wallpaper ${selectedWallpaper.toLowerCase()}`}
                ></div>
              </div>
              <div className="wallpaper-list">
                <label htmlFor="wallpaper">Background:</label>
                <select
                  id="wallpaper"
                  value={selectedWallpaper}
                  onChange={(e) => {
                    setSelectedWallpaper(
                      e.target.value as keyof typeof wallpapers
                    );
                  }}
                >
                  {Object.keys(wallpaperNames).map((wallpaper) => (
                    <option key={wallpaper} value={wallpaper}>
                      {wallpaperNames[wallpaper as keyof typeof wallpaperNames]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="window-footer">
            <button className="btn" onClick={handleOkClick}>
              OK
            </button>
            <button className="btn" onClick={() => closeWindow("properties")}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
};
export default App;
