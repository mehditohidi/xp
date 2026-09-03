import React, { useRef, useState } from "react";
import "./Browser.css";
import { searchUrl } from "./img";

const bookmarks = [
  { name: "Digikala", url: "https://www.digikala.com" },
  { name: "Wikipedia", url: "https://www.wikipedia.org" },
];

const HOME_URL = "https://www.digikala.com";

const Browser: React.FC = () => {
  const [url, setUrl] = useState(HOME_URL);
  const [iframeUrl, setIframeUrl] = useState(HOME_URL);
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef<string[]>([HOME_URL]);
  const historyIndexRef = useRef(0);

  const normalizeUrl = (value: string) => {
    if (!/^https?:\/\//i.test(value)) {
      return "https://" + value;
    }
    return value;
  };

  const navigateTo = (target: string, pushHistory = true) => {
    const formatted = normalizeUrl(target);
    setUrl(formatted);
    setIframeUrl(formatted);
    setIsLoading(true);

    if (pushHistory) {
      const history = historyRef.current.slice(0, historyIndexRef.current + 1);
      history.push(formatted);
      historyRef.current = history;
      historyIndexRef.current = history.length - 1;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigateTo(url);
    }
  };

  const goBack = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      navigateTo(historyRef.current[historyIndexRef.current], false);
    }
  };

  const goForward = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      navigateTo(historyRef.current[historyIndexRef.current], false);
    }
  };

  const reload = () => {
    setIsLoading(true);
    setIframeUrl(iframeUrl + (iframeUrl.includes("?") ? "&" : "?") + "_r=" + Date.now());
  };

  const goHome = () => navigateTo(HOME_URL);

  const canGoBack = historyIndexRef.current > 0;
  const canGoForward = historyIndexRef.current < historyRef.current.length - 1;

  return (
    <div className="browser">
      <div className="browser-titlebar">
        <div className="browser-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="browser-title">New Tab</span>
      </div>

      <div className="browser-header">
        <div className="nav-controls">
          <button
            className="nav-button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label="Go back"
          >
            ‹
          </button>
          <button
            className="nav-button"
            onClick={goForward}
            disabled={!canGoForward}
            aria-label="Go forward"
          >
            ›
          </button>
          <button className="nav-button" onClick={reload} aria-label="Reload">
            ↻
          </button>
          <button className="nav-button" onClick={goHome} aria-label="Home">
            ⌂
          </button>
        </div>

        <div className="browser-url-bar">
          <span className="url-secure">🔒</span>
          <input
            id="inputUrl"
            type="text"
            className="browser-url"
            placeholder="Search or enter a URL"
            value={url}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
        </div>

        <button id="goUrl" onClick={() => navigateTo(url)} aria-label="Go">
          <img id="goImage" src={searchUrl} alt="" />
        </button>
      </div>

      <div className="browser-bookmarks">
        {bookmarks.map((bookmark, index) => (
          <button
            key={index}
            className="bookmark-button"
            onClick={() => navigateTo(bookmark.url)}
          >
            {bookmark.name}
          </button>
        ))}
      </div>

      <div className="browser-content">
        {isLoading && <div className="browser-progress" />}
        <iframe
          title="browser"
          src={iframeUrl}
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    </div>
  );
};

export default Browser;