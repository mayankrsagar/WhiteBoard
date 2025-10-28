// src/pages/Room/ClientRoom.jsx
import React, { useEffect, useRef } from "react";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => alert(data.message));
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
    socket.on("canvasImage", (data) => {
      if (imgRef.current) imgRef.current.src = data;
    });

    return () => {
      socket.off("message");
      socket.off("users");
      socket.off("canvasImage");
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
        <div className="w-full max-w-5xl rounded-lg overflow-hidden border border-gray-700 shadow-lg">
          <img
            ref={imgRef}
            src=""
            alt="Canvas drawing"
            className="w-full h-auto max-h-[32rem] md:max-h-[40rem] lg:max-h-[48rem] object-contain bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
