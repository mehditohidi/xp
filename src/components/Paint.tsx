import React, { useRef, useState, useEffect, useCallback } from "react";
import "./Paint.css";

// Windows Paint classic color palette
const colors = [
  "#000000", "#808080", "#800000", "#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#8000ff", "#ff00ff",
  "#ffffff", "#c0c0c0", "#ffa0a0", "#ffd080", "#ffffa0", "#a0ffa0", "#a0ffff", "#a0a0ff", "#ffa0ff"
];

// Tool types
type Tool = "pencil" | "brush" | "eraser" | "fill" | "line" | "rect" | "ellipse" | "text";

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#000000");
  const [color2, setColor2] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<Tool>("pencil");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [shapePreview, setShapePreview] = useState<ImageData | null>(null);
  const [isRightClick, setIsRightClick] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready");

  // Save state for undo/redo
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.putImageData(history[historyIndex - 1], 0, 0);
      setStatusMessage(`Undo (${historyIndex} steps left)`);
    } else {
      setStatusMessage("Cannot undo further");
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.putImageData(history[historyIndex + 1], 0, 0);
      setStatusMessage(`Redo (${history.length - historyIndex - 2} steps left)`);
    } else {
      setStatusMessage("Cannot redo further");
    }
  }, [history, historyIndex]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;
    
    // Fill with white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);
    
    setStatusMessage("New document created");
  }, []);

  // Get canvas coordinates
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Start drawing
  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    setStartPos(pos);
    setLastPos(pos);
    setIsDrawing(true);
    
    if ("button" in e && e.button === 2) {
      setIsRightClick(true);
    }
    
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    
    // For pencil, brush, eraser - start path
    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    
    setStatusMessage(`Drawing at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
  };

  // Draw
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    
    const currentColor = isRightClick ? color2 : color;
    
    switch (tool) {
      case "pencil":
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.strokeStyle = currentColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
        
      case "brush":
        ctx.lineWidth = brushSize * 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = currentColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
        
      case "eraser":
        ctx.lineWidth = brushSize * 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#ffffff";
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
        
      case "line":
      case "rect":
      case "ellipse":
        // Preview shape
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Restore from saved state
        if (shapePreview) {
          ctx.putImageData(shapePreview, 0, 0);
        }
        
        // Draw shape preview
        ctx.save();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        
        const x = Math.min(startPos.x, pos.x);
        const y = Math.min(startPos.y, pos.y);
        const w = Math.abs(pos.x - startPos.x);
        const h = Math.abs(pos.y - startPos.y);
        
        if (tool === "line") {
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        } else if (tool === "rect") {
          ctx.strokeRect(x, y, w, h);
        } else if (tool === "ellipse") {
          ctx.beginPath();
          ctx.ellipse(startPos.x + (pos.x - startPos.x) / 2, startPos.y + (pos.y - startPos.y) / 2, w/2, h/2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
        break;
        
      case "fill":
        // Flood fill (simplified - just fill a small area)
        const fillColor = currentColor;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    setLastPos(pos);
    setStatusMessage(`Drawing at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
  };

  // Stop drawing
  const stopDraw = (e?: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setIsRightClick(false);
    
    // Save final shape if using shape tools
    if (tool === "line" || tool === "rect" || tool === "ellipse") {
      saveState();
      setShapePreview(null);
    } else {
      saveState();
    }
    
    setStatusMessage("Ready");
  };

  // Clear canvas
  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveState();
      setStatusMessage("Canvas cleared");
    }
  };

  // Download
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `paint_${new Date().toISOString().slice(0,10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatusMessage("Image saved");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'b') {
        setTool("brush");
      } else if (e.key === 'p') {
        setTool("pencil");
      } else if (e.key === 'e') {
        setTool("eraser");
      } else if (e.key === 'l') {
        setTool("line");
      } else if (e.key === 'r') {
        setTool("rect");
      } else if (e.key === 'o') {
        setTool("ellipse");
      } else if (e.key === 'f') {
        setTool("fill");
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Handle right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="paint-app" onContextMenu={handleContextMenu}>
      {/* Menu Bar */}
      <div className="paint-menu-bar">
        <div className="menu-item">File</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">View</div>
        <div className="menu-item">Image</div>
        <div className="menu-item">Colors</div>
        <div className="menu-item">Help</div>
      </div>

      {/* Toolbar */}
      <div className="paint-toolbar">
        <div className="tool-group">
          <button 
            className={`tool-btn ${tool === 'pencil' ? 'active' : ''}`} 
            onClick={() => setTool("pencil")}
            title="Pencil (P)"
          >
            ✏️
          </button>
          <button 
            className={`tool-btn ${tool === 'brush' ? 'active' : ''}`} 
            onClick={() => setTool("brush")}
            title="Brush (B)"
          >
            🖌️
          </button>
          <button 
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`} 
            onClick={() => setTool("eraser")}
            title="Eraser (E)"
          >
            🧹
          </button>
          <button 
            className={`tool-btn ${tool === 'fill' ? 'active' : ''}`} 
            onClick={() => setTool("fill")}
            title="Fill (F)"
          >
            🪣
          </button>
          <div className="tool-divider" />
          <button 
            className={`tool-btn ${tool === 'line' ? 'active' : ''}`} 
            onClick={() => setTool("line")}
            title="Line (L)"
          >
            ╱
          </button>
          <button 
            className={`tool-btn ${tool === 'rect' ? 'active' : ''}`} 
            onClick={() => setTool("rect")}
            title="Rectangle (R)"
          >
            □
          </button>
          <button 
            className={`tool-btn ${tool === 'ellipse' ? 'active' : ''}`} 
            onClick={() => setTool("ellipse")}
            title="Ellipse (O)"
          >
            ○
          </button>
        </div>

        <div className="tool-divider" />

        <div className="tool-group">
          <button 
            className="tool-btn" 
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            ↩️
          </button>
          <button 
            className="tool-btn" 
            onClick={redo}
            title="Redo (Ctrl+Y)"
          >
            ↪️
          </button>
        </div>

        <div className="tool-divider" />

        <div className="tool-group brush-sizes">
          <span className="tool-label">Size:</span>
          {[1, 2, 4, 6, 8].map(size => (
            <button
              key={size}
              className={`size-btn ${brushSize === size ? 'active' : ''}`}
              onClick={() => setBrushSize(size)}
              title={`${size}px`}
            >
              <div 
                className="size-dot" 
                style={{ 
                  width: size * 1.5, 
                  height: size * 1.5,
                  borderRadius: '50%',
                  background: '#333'
                }}
              />
            </button>
          ))}
        </div>

        <div className="tool-divider" />

        <div className="tool-group">
          <button className="tool-btn" onClick={clearCanvas} title="Clear Canvas">
            🗑️
          </button>
          <button className="tool-btn" onClick={download} title="Save (Ctrl+S)">
            💾
          </button>
        </div>
      </div>

      {/* Color Palette */}
      <div className="paint-colors">
        <div className="color-primary">
          <div className="color-box" style={{ background: color }}>
            <div className="color-label">Color 1</div>
          </div>
          <div className="color-box" style={{ background: color2 }}>
            <div className="color-label">Color 2</div>
          </div>
          <div className="color-swap" onClick={() => {
            const temp = color;
            setColor(color2);
            setColor2(temp);
          }} title="Swap colors">
            ⇄
          </div>
        </div>
        
        <div className="color-palette">
          {colors.map(c => (
            <button
              key={c}
              className={`color-swatch ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              onContextMenu={(e) => {
                e.preventDefault();
                setColor2(c);
              }}
              title={`Left: Color 1, Right: Color 2`}
            />
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="paint-canvas-wrap" ref={canvasContainerRef}>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          style={{ 
            cursor: tool === 'eraser' ? 'cell' : 
                    tool === 'fill' ? 'pointer' : 
                    'crosshair'
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="paint-status">
        <span className="status-item">
          <span className="status-label">Tool:</span> 
          {tool.charAt(0).toUpperCase() + tool.slice(1)}
        </span>
        <span className="status-item">
          <span className="status-label">Size:</span> 
          {brushSize}px
        </span>
        <span className="status-item">
          <span className="status-label">Color:</span>
          <span className="status-color" style={{ background: color }} />
          {color}
        </span>
        <span className="status-item status-message">
          {statusMessage}
        </span>
        <span className="status-item status-right">
          <span className="status-label">Pos:</span> 
          {lastPos.x.toFixed(0)}, {lastPos.y.toFixed(0)}
        </span>
      </div>
    </div>
  );
};

export default Paint;