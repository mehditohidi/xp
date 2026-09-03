import React, { useState } from "react";
import "./Calculator.css";

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = (d: string) => {
    if (waiting) {
      setDisplay(d);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  };

  const inputDot = () => {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }
    if (display.indexOf(".") === -1) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setWaiting(false);
  };

  const calculate = (a: number, operation: string, b: number) => {
    switch (operation) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleOp = (nextOp: string) => {
    const input = parseFloat(display);
    if (prev === null) {
      setPrev(input);
    } else if (op) {
      const result = calculate(prev, op, input);
      setDisplay(String(parseFloat(result.toFixed(10))));
      setPrev(result);
    }
    setWaiting(true);
    setOp(nextOp);
  };

  const handleEquals = () => {
    if (op && prev !== null) {
      const input = parseFloat(display);
      const result = calculate(prev, op, input);
      setDisplay(String(parseFloat(result.toFixed(10))));
      setPrev(null);
      setOp(null);
      setWaiting(true);
    }
  };

  const handleBackspace = () => {
    if (waiting) return;
    if (display.length === 1) setDisplay("0");
    else setDisplay(display.slice(0, -1));
  };

  return (
    <div className="xp-calc">
      <div className="xp-calc-display">
        <input className="xp-calc-screen" value={display} readOnly />
      </div>
      <div className="xp-calc-body">
        <div className="xp-calc-memory">
          <button className="calc-mem-btn" disabled>M+</button>
          <button className="calc-mem-btn" disabled>M-</button>
          <button className="calc-mem-btn" disabled>MR</button>
          <button className="calc-mem-btn" disabled>MC</button>
        </div>
        <div className="xp-calc-grid">
          <button className="calc-btn calc-func" onClick={handleBackspace}>Back</button>
          <button className="calc-btn calc-func" onClick={clear}>CE</button>
          <button className="calc-btn calc-func" onClick={clear}>C</button>

          <button className="calc-btn calc-num" onClick={() => inputDigit("7")}>7</button>
          <button className="calc-btn calc-num" onClick={() => inputDigit("8")}>8</button>
          <button className="calc-btn calc-num" onClick={() => inputDigit("9")}>9</button>
          <button className="calc-btn calc-op" onClick={() => handleOp("÷")}>/</button>
          <button className="calc-btn calc-func" onClick={() => {
            const v = parseFloat(display);
            setDisplay(String(Math.sqrt(v)));
          }}>sqrt</button>

          <button className="calc-btn calc-num" onClick={() => inputDigit("4")}>4</button>
          <button className="calc-btn calc-num" onClick={() => inputDigit("5")}>5</button>
          <button className="calc-btn calc-num" onClick={() => inputDigit("6")}>6</button>
          <button className="calc-btn calc-op" onClick={() => handleOp("×")}>*</button>
          <button className="calc-btn calc-func" onClick={() => {
            const v = parseFloat(display);
            setDisplay(String(v / 100));
          }}>%</button>

          <button className="calc-btn calc-num" onClick={() => inputDigit("1")}>1</button>
          <button className="calc-btn calc-num" onClick={() => inputDigit("2")}>2</button>
          <button className="calc-btn calc-num" onClick={() => inputDigit("3")}>3</button>
          <button className="calc-btn calc-op" onClick={() => handleOp("-")}>-</button>
          <button className="calc-btn calc-func" onClick={() => {
            const v = parseFloat(display);
            setDisplay(String(1 / v));
          }}>1/x</button>

          <button className="calc-btn calc-num" onClick={() => inputDigit("0")}>0</button>
          <button className="calc-btn calc-num" onClick={inputDot}>.</button>
          <button className="calc-btn calc-num" onClick={() => {
            const v = parseFloat(display);
            setDisplay(String(-v));
          }}>+/-</button>
          <button className="calc-btn calc-op" onClick={() => handleOp("+")}>+</button>
          <button className="calc-btn calc-equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
