import React, { useEffect, useState, useRef } from "react";
import "./VSCode.css";

const FONT_AWESOME_ID = "vscode-fa";

function useFontAwesome() {
  useEffect(() => {
    if (!document.getElementById(FONT_AWESOME_ID)) {
      const link = document.createElement("link");
      link.id = FONT_AWESOME_ID;
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
      document.head.appendChild(link);
    }
  }, []);
}

type Kind = "file" | "folder";
interface FSNode {
  id: string;
  name: string;
  kind: Kind;
  parentId: string | null;
  content: string; // only for files
}

const initialNodes: FSNode[] = [
  { id: "src", name: "src", kind: "folder", parentId: null, content: "" },
  { id: "app.js", name: "app.js", kind: "file", parentId: "src", content:
`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Render the root component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Hot module replacement (dev only)
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(<NextApp />);
  });
}

// console.log("VS Code simulator ready")
console.log('🚀 Simulator ready');` },
  { id: "index.html", name: "index.html", kind: "file", parentId: "src", content:
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>XP · VS Code</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>` },
  { id: "style.css", name: "style.css", kind: "file", parentId: "src", content:
`/* XP VS Code — editor theme */
body {
  margin: 0;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Segoe UI', sans-serif;
}
.editor {
  padding: 20px;
  line-height: 1.6;
}` },
  { id: "components", name: "components", kind: "folder", parentId: "src", content: "" },
  { id: "assets", name: "assets", kind: "folder", parentId: null, content: "" },
  { id: "README.md", name: "README.md", kind: "file", parentId: null, content: "# my-project\n\nXP VS Code simulator — edit files, create new ones.\n" },
  { id: "package.json", name: "package.json", kind: "file", parentId: null, content: `{\n  "name": "my-project",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite"\n  }\n}` },
];

function fileIconClass(name: string) {
  if (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".tsx")) return "fas fa-file-code";
  if (name.endsWith(".html")) return "fas fa-file-code";
  if (name.endsWith(".css")) return "fas fa-file-css";
  if (name.endsWith(".json")) return "fas fa-file-alt";
  if (name.endsWith(".md")) return "fab fa-markdown";
  return "fas fa-file-alt";
}

const VSCode: React.FC = () => {
  useFontAwesome();
  const [nodes, setNodes] = useState<FSNode[]>(initialNodes);
  const [openIds, setOpenIds] = useState<string[]>(["app.js", "index.html", "style.css"]);
  const [activeId, setActiveId] = useState<string | null>("app.js");
  const [activity, setActivity] = useState("explorer");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["src"]));
  const [selectedId, setSelectedId] = useState<string | null>("src");
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeNode = activeId ? nodes.find((n) => n.id === activeId && n.kind === "file") : null;

  const toggleFolder = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelectedId(id);
  };

  const getChildren = (parentId: string | null) =>
    nodes
      .filter((n) => n.parentId === parentId)
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

  const openFile = (id: string) => {
    setSelectedId(id);
    if (!openIds.includes(id)) setOpenIds((p) => [...p, id]);
    setActiveId(id);
  };

  const closeFile = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenIds((prev) => {
      const next = prev.filter((x) => x !== id);
      if (activeId === id) {
        const idx = prev.indexOf(id);
        const fallback = next[idx] || next[idx - 1] || null;
        setActiveId(fallback);
      }
      return next;
    });
  };

  const updateFileContent = (id: string, content: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)));
  };

  const resolveCreateParent = (): string | null => {
    if (!selectedId) return null;
    const sel = nodes.find((n) => n.id === selectedId);
    if (!sel) return null;
    if (sel.kind === "folder") return sel.id;
    return sel.parentId;
  };

  const handleNewFile = () => {
    const parentId = resolveCreateParent();
    const raw = window.prompt("New file name (with extension):", "untitled.js");
    if (!raw || !raw.trim()) return;
    const name = raw.trim();
    if (name.includes("/")) {
      window.alert("Use a single file name, no slashes.");
      return;
    }
    const siblings = nodes.filter((n) => n.parentId === parentId).map((n) => n.name);
    if (siblings.includes(name)) {
      window.alert("A file or folder with that name already exists.");
      return;
    }
    const id = `${parentId ? parentId + "/" : ""}${name}__${Date.now()}`;
    const newNode: FSNode = { id, name, kind: "file", parentId, content: "" };
    setNodes((p) => [...p, newNode]);
    if (parentId) setExpanded((prev) => new Set(prev).add(parentId));
    setSelectedId(id);
    setOpenIds((p) => [...p, id]);
    setActiveId(id);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleNewFolder = () => {
    const parentId = resolveCreateParent();
    const raw = window.prompt("New folder name:", "new-folder");
    if (!raw || !raw.trim()) return;
    const name = raw.trim();
    if (name.includes("/") || name.includes(".")) {
      window.alert("Folder name cannot contain / or .");
      return;
    }
    const siblings = nodes.filter((n) => n.parentId === parentId).map((n) => n.name);
    if (siblings.includes(name)) {
      window.alert("A file or folder with that name already exists.");
      return;
    }
    const id = `${parentId ? parentId + "/" : ""}${name}__${Date.now()}`;
    const newNode: FSNode = { id, name, kind: "folder", parentId, content: "" };
    setNodes((p) => [...p, newNode]);
    if (parentId) setExpanded((prev) => new Set(prev).add(parentId));
    setExpanded((prev) => new Set(prev).add(id));
    setSelectedId(id);
  };

  const handleKeyDownInEditor = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const before = ta.value.substring(0, start);
      const after = ta.value.substring(end);
      const insert = "  ";
      const newValue = before + insert + after;
      if (activeId) updateFileContent(activeId, newValue);
      // move cursor after inserted spaces
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + insert.length;
      });
    }
  };

  const filteredNodesForSearch = () => {
    if (!searchQuery.trim()) return nodes;
    const q = searchQuery.toLowerCase();
    return nodes.filter((n) => n.kind === "file" && (n.name.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)));
  };

  const renderTree = (parentId: string | null, depth = 0): React.ReactNode => {
    const children = getChildren(parentId);
    return children.map((node) => {
      const isFolder = node.kind === "folder";
      const isExpanded = expanded.has(node.id);
      const isSelected = selectedId === node.id;
      const isActive = activeId === node.id;
      const isOpen = openIds.includes(node.id);

      if (isFolder) {
        return (
          <div key={node.id}>
            <div
              className={`folder ${isSelected ? "selected" : ""}`}
              style={{ paddingLeft: 6 + depth * 12 }}
              onClick={() => toggleFolder(node.id)}
              onContextMenu={(e) => { e.preventDefault(); setSelectedId(node.id); }}
              title={node.name}
            >
              <span className="chevron"><i className={`fas ${isExpanded ? "fa-chevron-down" : "fa-chevron-right"}`} /></span>
              <i className="fas fa-folder" />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</span>
              {isSelected && <span style={{ fontSize: 9, color: "#6b6b6b" }}>{getChildren(node.id).length}</span>}
            </div>
            {isExpanded && <div>{renderTree(node.id, depth + 1)}</div>}
          </div>
        );
      }

      return (
        <div
          key={node.id}
          className={`file ${isActive ? "active" : ""} ${isOpen ? "open" : ""} ${isSelected ? "selected" : ""}`}
          style={{ paddingLeft: 22 + depth * 12 }}
          onClick={() => openFile(node.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            setSelectedId(node.id);
            const del = window.confirm(`Delete "${node.name}"?`);
            if (del) {
              setNodes((prev) => prev.filter((n) => n.id !== node.id));
              setOpenIds((prev) => prev.filter((x) => x !== node.id));
              if (activeId === node.id) setActiveId(openIds.find((x) => x !== node.id) || null);
            }
          }}
          title={`${node.name} — right-click to delete`}
        >
          <i className={fileIconClass(node.name)} />
          <span className={isOpen ? "lang" : ""} style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</span>
          {isOpen && <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeNode?.id === node.id && activeNode.content !== initialNodes.find(n=>n.id===node.id)?.content ? "#f5c542" : "transparent", marginLeft: 4 }} title="unsaved" />}
        </div>
      );
    });
  };

  const langLabel = (() => {
    if (!activeNode) return "Plain Text";
    if (activeNode.name.endsWith(".css")) return "CSS";
    if (activeNode.name.endsWith(".html")) return "HTML";
    if (activeNode.name.endsWith(".json")) return "JSON";
    if (activeNode.name.endsWith(".md")) return "Markdown";
    return "JavaScript";
  })();

  const lines = activeNode ? activeNode.content.split("\n").length : 0;

  return (
    <div className="vscode-xp">
      <div className="vscode-titlebar">
        <div className="vscode-dots">
          <span className="red" />
          <span className="yellow" />
          <span className="green" />
        </div>
        <div className="vscode-title">
          <i className="fas fa-code" />
          <span>Visual Studio Code</span>
          <span className="repo"><i className="far fa-folder-open" /> my-project {activeNode ? `— ${activeNode.name}` : ""}</span>
        </div>
        <div className="vscode-title-right">
          <i className="fas fa-ellipsis-v" />
        </div>
      </div>

      <div className="main-layout">
        <div className="activity-bar">
          <div className={`icon ${activity === "explorer" ? "active" : ""}`} onClick={() => setActivity("explorer")} title="Explorer">
            <i className="fas fa-folder" />
          </div>
          <div className={`icon ${activity === "search" ? "active" : ""}`} onClick={() => setActivity("search")} title="Search">
            <i className="fas fa-search" />
          </div>
          <div className={`icon ${activity === "git" ? "active" : ""}`} onClick={() => setActivity("git")} title="Source Control">
            <i className="fas fa-code-branch" />
          </div>
          <div className="icon" title="Debug"><i className="fas fa-bug" /></div>
          <div className="icon" title="Extensions"><i className="fas fa-cube" /></div>
          <div className="bottom">
            <div className="icon" title="Settings"><i className="fas fa-cog" /></div>
            <div className="icon" title="Profile"><i className="fas fa-user-circle" /></div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-header">
            <span>{activity === "explorer" ? "Explorer" : activity === "search" ? "Search" : "Source Control"}</span>
            {activity === "explorer" && (
              <div className="vscode-actions">
                <button className="vscode-icon-btn" title="New File..." onClick={handleNewFile}><i className="fas fa-file-circle-plus" /></button>
                <button className="vscode-icon-btn" title="New Folder..." onClick={handleNewFolder}><i className="fas fa-folder-plus" /></button>
                <button className="vscode-icon-btn" title="Refresh Explorer" onClick={() => setNodes((p) => [...p])}><i className="fas fa-sync" style={{ fontSize: 11 }} /></button>
                <i className="fas fa-ellipsis-v" style={{ color: "#8b8b8b", fontSize: 12, marginLeft: 4 }} />
              </div>
            )}
          </div>

          {activity === "explorer" ? (
            <>
              <div className="explorer-tree">
                <div style={{ padding: "4px 8px 6px", fontSize: 10, color: "#8b8b8b", letterSpacing: 0.3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, color: "#b5b5b5", textTransform: "uppercase" }}>My-Project</span>
                  <span style={{ fontSize: 10, color: "#6b6b6b" }}>{nodes.filter(n=>n.kind==="file").length} files</span>
                </div>
                {renderTree(null, 0)}
              </div>
              <div style={{ padding: "6px 8px", borderTop: "1px solid #1e1e1e", display: "flex", gap: 6 }}>
                <button className="xp-vscode-btn" onClick={handleNewFile}><i className="fas fa-plus" /> New File</button>
                <button className="xp-vscode-btn" onClick={handleNewFolder}><i className="fas fa-folder" /> New Folder</button>
              </div>
            </>
          ) : activity === "search" ? (
            <div style={{ padding: 10, fontSize: 12, color: "#8b8b8b", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ background: "#3c3c3c", padding: "6px 8px", borderRadius: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <i className="fas fa-search" style={{ fontSize: 11 }} />
                <input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#ddd", fontSize: 12 }}
                />
                {searchQuery && <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={() => setSearchQuery("")} />}
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {searchQuery.trim() ? (
                  filteredNodesForSearch().length ? (
                    filteredNodesForSearch().map((n) => (
                      <div key={n.id} className="file" style={{ paddingLeft: 6, cursor: "pointer" }} onClick={() => { openFile(n.id); setActivity("explorer"); }}>
                        <i className={fileIconClass(n.name)} />
                        <span style={{ fontSize: 12 }}>{n.name}</span>
                        <span style={{ marginLeft: "auto", fontSize: 10, color: "#6b6b6b" }}>{n.parentId || "root"}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 11, color: "#6b6b6b", padding: 8, textAlign: "center" }}>No results for "{searchQuery}"</div>
                  )
                ) : (
                  <div style={{ fontSize: 11, color: "#6b6b6b", padding: 4 }}>Type to search file names &amp; contents</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: 12, fontSize: 12, color: "#8b8b8b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: "#ccc" }}><i className="fas fa-code-branch" /> main • {nodes.filter(n=>n.kind==="file").length} files</div>
              <div style={{ background: "#252526", border: "1px dashed #3c3c3c", padding: 12, borderRadius: 4, textAlign: "center" }}>No changes — start editing files</div>
              <div style={{ marginTop: 12, fontSize: 11, color: "#6b6b6b" }}>Create a folder or file from Explorer to get started</div>
            </div>
          )}

          <div className="sidebar-footer">
            <span><i className="far fa-circle" /> 0</span>
            <span><i className="fas fa-code" /> main</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#8b8b8b" }}>{openIds.length} open</span>
          </div>
        </div>

        <div className="editor-area">
          <div className="tabs-bar">
            {openIds.length ? (
              openIds.map((id) => {
                const node = nodes.find((n) => n.id === id);
                if (!node) return null;
                const isAct = activeId === id;
                return (
                  <div key={id} className={`tab ${isAct ? "active" : ""}`} onClick={() => setActiveId(id)} title={node.name}>
                    <i className={fileIconClass(node.name)} />
                    <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{node.name}</span>
                    <span className="close" onClick={(e) => closeFile(id, e)} title="Close">×</span>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "0 12px", fontSize: 12, color: "#8b8b8b" }}>No open files</div>
            )}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, padding: "0 6px" }}>
              <button className="vscode-icon-btn" title="New File" onClick={handleNewFile} style={{ color: "#8b8b8b" }}><i className="fas fa-plus" /></button>
            </div>
          </div>

          <div className="code-editor-wrap">
            {activeNode ? (
              <>
                <div className="code-gutter">
                  {activeNode.content.split("\n").map((_, i) => (
                    <div key={i} className="gutter-line">{i + 1}</div>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  className="code-textarea"
                  value={activeNode.content}
                  onChange={(e) => updateFileContent(activeNode.id, e.target.value)}
                  onKeyDown={handleKeyDownInEditor}
                  spellCheck={false}
                  placeholder="// start typing..."
                  wrap="off"
                />
              </>
            ) : (
              <div className="empty-editor">
                <div style={{ fontSize: 42, color: "#3c3c3c", marginBottom: 12 }}><i className="fas fa-file-code" /></div>
                <div style={{ fontSize: 13, color: "#8b8b8b", marginBottom: 12 }}>No file open</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="xp-vscode-btn primary" onClick={handleNewFile}><i className="fas fa-file-circle-plus" /> New File</button>
                  <button className="xp-vscode-btn" onClick={handleNewFolder}><i className="fas fa-folder-plus" /> New Folder</button>
                </div>
                <div style={{ marginTop: 14, fontSize: 11, color: "#6b6b6b" }}>Explorer → New File / New Folder • Tabs × to close • Right-click file to delete</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="left">
          <span><i className="fas fa-code-branch" /> main</span>
          <span><i className="fas fa-circle" style={{ color: "#4ecb71", fontSize: 8 }} /> {nodes.filter(n=>n.kind==="file").length} files</span>
          <span style={{ display: "none" }}><i className="fas fa-check-circle" /> Prettier</span>
        </div>
        <div className="right">
          <span>Ln {activeNode ? activeNode.content.substring(0, textareaRef.current?.selectionStart || 0).split("\n").length : 1}, Col {(textareaRef.current?.selectionStart || 0) - (activeNode?.content.lastIndexOf("\n", (textareaRef.current?.selectionStart || 1) - 1) || 0)}</span>
          <span>UTF-8</span>
          <span>{langLabel}</span>
          <span>Spaces: 2</span>
          {activeNode && <span className="badge"><i className="fas fa-save" /> {lines} lines</span>}
        </div>
      </div>
    </div>
  );
};

export default VSCode;
