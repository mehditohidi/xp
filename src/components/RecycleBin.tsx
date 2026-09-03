import React from "react";
import "./RecycleBin.css";
import trash from "../img/trashbin.png";

type Props={ items:{id:string;name:string}[]; onRestore:(id:string)=>void; onEmpty:()=>void };
const RecycleBin: React.FC<Props> = ({items,onRestore,onEmpty}) => {
  return (
    <div className="rb-wrap">
      <div className="rb-toolbar">
        <button onClick={()=>window.alert("Restore All — simulated")} disabled={items.length===0}>Restore All</button>
        <button onClick={onEmpty} disabled={items.length===0}>Empty Recycle Bin</button>
      </div>
      {items.length===0 ? (
        <div className="rb-empty"><img src={trash} alt="" /><p>The Recycle Bin is empty.</p><span>Deleted files will appear here. Right-click desktop icons → Delete to test.</span></div>
      ) : (
        <div className="rb-list">
          {items.map(it=>(
            <div key={it.id} className="rb-item">
              <img src={trash} alt="" />
              <div className="rb-name">{it.name}</div>
              <button onClick={()=>onRestore(it.id)}>Restore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default RecycleBin;
