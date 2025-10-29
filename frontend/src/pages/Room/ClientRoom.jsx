// import React, { useEffect, useRef } from "react";

// const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
//   const imgRef = useRef(null);

//   useEffect(() => {
//     // Handle incoming messages
//     const handleMessage = (data) => alert(data.message);

//     // Update user list
//     const handleUsers = (data) => {
//       setUsers(data);
//       setUserNo(data.length);
//     };

//     // Update canvas image
//     const handleCanvasImage = (data) => {
//       if (imgRef.current) {
//         imgRef.current.src = data;
//       }
//     };

//     // Register socket listeners
//     socket.on("message", handleMessage);
//     socket.on("users", handleUsers);
//     socket.on("canvasImage", handleCanvasImage); // ✅ Correct event name

//     // Cleanup on unmount
//     return () => {
//       socket.off("message", handleMessage);
//       socket.off("users", handleUsers);
//       socket.off("canvasImage", handleCanvasImage);
//     };
//   }, [socket, setUsers, setUserNo]);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
//       {/* Header */}
//       <div className="text-center mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold">
//           Users online: {userNo}
//         </h1>
//       </div>

//       {/* Canvas Viewer */}
//       <div className="flex justify-center">
//         <div className="w-full max-w-5xl rounded-lg overflow-hidden border border-gray-700 shadow-lg bg-white">
//           <img
//             ref={imgRef}
//             src=""
//             alt="Live canvas stream"
//             className="w-full h-auto max-h-[32rem] md:max-h-[40rem] lg:max-h-[48rem] object-contain"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientRoom;

import React, { useEffect, useRef, useState } from "react";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef(null);
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    const handleMessage = (data) => alert(data.message);

    const handleUsers = (data) => {
      setUsers(data);
      setUserNo(data.length);
    };

    /* ---- LIVE CANVAS STREAM ---- */
    const handleFrame = ({ imageURL }) => {
      if (imgRef.current) imgRef.current.src = imageURL;
      setFrames((f) => f + 1);
      console.log(
        `[ClientRoom] new frame received – ${imageURL.slice(0, 50)}…`
      );
    };

    socket.on("message", handleMessage);
    socket.on("users", handleUsers);
    socket.on("drawing", handleFrame);

    return () => {
      socket.off("message", handleMessage);
      socket.off("users", handleUsers);
      socket.off("drawing", handleFrame);
    };
  }, [socket, setUsers, setUserNo]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Users online: {userNo}
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Frames received:{" "}
          <span className="font-bold text-indigo-400">{frames}</span>
        </p>
      </div>

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
