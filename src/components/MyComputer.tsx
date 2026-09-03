import React from "react";
import "./MyComputer.css";
import comp from "../img/computer.png";
import doc from "../img/document.png";

const drives=[
  {label:"Local Disk (C:)", free:12, total:40, icon:comp, fs:"NTFS"},
  {label:"Data (D:)", free:68, total:120, icon:doc, fs:"NTFS"},
  {label:"DVD Drive (E:)", free:0, total:4.7, icon:doc, fs:"CDFS"},
];

const MyComputer: React.FC = () => {
  return (
    <div className="mc-wrap">
      <div className="mc-section">Hard Disk Drives</div>
      <div className="mc-grid">
        {drives.slice(0,2).map(d=>(
          <div key={d.label} className="mc-drive">
            <img src={d.icon} alt="" />
            <div className="mc-info">
              <div className="mc-label">{d.label}</div>
              <div className="mc-bar"><div className="mc-fill" style={{width:`${(1-d.free/d.total)*100}%`}} /></div>
              <div className="mc-free">{d.free} GB free of {d.total} GB • {d.fs}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mc-section">Devices with Removable Storage</div>
      <div className="mc-grid">
        <div className="mc-drive"><img src={drives[2].icon} alt="" /><div className="mc-info"><div className="mc-label">{drives[2].label}</div><div className="mc-free">DVD • {drives[2].fs}</div></div></div>
      </div>
      <div className="mc-footer">3 objects • Windows XP Professional</div>
    </div>
  );
};
export default MyComputer;
