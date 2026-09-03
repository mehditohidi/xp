import React, { useState } from "react";
import "./TicTacToe.css";

const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const TicTacToe: React.FC = () => {
  const [board,setBoard]=useState<Array<string|null>>(Array(9).fill(null));
  const [xTurn,setX]=useState(true);
  const win=lines.find(([a,b,c])=> board[a]&&board[a]===board[b]&&board[a]===board[c]);
  const winner= win? board[win[0]]:null;
  const draw=!winner && board.every(Boolean);
  const handle=(i:number)=>{ if(board[i]||winner) return; const nb=[...board]; nb[i]=xTurn?"X":"O"; setBoard(nb); setX(!xTurn); };
  const reset=()=>{ setBoard(Array(9).fill(null)); setX(true); };
  return (
    <div className="ttt-wrap">
      <div className="ttt-status">{winner ? `Winner: ${winner}` : draw ? "Draw!" : `Turn: ${xTurn?"X":"O"}`}</div>
      <div className="ttt-grid">
        {board.map((v,i)=>(
          <button key={i} className={`ttt-cell ${win?.includes(i)?"win":""}`} onClick={()=>handle(i)}>{v}</button>
        ))}
      </div>
      <button className="ttt-reset" onClick={reset}>New Game</button>
    </div>
  );
};
export default TicTacToe;
