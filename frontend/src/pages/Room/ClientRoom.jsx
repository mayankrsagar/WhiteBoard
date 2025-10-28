// src/pages/Room/ClientRoom.jsx
import React, { useEffect, useRef } from "react";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const handleMessage = (data) => alert(data.message);
    const handleUsers = (data) => {
      setUsers(data);
      setUserNo(data.length);
    };
    const handleCanvasImage = (data) => {
      if (imgRef.current) {
        imgRef.current.src = data;
      }
    };

    socket.on("message", handleMessage);
    socket.on("users", handleUsers);
    socket.on("canvasImage", handleCanvasImage);

    return () => {
      socket.off("message", handleMessage);
      socket.off("users", handleUsers);
      socket.off("canvasImage", handleCanvasImage);
    };
  }, [socket, setUsers, setUserNo]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      {/* header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Users online: {userNo}
        </h1>
      </div>

      {/* canvas viewer */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl rounded-lg overflow-hidden border border-gray-700 shadow-lg bg-white">
          <img
            ref={imgRef}
            src=""
            alt="Live canvas stream"
            className="w-full h-auto max-h-[32rem] md:max-h-[40rem] lg:max-h-[48rem] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
