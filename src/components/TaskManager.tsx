import React, { useState, useEffect } from "react";
import "./TaskManager.css";

const procs=[
  {pid:1240,name:"explorer.exe",cpu:"02",mem:"18,240 K"},
  {pid:892,name:"svchost.exe",cpu:"00",mem:"4,120 K"},
  {pid:2044,name:"chrome.exe",cpu:"14",mem:"82,560 K"},
  {pid:3122,name:"notepad.exe",cpu:"00",mem:"3,400 K"},
  {pid:401,name:"mspaint.exe",cpu:"01",mem:"12,900 K"},
];

const TaskManager: React.FC<{openWindows:string[]}> = ({openWindows}) => {
  const [tab,setTab]=useState<"processes"|"performance">("processes");
  const [cpu,setCpu]=useState<number[]>(Array(40).fill(20));
  useEffect(()=>{ const id=setInterval(()=> setCpu(prev=>[...prev.slice(1), 10+Math.random()*60]), 800); return()=>clearInterval(id); },[]);
  const avg=Math.round(cpu.slice(-8).reduce((a,b)=>a+b,0)/8);
  return (
    <div className="tm-wrap">
      <div className="tm-tabs">
        <button className={tab==="processes"?"active":""} onClick={()=>setTab("processes")}>Processes</button>
        <button className={tab==="performance"?"active":""} onClick={()=>setTab("performance")}>Performance</button>
      </div>
      {tab==="processes" ? (
        <>
          <div className="tm-bar">Processes: {procs.length + openWindows.length} | CPU: {avg}%</div>
          <div className="tm-table">
            <div className="tm-head"><span>Image Name</span><span>PID</span><span>CPU</span><span>Mem</span></div>
            {procs.map(p=> <div key={p.pid} className="tm-row"><span>{p.name}</span><span>{p.pid}</span><span>{p.cpu}</span><span>{p.mem}</span></div>)}
            {openWindows.map(w=> <div key={w} className="tm-row hl"><span>{w}.exe</span><span>{1000+Math.floor(Math.random()*9000)}</span><span>00</span><span>2,100 K</span></div>)}
          </div>
          <button className="xp-btn tm-end" onClick={()=>window.alert("End Process — simulated")}>End Process</button>
        </>
      ):(
        <div className="tm-perf">
          <div className="tm-chart">
            <div className="tm-chart-label">CPU Usage: {avg}%</div>
            <svg width="100%" height="80" viewBox="0 0 40 80" style={{background:"#000"}}>
              <polyline fill="none" stroke="#00ff00" strokeWidth="1.2" points={cpu.map((v,i)=>`${i*1},${80 - v}`).join(" ")} />
              <line x1="0" y1="40" x2="40" y2="40" stroke="#333" strokeDasharray="2 2"/>
            </svg>
          </div>
          <div className="tm-stats">
            <div>Physical Memory: 512 MB</div>
            <div>Available: {320 - avg} MB</div>
            <div>Processes: {procs.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TaskManager;
