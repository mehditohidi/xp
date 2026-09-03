import React, { useState } from "react";
import "./GalleryViewer.css";
import bg from "../img/bg.jpg";
import bg2 from "../img/bg4.jpg";
import bg3 from "../img/bg3.jpg";
import bg4 from "../img/bg2.jpg";
import profile from "../img/profile.jpg";

const images=[
  {src:bg,label:"Bliss",desc:"Windows XP Bliss"},
  {src:bg2,label:"Autumn",desc:"Autumn Leaves"},
  {src:bg3,label:"Mountain",desc:"Mountain Peak"},
  {src:bg4,label:"Lake",desc:"Serene Lake"},
  {src:profile,label:"Profile",desc:"Mehdi Tohidi"},
];

const GalleryViewer: React.FC = () => {
  const [sel,setSel]=useState(images[0]);
  const setWallpaper=(src:string)=>{ document.body.style.backgroundImage=`url(${src})`; localStorage.setItem("selectedWallpaper", Object.keys({bg,bg2,bg3,bg4}).find(k=>({bg,bg2,bg3,bg4} as any)[k]===src) || "bg"); };
  return (
    <div className="gal-wrap">
      <div className="gal-sidebar">
        {images.map(im=>(
          <div key={im.label} className={`gal-thumb ${sel.src===im.src?"active":""}`} onClick={()=>setSel(im)}>
            <img src={im.src} alt={im.label} />
            <span>{im.label}</span>
          </div>
        ))}
      </div>
      <div className="gal-main">
        <div className="gal-preview" style={{backgroundImage:`url(${sel.src})`}} />
        <div className="gal-info"><b>{sel.label}</b> — {sel.desc}</div>
        <div className="gal-actions">
          <button className="xp-btn" onClick={()=>setWallpaper(sel.src)}>Set as Wallpaper</button>
          <button className="xp-btn" onClick={()=>window.open(sel.src,"_blank")}>Open</button>
        </div>
      </div>
    </div>
  );
};
export default GalleryViewer;
