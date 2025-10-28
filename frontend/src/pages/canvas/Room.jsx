// src/pages/Room/Room.jsx
import React, { useEffect, useRef, useState } from "react";

import axios from "axios";

import Canvas from "../canvas/Canvas";

const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    socket.on("message", (data) => alert(data.message));
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
    return () => {
      socket.off("message");
      socket.off("users");
    };
  }, [socket, setUsers, setUserNo]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    if (!elements.length) return;
    const last = elements[elements.length - 1];
    setHistory((h) => [...h, last]);
    setElements((els) => els.slice(0, -1));
  };

  const redo = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setElements((els) => [...els, last]);
    setHistory((h) => h.slice(0, -1));
  };

  const saveImageToLocal = () => {
    const link = document.createElement("a");
    link.download = "canvas_image.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const saveImageToDatabase = async () => {
    try {
      const dataURL = canvasRef.current.toDataURL("image/png"); // base64
      const blob = await (await fetch(dataURL)).blob(); // convert to blob
      const formData = new FormData();
      formData.append("file", blob, "canvas.png");
      formData.append("userId", userId);

      const { data } = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload successful:", data);
      alert("Image saved to database!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Users online: {userNo}
        </h1>
      </div>

      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        {/* colour */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Colour:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>

        {/* tools */}
        <div className="flex items-center gap-3">
          {["pencil", "line", "rect"].map((t) => (
            <label key={t} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="tool"
                value={t}
                checked={tool === t}
                onChange={() => setTool(t)}
                className="sr-only"
              />
              <span
                className={`px-3 py-1 rounded-full text-sm capitalize border ${
                  tool === t
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {t}
              </span>
            </label>
          ))}
        </div>

        {/* undo / redo */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!elements.length}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!history.length}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            Redo
          </button>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Clear
          </button>
          <button
            onClick={saveImageToLocal}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Download
          </button>
          <button
            onClick={saveImageToDatabase}
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Save to DB
          </button>
        </div>
      </div>

      {/* canvas */}
      <Canvas
        canvasRef={canvasRef}
        ctx={ctx}
        color={color}
        setElements={setElements}
        elements={elements}
        tool={tool}
        socket={socket}
      />
    </div>
  );
};

export default Room;
