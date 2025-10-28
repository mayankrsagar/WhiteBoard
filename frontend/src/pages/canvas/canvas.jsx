// src/pages/canvas/Canvas.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";

import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

const Canvas = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  /* ---------- canvas setup ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = 5;
    ctx.current = context;
  }, [canvasRef, color, ctx]);

  useEffect(() => {
    if (ctx.current) ctx.current.strokeStyle = color;
  }, [color]);

  /* ---------- mouse handlers ---------- */
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prev) => [
        ...prev,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
        },
      ]);
    } else {
      setElements((prev) => [
        ...prev,
        { offsetX, offsetY, stroke: color, element: tool },
      ]);
    }
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    setElements((prev) =>
      prev.map((el, i) => {
        if (i !== prev.length - 1) return el;

        if (tool === "rect") {
          return {
            ...el,
            width: offsetX - el.offsetX,
            height: offsetY - el.offsetY,
          };
        }
        if (tool === "line") {
          return { ...el, width: offsetX, height: offsetY };
        }
        if (tool === "pencil") {
          return { ...el, path: [...el.path, [offsetX, offsetY]] };
        }
        return el;
      })
    );
  };

  const handleMouseUp = () => setIsDrawing(false);

  /* ---------- redraw ---------- */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const roughCanvas = rough.canvas(canvas);
    const context = ctx.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((el) => {
      if (el.element === "rect") {
        roughCanvas.draw(
          generator.rectangle(el.offsetX, el.offsetY, el.width, el.height, {
            stroke: el.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (el.element === "line") {
        roughCanvas.draw(
          generator.line(el.offsetX, el.offsetY, el.width, el.height, {
            stroke: el.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (el.element === "pencil") {
        roughCanvas.linearPath(el.path, {
          stroke: el.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });

    socket.emit("drawing", canvas.toDataURL());
  }, [elements, canvasRef, ctx, socket]);

  /* ---------- render ---------- */
  return (
    <div
      className="w-full h-[32rem] md:h-[40rem] lg:h-[48rem] overflow-hidden border border-gray-300 rounded-lg shadow-sm mx-auto mt-4"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default Canvas;
