import React, { useEffect, useRef, useState } from "react";
import "./Snake.css";
const SIZE=14;
const W=18,H=14;
type Pt={x:number;y:number};
export default function Snake(){
  const [snake,setSnake]=useState<Pt[]>([{x:8,y:7},{x:7,y:7}]);
  const [dir,setDir]=useState<Pt>({x:1,y:0});
  const [food,setFood]=useState<Pt>({x:12,y:7});
  const [score,setScore]=useState(0);
  const [over,setOver]=useState(false);
  const overRef=useRef(over);
  useEffect(()=>{overRef.current=over},[over]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{ if(e.key==="ArrowUp"&&dir.y===0)setDir({x:0,y:-1}); if(e.key==="ArrowDown"&&dir.y===0)setDir({x:0,y:1}); if(e.key==="ArrowLeft"&&dir.x===0)setDir({x:-1,y:0}); if(e.key==="ArrowRight"&&dir.x===0)setDir({x:1,y:0}); };
    window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey);
  },[dir]);
  useEffect(()=>{
    if(over) return;
    const id=setInterval(()=>{
      setSnake(prev=>{
        const head={x:(prev[0].x+dir.x+W)%W, y:(prev[0].y+dir.y+H)%H};
        if(prev.some(p=>p.x===head.x&&p.y===head.y)){ setOver(true); return prev; }
        const next=[head,...prev];
        if(head.x===food.x&&head.y===food.y){ setScore(s=>s+10); setFood({x:Math.floor(Math.random()*W),y:Math.floor(Math.random()*H)}); }
        else next.pop();
        return next;
      });
    },110);
    return()=>clearInterval(id);
  },[dir,food,over]);
  const reset=()=>{ setSnake([{x:8,y:7},{x:7,y:7}]); setDir({x:1,y:0}); setFood({x:12,y:7}); setScore(0); setOver(false); };
  return (
    <div className="snake-wrap">
      <div className="snake-hud"><span>Score: {score}</span><span>{over?"Game Over":"Use arrows"}</span><button onClick={reset}>New Game</button></div>
      <div className="snake-board" style={{gridTemplateColumns:`repeat(${W}, ${SIZE}px)`}}>
        {Array.from({length:W*H}).map((_,i)=>{ const x=i%W,y=Math.floor(i/W); const isSnake=snake.some(p=>p.x===x&&p.y===y); const isHead=snake[0]?.x===x&&snake[0]?.y===y; const isFood=food.x===x&&food.y===y;
          return <div key={i} className={`snake-cell ${isSnake?"snake":""} ${isHead?"head":""} ${isFood?"food":""}`} />;
        })}
      </div>
      <div className="snake-ctrl">
        <button onClick={()=>dir.y===0&&setDir({x:0,y:-1})}>▲</button>
        <div><button onClick={()=>dir.x===0&&setDir({x:-1,y:0})}>◀</button><button onClick={()=>dir.x===0&&setDir({x:1,y:0})}>▶</button></div>
        <button onClick={()=>dir.y===0&&setDir({x:0,y:1})}>▼</button>
      </div>
    </div>
  );
}
