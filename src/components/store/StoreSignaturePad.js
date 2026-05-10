import { useEffect, useRef } from "react";

/**
 * @param {{ onChange: (value: string) => void, clearSignal: number }} props
 */
export default function StoreSignaturePad({ onChange, clearSignal }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const hasStrokeRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      hasStrokeRef.current = false;
      paintBackground(canvas, ratio);
      onChange("");
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, [clearSignal, onChange]);

  function getContext() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return null;
    }

    return {
      canvas,
      context,
    };
  }

  function exportSignature() {
    const canvas = canvasRef.current;

    if (!canvas || !hasStrokeRef.current) {
      onChange("");
      return;
    }

    onChange(canvas.toDataURL("image/png").split(",")[1] || "");
  }

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
    const contextValue = getContext();

    if (!contextValue) {
      return;
    }

    const { context } = contextValue;

    drawingRef.current = true;
    hasStrokeRef.current = true;
    const point = getPoint(event);
    onChange("");
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.arc(point.x, point.y, 0.7, 0, Math.PI * 2);
    context.fillStyle = "#000000";
    context.fill();
    exportSignature();
    event.preventDefault();
  }

  function draw(event) {
    const contextValue = getContext();

    if (!drawingRef.current || !contextValue) {
      return;
    }

    const { context } = contextValue;
    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    exportSignature();
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

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} ratio
 */
function paintBackground(canvas, ratio) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.strokeStyle = "#000000";
  context.fillStyle = "#000000";
  context.lineWidth = 2;
  context.lineCap = "round";
  context.lineJoin = "round";
}
