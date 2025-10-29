import React, { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import api from "../../../utils/axios";
import Canvas from "./Canvas";

const Room = ({ userNo, socket, setUsers, setUserNo, user }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");

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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = ctx.current;
    if (!canvas || !context) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
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
      toast.success("Canvas saved!");
      alert("Canvas saved successfully!");
    } catch {
      toast.error("Save failed");
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-4 mb-6 text-center">
          <h1 className="text-xl md:text-2xl font-bold">
            Users online: <span className="text-indigo-600">{userNo}</span>
          </h1>
        </div>

        {/* main area: sidebar (controls) + canvas */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar: fixed width on md+, full width on small screens */}
            <aside className="w-full md:w-80 flex-shrink-0">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Tools</h2>
                  <span className="text-sm text-gray-500">
                    {user?.username || user?.userName || "You"}
                  </span>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4 flex flex-col gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Colour
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer"
                  />
                </div>

                <div className="bg-gray-50 border rounded-lg p-4 flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Tools
                  </label>
                  <div className="flex flex-col gap-2">
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
                </div>

                <div className="bg-gray-50 border rounded-lg p-4 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Actions
                  </label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={undo}
                      disabled={!elements.length}
                      className={`${toolBtn("")} disabled:opacity-50`}
                    >
                      Undo
                    </button>
                    <button
                      onClick={redo}
                      disabled={!history.length}
                      className={`${toolBtn("")} disabled:opacity-50`}
                    >
                      Redo
                    </button>
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
                      className={actionBtn(
                        "bg-green-600",
                        "hover:bg-green-700"
                      )}
                    >
                      Save to DB
                    </button>
                  </div>
                </div>

                {/* optional: show connected users or tips */}
                <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600">
                  Connected users:{" "}
                  <span className="font-medium text-indigo-600">{userNo}</span>
                </div>
              </div>
            </aside>

            {/* Canvas area - grows to fill remaining space */}
            <main className="flex-1 min-h-[60vh]">
              <div className="h-full w-full rounded-lg border border-dashed border-gray-200 overflow-hidden">
                {/* <Canvas
                  canvasRef={canvasRef}
                  ctx={ctx}
                  color={color}
                  setElements={setElements}
                  elements={elements}
                  tool={tool}
                  socket={socket}
                  roomId={user?.room}
                /> */}
                <Canvas
                  canvasRef={canvasRef}
                  ctx={ctx}
                  color={color}
                  setElements={setElements}
                  elements={elements}
                  tool={tool}
                  socket={socket}
                  roomId={user?.room ?? user?.roomId ?? user?.room_id}
                />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
