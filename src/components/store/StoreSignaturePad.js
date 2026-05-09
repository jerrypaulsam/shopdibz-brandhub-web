import { useEffect, useRef } from "react";

/**
 * @param {{ onChange: (value: string) => void, clearSignal: number }} props
 */
export default function StoreSignaturePad({ onChange, clearSignal }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
    context.lineWidth = 2;
    context.lineCap = "round";
    onChange("");
  }, [clearSignal, onChange]);

  function getPoint(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source =
      "touches" in event && event.touches.length ? event.touches[0] : event;

    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  }

  function begin(event) {
    const context = canvasRef.current?.getContext("2d");

    if (!context) {
      return;
    }

    drawingRef.current = true;
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    event.preventDefault();
  }

  function draw(event) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!drawingRef.current || !context || !canvas) {
      return;
    }

    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    onChange(canvas.toDataURL("image/png").split(",")[1] || "");
    event.preventDefault();
  }

  function end() {
    drawingRef.current = false;
  }

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={320}
      className="h-52 w-full touch-none rounded-sm border border-white/20 bg-white"
      onMouseDown={begin}
      onMouseMove={draw}
      onMouseUp={end}
      onMouseLeave={end}
      onTouchEnd={end}
      onTouchMove={draw}
      onTouchStart={begin}
    />
  );
}
