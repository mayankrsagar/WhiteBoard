import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Canvas from "./canvas";

const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");
  const userId = localStorage.getItem('userId');


  useEffect(() => {
    socket.on("message", (data) => {
      alert(data.message);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, [setUserNo, setUsers, socket]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((ele, index) => index !== elements.length - 1)
    );
  };
  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((ele, index) => index !== history.length - 1)
    );
  };
  const saveImageToLocal = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");

    link.download = "canvas_image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const saveImageToDatabase = async () => {
    const canvas = canvasRef.current;
    
    // Convert canvas data to a PNG image data URL
    const dataURL = canvas.toDataURL('image/png');
  
    try {
      // Create an image element
      const img = new Image();
  
      // Set the image source to the canvas data URL
      img.src = dataURL;
  
      // When the image loads, draw it onto a new canvas element
      img.onload = () => {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = img.width;
        newCanvas.height = img.height;
        
        const ctx = newCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        // Convert the new canvas back to a Blob
        newCanvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append('file', blob, 'filename.png');
          formData.append('userId', userId); // Replace userId with the actual user ID
  
          // Upload the Blob with axios
          const uploadResponse = await axios.post('http://localhost:9000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          console.log('Upload successful:', uploadResponse.data);
          // Handle success
        }, 'image/png'); // Set the image format (PNG in this case)
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    }
  };
  

  return (
    <div className="container-fluid">
      <div className="row">
        <h1 className="display-5 pt-4 pb-3 text-center">
          Users online:{userNo}
        </h1>
      </div>
      <div className="row justify-content-center align-items-center text-center py-2">
        <div className="col-md-2">
          <div className="color-picker d-flex align-items-center justify-content-center">
            Color Picker : &nbsp;
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="pencil"
              value="pencil"
              checked={tool === "pencil"}
              onClick={(e) => setTool(e.target.value)}
              readOnly={true}
            />
            <label className="form-check-label" htmlFor="pencil">
              Pencil
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="line"
              value="line"
              checked={tool === "line"}
              onClick={(e) => setTool(e.target.value)}
              readOnly={true}
            />
            <label className="form-check-label" htmlFor="line">
              Line
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="rect"
              value="rect"
              checked={tool === "rect"}
              onClick={(e) => setTool(e.target.value)}
              readOnly={true}
            />
            <label className="form-check-label" htmlFor="rect">
              Rectangle
            </label>
          </div>
        </div>

        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={elements.length === 0}
            onClick={() => undo()}
          >
            Undo
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-outline-primary ml-1"
            disabled={history.length < 1}
            onClick={() => redo()}
          >
            Redo
          </button>        &nbsp;&nbsp;

        </div>
        <div className="col-md-10">
          <div className="row">
            <div className="col color-picker d-flex align-items-center justify-content-center">
              <input
                type="button"
                className="btn btn-danger"
                value="clear canvas"
                onClick={clearCanvas}
              />
            </div>
            <div className="col d-flex align-items-center justify-content-center">
              <button className="btn btn-primary" onClick={saveImageToLocal}>Download Image</button>
            </div>
            <div className="col d-flex align-items-center justify-content-center">
              <button className="btn btn-primary" onClick={saveImageToDatabase}>
                Save Image to Database
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
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
  );
};

export default Room;
