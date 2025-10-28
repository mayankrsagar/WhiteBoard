// src/pages/Room/Room.jsx
import React, { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import api from "../../../utils/axios";
import Canvas from "../canvas/Canvas";

const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");

  /* ----------  socket listeners  ---------- */
  useEffect(() => {
    socket.on("message", (data) => toast.info(data.message));
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
    return () => {
      socket.off("message");
      socket.off("users");
    };
  }, [socket, setUsers, setUserNo]);

  /* ----------  canvas actions  ---------- */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = ctx.current;
    if (!canvas || !context) return;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
    setHistory([]);
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

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const saveToDB = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
      const form = new FormData();
      form.append("file", blob, "canvas.png");

      await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Canvas saved !");
    } catch {
      toast.error("Save failed");
    }
  };

  /* ----------  tailwind styles  ---------- */
  const toolBtn = (t) =>
    `px-4 py-2 rounded-lg text-sm capitalize transition border ${
      tool === t
        ? "bg-indigo-600 text-white border-indigo-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    }`;

  const actionBtn = (bg, hover) =>
    `px-4 py-2 rounded-lg text-white text-sm ${bg} ${hover} transition`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-center">
            Users online: <span className="text-indigo-600">{userNo}</span>
          </h1>
        </div>

        {/* toolbar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* colour */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Colour</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
              />
            </div>

            {/* tools */}
            <div className="flex items-center gap-2">
              {["pencil", "line", "rect"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  className={toolBtn(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* undo / redo */}
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!elements.length}
                className={toolBtn("") + " disabled:opacity-50"}
              >
                Undo
              </button>
              <button
                onClick={redo}
                disabled={!history.length}
                className={toolBtn("") + " disabled:opacity-50"}
              >
                Redo
              </button>
            </div>

            {/* actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className={actionBtn("bg-red-600", "hover:bg-red-700")}
              >
                Clear
              </button>
              <button
                onClick={downloadImage}
                className={actionBtn("bg-blue-600", "hover:bg-blue-700")}
              >
                Download
              </button>
              <button
                onClick={saveToDB}
                className={actionBtn("bg-green-600", "hover:bg-green-700")}
              >
                Save to DB
              </button>
            </div>
          </div>
        </div>

        {/* canvas */}
        <div className="bg-white rounded-xl shadow p-4">
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
      </div>
    </div>
  );
};

export default Room;
