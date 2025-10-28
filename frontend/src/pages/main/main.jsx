// import "./style.css";

// import React, { useEffect, useState } from "react";

// import { ToastContainer } from "react-toastify";
// import io from "socket.io-client";

// import Room from "../canvas/Room";
// import ClientRoom from "../Room/ClientRoom";
// import JoinCreateRoom from "../Room/JoinCreateRoom";
// import Sidebar from "../sidebar/Sidebar";

// const server = "http://localhost:5000";
// const connectionOptions = {
//   "force new connection": true,
//   reconnectionAttempts: "Infinity",
//   timeout: 10000,
//   transports: ["websocket"],
// };

// const socket = io(server, connectionOptions);

// const Main = () => {
//   const [userNo, setUserNo] = useState(0);
//   const [roomJoined, setRoomJoined] = useState(false);
//   const [user, setUser] = useState({});
//   const [users, setUsers] = useState([]);

//   const uuid = () => {
//     var S4 = () => {
//       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//     };
//     return (
//       S4() +
//       S4() +
//       "-" +
//       S4() +
//       "-" +
//       S4() +
//       "-" +
//       S4() +
//       "-" +
//       S4() +
//       S4() +
//       S4()
//     );
//   };

//   useEffect(() => {
//     if (roomJoined) {
//       socket.emit("user-joined", user);
//     }
//   }, [roomJoined, user]);

//   return (
//     <div className="home">
//       <ToastContainer />
//       {roomJoined ? (
//         <>
//           <Sidebar users={users} user={user} socket={socket} />
//           {user.presenter ? (
//             <Room
//               userNo={userNo}
//               user={user}
//               socket={socket}
//               setUsers={setUsers}
//               setUserNo={setUserNo}
//             />
//           ) : (
//             <ClientRoom
//               userNo={userNo}
//               user={user}
//               socket={socket}
//               setUsers={setUsers}
//               setUserNo={setUserNo}
//             />
//           )}
//         </>
//       ) : (
//         <JoinCreateRoom
//           uuid={uuid}
//           setRoomJoined={setRoomJoined}
//           setUser={setUser}
//         />
//       )}
//     </div>
//   );
// };
// export default Main;

import "./style.css";

// src/pages/main/Main.jsx
import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

import Room from "../canvas/Room";
import ClientRoom from "../Room/ClientRoom";
import JoinCreateRoom from "../Room/JoinCreateRoom";
import Sidebar from "../sidebar/Sidebar";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnectionAttempts: Infinity,
  timeout: 10_000,
});

/* ----------  helper  ---------- */
const uuid = () =>
  "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

const Main = () => {
  const [userNo, setUserNo] = useState(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (roomJoined) socket.emit("user-joined", user);
  }, [roomJoined, user]);

  return (
    <div className="main-container">
      {/* <ToastContainer /> */}

      {roomJoined ? (
        <>
          <Sidebar users={users} user={user} socket={socket} />
          {user.presenter ? (
            <Room {...{ userNo, user, socket, setUsers, setUserNo }} />
          ) : (
            <ClientRoom {...{ userNo, user, socket, setUsers, setUserNo }} />
          )}
        </>
      ) : (
        <JoinCreateRoom {...{ uuid, setRoomJoined, setUser }} />
      )}
    </div>
  );
};

export default Main;
