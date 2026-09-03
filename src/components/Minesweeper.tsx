import React, { useState, useCallback, useEffect } from "react";
import "./Minesweeper.css";

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; count: number };
const SIZE = 9;
const MINES = 10;

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => ({ mine: false, revealed: false, flagged: false, count: 0 })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
  }
  for (let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(!board[r][c].mine) {
    let cnt=0;
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ const nr=r+dr,nc=c+dc; if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&board[nr][nc].mine) cnt++; }
    board[r][c].count=cnt;
  }
  return board;
}

const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flags, setFlags] = useState(0);

  const reset = () => { setBoard(createBoard()); setGameOver(false); setWon(false); setFlags(0); };

  const checkWin = useCallback((b: Cell[][]) => {
    let revealed=0; b.forEach(row=>row.forEach(cell=>{if(cell.revealed) revealed++;}));
    if(revealed === SIZE*SIZE-MINES){ setWon(true); setGameOver(true);}
  },[]);

  const reveal = (r:number,c:number) => {
    if(gameOver || board[r][c].flagged || board[r][c].revealed) return;
    if(board[r][c].mine){ const nb=board.map(row=>row.map(cell=>({...cell,revealed:cell.mine?true:cell.revealed}))); setBoard(nb); setGameOver(true); return; }
    const nb = board.map(row=>row.map(cell=>({...cell})));
    const flood = (fr:number,fc:number) => {
      if(fr<0||fr>=SIZE||fc<0||fc>=SIZE||nb[fr][fc].revealed||nb[fr][fc].flagged) return;
      nb[fr][fc].revealed=true;
      if(nb[fr][fc].count===0) for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) flood(fr+dr,fc+dc);
    };
    flood(r,c);
    setBoard(nb); checkWin(nb);
  };

  const flag = (e:React.MouseEvent,r:number,c:number) => {
    e.preventDefault();
    if(gameOver || board[r][c].revealed) return;
    const nb=board.map(row=>row.map(cell=>({...cell}))); nb[r][c].flagged=!nb[r][c].flagged;
    setBoard(nb); setFlags(f=>nb[r][c].flagged?f+1:f-1);
  };

  const elapsedRef = React.useRef(0);
  const [elapsed,setElapsed]=useState(0);
  useEffect(()=>{ if(gameOver) return; const id=setInterval(()=>{ elapsedRef.current++; setElapsed(elapsedRef.current); },1000); return()=>clearInterval(id); },[gameOver]);
  useEffect(()=>{ elapsedRef.current=0; setElapsed(0); },[board]);

  return (
    <div className="ms-wrap">
      <div className="ms-header">
        <div className="ms-counter">{String(MINES-flags).padStart(3,"0")}</div>
        <button className="ms-face" onClick={reset}>{gameOver ? (won?"😎":"😵") : "🙂"}</button>
        <div className="ms-counter">{String(elapsed).padStart(3,"0")}</div>
      </div>
      <div className="ms-grid" style={{gridTemplateColumns:`repeat(${SIZE},1fr)`}}>
        {board.map((row,r)=> row.map((cell,c)=>(
          <button key={`${r}-${c}`} className={`ms-cell ${cell.revealed?"revealed":""} ${cell.flagged?"flagged":""}`} onClick={()=>reveal(r,c)} onContextMenu={(e)=>flag(e,r,c)}>
            {cell.revealed ? (cell.mine?"💣":cell.count?cell.count:"") : (cell.flagged?"🚩":"")}
          </button>
        )))}
      </div>
      <div className="ms-status">{gameOver ? (won?"You Win!":"Game Over"):`${MINES-flags} mines left`}</div>
    </div>
  );
};
export default Minesweeper;
