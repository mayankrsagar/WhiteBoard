import React, { useState } from "react";

const JoinCreateRoom = ({ uuid, setUser, setRoomJoined }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert("Please enter your name!");
    setUser({
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    });
    setRoomJoined(true);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinName) return alert("Please enter your name!");
    setUser({
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    });
    setRoomJoined(true);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center my-5">LiveSharing Whiteboard</h1>
        </div>
      </div>

      <div className="row mx-5 mt-5">
        {/* ---------- CREATE ROOM ---------- */}
        <div className="col-md-5 p-5 border mx-auto">
          <h1 className="text-center text-primary mb-5">Create Room</h1>
          <form onSubmit={handleCreateSubmit}>
            <div className="form-group my-2">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group my-2 border align-items-center">
              <input
                type="text"
                className="form-control border-0"
                value={roomId}
                readOnly
                style={{ boxShadow: "none" }}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary border-0 btn-sm"
                  type="button"
                  onClick={() => setRoomId(uuid())}
                >
                  Generate
                </button>
                &nbsp;&nbsp;
                <button
                  className="btn btn-outline-dark border-0 btn-sm"
                  type="button"
                  onClick={copyRoomId}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="form-group mt-5">
              <button type="submit" className="form-control btn btn-dark">
                Create Room
              </button>
            </div>
          </form>
        </div>

        {/* ---------- JOIN ROOM ---------- */}
        <div className="col-md-5 p-5 border mx-auto">
          <h1 className="text-center text-primary mb-5">Join Room</h1>
          <form onSubmit={handleJoinSubmit}>
            <div className="form-group my-2">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
              />
            </div>
            <div className="form-group my-2">
              <input
                type="text"
                className="form-control"
                placeholder="Room Id"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                style={{ boxShadow: "none" }}
              />
            </div>
            <div className="form-group mt-5">
              <button type="submit" className="form-control btn btn-dark">
                Join Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
