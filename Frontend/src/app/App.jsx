import React, { useRef, useMemo, useState, useEffect } from "react";
import "./index.css";

import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const App = () => {
  const editorRef = useRef(null);

  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("vs-dark");

  // ✅ Load username
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("username");
    if (name) setUsername(name);
  }, []);

  // ✅ Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Yjs setup
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);
  const yOutput = useMemo(() => ydoc.getText("output"), [ydoc]);

  const handleMonacoMount = (editor) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  };

  useEffect(() => {
    if (!username || !isEditorReady || !editorRef.current) return;

    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      "monaco",
      ydoc
    );

    window.provider = provider;

    provider.awareness.setLocalStateField("user", { username });

    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());

      const activeUsers = states
        .map((state) => state.user)
        .filter((user) => user && user.username);

      setUsers(activeUsers);
    };

    updateUsers();
    provider.awareness.on("change", updateUsers);

    const model = editorRef.current.getModel();
    if (!model) return;

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editorRef.current]),
      provider.awareness
    );

    return () => {
      binding.destroy();
      provider.disconnect();
    };
  }, [username, isEditorReady]);

  // ✅ Sync output
  useEffect(() => {
    const updateOutput = () => {
      setOutput(yOutput.toString());
    };

    yOutput.observe(updateOutput);
    return () => yOutput.unobserve(updateOutput);
  }, [yOutput]);

  // ✅ Run code
  const runCode = () => {
    const code = editorRef.current.getValue();

    let logs = [];

    const fakeConsole = {
      log: (...args) => logs.push(args.join(" ")),
    };

    try {
      const func = new Function("console", code);
      func(fakeConsole);

      yOutput.delete(0, yOutput.length);
      yOutput.insert(0, logs.join("\n"));
    } catch (err) {
      yOutput.delete(0, yOutput.length);
      yOutput.insert(0, "❌ Error: " + err.message);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    if (window.provider) {
      window.provider.awareness.setLocalStateField("user", null);
    }

    setUsername("");
    setOutput("");
    window.history.pushState({}, "", "/");
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const name = e.target.username.value.trim();
    if (!name) return;

    setUsername(name);
    window.history.pushState({}, "", "?username=" + name);
  };

  // JOIN SCREEN
  if (!username) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-gray-900">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Enter your name"
            className="p-2 rounded bg-white"
          />
          <button className="bg-yellow-500 p-2 rounded font-bold">
            Join
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex bg-gray-900 flex-col">

      {/* 🔥 TOP BAR */}
      <div className="flex justify-between items-center p-2 bg-gray-800">

        <h1 className="text-white font-bold">Code Editor</h1>

        <div className="flex gap-2">

          {/* THEME */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded"
          >
            <option value="vs-dark">Dark</option>
            <option value="vs-light">Light</option>
            <option value="hc-black">High Contrast</option>
          </select>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 rounded"
          >
            Logout
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 gap-2 p-2">

        {/* USERS */}
        <aside className="w-1/4 bg-white rounded p-4">
          <h2 className="font-bold mb-2">Users</h2>
          {users.map((user, i) => (
            <div key={i}>{user.username}</div>
          ))}
        </aside>

        {/* EDITOR */}
        <section className="w-3/4 flex flex-col gap-2">

          <div className="h-[60vh]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue="// write code here\nconsole.log('Hello Sameer')"
              theme={theme}
              onMount={handleMonacoMount}
            />
          </div>

          <button
            onClick={runCode}
            className="bg-green-500 text-white px-4 py-2 rounded font-bold"
          >
            ▶ Run Code
          </button>

          <div className="bg-black text-green-400 p-4 h-[150px] overflow-auto rounded">
            <h3 className="text-white">Output:</h3>
            <pre>{output}</pre>
          </div>

        </section>
      </div>
    </main>
  );
};

export default App;