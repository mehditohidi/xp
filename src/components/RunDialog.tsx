import React, { useState } from "react";
import "./RunDialog.css";

interface Props {
  onClose: () => void;
  onRun: (cmd: string) => void;
}

const RunDialog: React.FC<Props> = ({ onClose, onRun }) => {
  const [value, setValue] = useState("");

  const handleOk = () => {
    if (value.trim()) onRun(value.trim());
    onClose();
  };

  return (
    <div className="run-overlay">
      <div className="run-window">
        <div className="run-titlebar">
          <span>Run</span>
          <button className="run-close" onClick={onClose}>×</button>
        </div>
        <div className="run-body">
          <div className="run-icon">▶</div>
          <div className="run-content">
            <p>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
            <label>Open:</label>
            <div className="run-input-row">
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOk()}
                placeholder="e.g. calc, notepad, cmd"
              />
            </div>
          </div>
        </div>
        <div className="run-buttons">
          <button onClick={handleOk} className="xp-btn default">OK</button>
          <button onClick={onClose} className="xp-btn">Cancel</button>
          <button className="xp-btn">Browse...</button>
        </div>
      </div>
    </div>
  );
};

export default RunDialog;
