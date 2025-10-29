// import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// import rough from "roughjs/bundled/rough.esm";

// const generator = rough.generator();

// const Canvas = ({
//   canvasRef,
//   ctx,
//   color,
//   setElements,
//   elements,
//   tool,
//   socket,
//   roomId,
// }) => {
//   const [isDrawing, setIsDrawing] = useState(false);
//   const lastEmit = useRef(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const dpr = window.devicePixelRatio || 1;
//     const rect = canvas.getBoundingClientRect();

//     canvas.width = rect.width * dpr;
//     canvas.height = rect.height * dpr;
//     canvas.style.width = `${rect.width}px`;
//     canvas.style.height = `${rect.height}px`;

//     const context = canvas.getContext("2d");
//     context.scale(dpr, dpr);
//     context.lineCap = "round";
//     context.lineJoin = "round";
//     context.strokeStyle = color;
//     context.lineWidth = 5;
//     ctx.current = context;
//   }, [canvasRef, color, ctx]);

//   useEffect(() => {
//     if (ctx.current) ctx.current.strokeStyle = color;
//   }, [color]);

//   const handleMouseDown = (e) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     const base = { offsetX, offsetY, stroke: color, element: tool };

//     setElements((prev) =>
//       tool === "pencil"
//         ? [...prev, { ...base, path: [[offsetX, offsetY]] }]
//         : [...prev, base]
//     );
//     setIsDrawing(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing) return;
//     const { offsetX, offsetY } = e.nativeEvent;

//     setElements((prev) =>
//       prev.map((el, i) =>
//         i !== prev.length - 1
//           ? el
//           : tool === "rect"
//           ? { ...el, width: offsetX - el.offsetX, height: offsetY - el.offsetY }
//           : tool === "line"
//           ? { ...el, width: offsetX, height: offsetY }
//           : tool === "pencil"
//           ? { ...el, path: [...el.path, [offsetX, offsetY]] }
//           : el
//       )
//     );
//   };

//   const handleMouseUp = () => setIsDrawing(false);

//   useLayoutEffect(() => {
//     const canvas = canvasRef.current;
//     const context = ctx.current;
//     if (!canvas || !context) return;

//     const roughCanvas = rough.canvas(canvas);
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     elements.forEach((el) => {
//       if (el.element === "rect") {
//         roughCanvas.draw(
//           generator.rectangle(el.offsetX, el.offsetY, el.width, el.height, {
//             stroke: el.stroke,
//             roughness: 0,
//             strokeWidth: 5,
//           })
//         );
//       } else if (el.element === "line") {
//         roughCanvas.draw(
//           generator.line(el.offsetX, el.offsetY, el.width, el.height, {
//             stroke: el.stroke,
//             roughness: 0,
//             strokeWidth: 5,
//           })
//         );
//       } else if (el.element === "pencil") {
//         roughCanvas.linearPath(el.path, {
//           stroke: el.stroke,
//           roughness: 0,
//           strokeWidth: 5,
//         });
//       }
//     });

//     const now = Date.now();
//     if (now - lastEmit.current > 200) {
//       socket.emit("drawing", {
//         roomId,
//         imageData: canvas.toDataURL(),
//       });
//       lastEmit.current = now;
//     }
//   }, [elements, canvasRef, ctx, socket, roomId]);

//   return (
//     <div
//       className="w-full h-[32rem] md:h-[40rem] lg:h-[48rem] overflow-hidden border border-gray-300 rounded-lg shadow-sm mx-auto mt-4"
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       <canvas ref={canvasRef} className="w-full h-full" />
//     </div>
//   );
// };

// export default Canvas;

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  roomId,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lastEmit = useRef(0);
  const containerRef = useRef(null); // NEW: wrapper we actually size to

  /* ---------- 1.  make canvas match CSS pixels & DPR ---------- */
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = container.getBoundingClientRect();

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    context.setTransform(1, 0, 0, 1, 0, 0); // reset
    context.scale(dpr, dpr);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = 5;
    ctx.current = context;
  };

  useEffect(() => {
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [canvasRef, ctx, color]);

  useEffect(() => {
    if (ctx.current) ctx.current.strokeStyle = color;
  }, [color]);

  /* ---------- 2.  coordinate helper ---------- */
  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
  };

  /* ---------- 3.  start stroke ---------- */
  const startStroke = (e) => {
    // e.preventDefault();
    const { x, y } = getPos(e);
    const base = { offsetX: x, offsetY: y, stroke: color, element: tool };

    setElements((prev) =>
      tool === "pencil"
        ? [...prev, { ...base, path: [[x, y]] }]
        : [...prev, base]
    );
    setIsDrawing(true);
  };

  /* ---------- 4.  move ---------- */
  const moveStroke = (e) => {
    if (!isDrawing) return;
    // e.preventDefault();
    const { x, y } = getPos(e);

    setElements((prev) =>
      prev.map((el, i) =>
        i !== prev.length - 1
          ? el
          : tool === "rect"
          ? { ...el, width: x - el.offsetX, height: y - el.offsetY }
          : tool === "line"
          ? { ...el, width: x, height: y }
          : tool === "pencil"
          ? { ...el, path: [...el.path, [x, y]] }
          : el
      )
    );
  };

  /* ---------- 5.  end ---------- */
  const endStroke = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  /* ---------- 6.  draw everything ---------- */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = ctx.current;
    if (!canvas || !context) return;

    const roughCanvas = rough.canvas(canvas);
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

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

    /* throttle broadcast */
    const now = Date.now();
    if (now - lastEmit.current > 200) {
      socket.emit("drawing", { roomId, imageData: canvas.toDataURL() });
      lastEmit.current = now;
    }
  }, [elements, canvasRef, ctx, socket, roomId]);

  /* ---------- 7.  active touchmove when drawing ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchMove = (e) => {
      if (!isDrawing) return;
      e.preventDefault(); // now allowed – listener is active
      moveStroke(e);
    };

    /* passive by default; switch to active only while drawing */
    const opts = { passive: !isDrawing };
    canvas.addEventListener("touchmove", onTouchMove, opts);

    return () => canvas.removeEventListener("touchmove", onTouchMove, opts);
  }, [isDrawing, moveStroke]);

  /* ---------- 8.  render ---------- */
  return (
    <div
      ref={containerRef}
      className="w-full h-[32rem] md:h-[40rem] lg:h-[48rem] overflow-hidden border border-gray-300 rounded-lg shadow-sm mx-auto mt-4"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none select-none block"
        onMouseDown={startStroke}
        onMouseMove={moveStroke}
        onMouseUp={endStroke}
        onMouseLeave={endStroke}
        /* touch */
        onTouchStart={startStroke}
        onTouchMove={moveStroke}
        onTouchEnd={endStroke}
      />
    </div>
  );
};

export default Canvas;
