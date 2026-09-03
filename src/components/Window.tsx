import React from "react";
import "./Window.css";

interface Props {
  id: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  onMouseDown: (e: any, id: string) => void;
  onTouchStart: (e: any, id: string) => void;
  style: React.CSSProperties;
  onFocus: () => void;
}

const Window: React.FC<Props> = ({ title, icon, children, onClose, onMinimize, onMaximize, isMaximized, onMouseDown, onTouchStart, style, onFocus, id }) => {
  return (
    <div className={`xp-window ${isMaximized ? "maximized" : ""}`} style={style} onClick={onFocus} id={id}>
      <div className="xp-titlebar" onMouseDown={(e) => onMouseDown(e, id)} onTouchStart={(e) => onTouchStart(e, id)}>
        <div className="xp-title-left">
          {icon && <img src={icon} alt="" className="xp-title-icon" />}
          <span className="xp-title-text">{title}</span>
        </div>
        <div className="xp-title-controls">
          <button className="xp-ctrl minimize" onClick={onMinimize} aria-label="Minimize">_</button>
          <button className="xp-ctrl maximize" onClick={onMaximize} aria-label="Maximize">□</button>
          <button className="xp-ctrl close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>
      <div className="xp-window-content">{children}</div>
    </div>
  );
};

export default Window;
