/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * @param {{
 * open: boolean,
 * file: File | null,
 * title: string,
 * aspectRatio: number,
 * outputWidth?: number,
 * outputHeight?: number,
 * outputMimeType?: string,
 * shape?: "rect" | "circle",
 * onCancel: () => void,
 * onConfirm: (payload: { dataUrl: string, base64: string, fileName: string, mimeType: string }) => void,
 * }} props
 */
export default function AspectCropDialog({
  open,
  file,
  title,
  aspectRatio,
  outputWidth = 1080,
  outputHeight,
  outputMimeType,
  shape = "rect",
  onCancel,
  onConfirm,
}) {
  if (!open || !file) {
    return null;
  }

  return (
    <CropSession
      key={`${file.name}-${file.size}-${file.lastModified}-${aspectRatio}`}
      file={file}
      title={title}
      aspectRatio={aspectRatio}
      outputWidth={outputWidth}
      outputHeight={outputHeight}
      outputMimeType={outputMimeType}
      shape={shape}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}

function CropSession({
  file,
  title,
  aspectRatio,
  outputWidth,
  outputHeight,
  outputMimeType,
  shape,
  onCancel,
  onConfirm,
}) {
  const frameRef = useRef(null);
  const [imageElement, setImageElement] = useState(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef(null);
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!frameRef.current) {
      return undefined;
    }

    const node = frameRef.current;

    function updateSize() {
      const rect = node.getBoundingClientRect();
      setFrameSize({
        width: rect.width,
        height: rect.height,
      });
    }

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(node);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const metrics = useMemo(() => {
    if (!imageElement || !frameSize.width || !frameSize.height) {
      return null;
    }

    const naturalWidth = imageElement.naturalWidth;
    const naturalHeight = imageElement.naturalHeight;
    const baseScale = Math.max(
      frameSize.width / naturalWidth,
      frameSize.height / naturalHeight,
    );
    const scaledWidth = naturalWidth * baseScale * zoom;
    const scaledHeight = naturalHeight * baseScale * zoom;
    const maxOffsetX = Math.max(0, (scaledWidth - frameSize.width) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - frameSize.height) / 2);

    return {
      naturalWidth,
      naturalHeight,
      scaledWidth,
      scaledHeight,
      maxOffsetX,
      maxOffsetY,
    };
  }, [frameSize.height, frameSize.width, imageElement, zoom]);

  const boundedOffset = useMemo(() => {
    if (!metrics) {
      return offset;
    }

    return {
      x: clamp(offset.x, -metrics.maxOffsetX, metrics.maxOffsetX),
      y: clamp(offset.y, -metrics.maxOffsetY, metrics.maxOffsetY),
    };
  }, [metrics, offset]);

  function handlePointerDown(event) {
    if (!metrics) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: boundedOffset.x,
      originY: boundedOffset.y,
    };
  }

  function handlePointerMove(event) {
    if (!dragStateRef.current || !metrics) {
      return;
    }

    const nextX = dragStateRef.current.originX + (event.clientX - dragStateRef.current.startX);
    const nextY = dragStateRef.current.originY + (event.clientY - dragStateRef.current.startY);

    setOffset({
      x: clamp(nextX, -metrics.maxOffsetX, metrics.maxOffsetX),
      y: clamp(nextY, -metrics.maxOffsetY, metrics.maxOffsetY),
    });
  }

  function handlePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
  }

  function handleConfirm() {
    if (!metrics || !imageElement) {
      return;
    }

    const renderedLeft = (frameSize.width - metrics.scaledWidth) / 2 + boundedOffset.x;
    const renderedTop = (frameSize.height - metrics.scaledHeight) / 2 + boundedOffset.y;
    const sourceX = clamp(
      ((0 - renderedLeft) / metrics.scaledWidth) * metrics.naturalWidth,
      0,
      metrics.naturalWidth,
    );
    const sourceY = clamp(
      ((0 - renderedTop) / metrics.scaledHeight) * metrics.naturalHeight,
      0,
      metrics.naturalHeight,
    );
    const sourceWidth = clamp(
      (frameSize.width / metrics.scaledWidth) * metrics.naturalWidth,
      1,
      metrics.naturalWidth - sourceX,
    );
    const targetHeight = outputHeight || Math.round(outputWidth / aspectRatio);
    const sourceHeight = clamp(
      (frameSize.height / metrics.scaledHeight) * metrics.naturalHeight,
      1,
      metrics.naturalHeight - sourceY,
    );

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(
      imageElement,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputWidth,
      targetHeight,
    );

    const mimeType = normalizeMimeType(outputMimeType || file.type);
    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    onConfirm({
      dataUrl,
      base64: dataUrl.split(",")[1] || "",
      fileName: replaceExtension(file.name, mimeType),
      mimeType,
    });
  }

  const previewStyle = metrics
    ? {
        width: `${metrics.scaledWidth}px`,
        height: `${metrics.scaledHeight}px`,
        transform: `translate(${boundedOffset.x}px, ${boundedOffset.y}px)`,
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-sm border border-white/10 bg-[#101010] p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              Image Crop
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-brand-white">{title}</h2>
          </div>
          <button
            className="rounded-sm border border-white/15 px-3 py-2 text-sm font-bold text-white/70 transition-colors hover:text-brand-white"
            type="button"
            onClick={onCancel}
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div
              className="relative mx-auto max-w-[780px] overflow-hidden rounded-sm border border-white/10 bg-[#d9d9d9]"
              style={{ aspectRatio: String(aspectRatio) }}
              ref={frameRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, rgba(255,255,255,0.72) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.72) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.72) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.72) 75%)",
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
                }}
              />
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Crop preview"
                    className="absolute left-1/2 top-1/2 max-w-none select-none touch-none"
                    style={{
                      ...previewStyle,
                      marginLeft: metrics ? `${-metrics.scaledWidth / 2}px` : 0,
                      marginTop: metrics ? `${-metrics.scaledHeight / 2}px` : 0,
                    }}
                    draggable={false}
                    onLoad={(event) => setImageElement(event.currentTarget)}
                  />
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-black/35" />
                    <div
                      className={`absolute inset-0 border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] ${
                        shape === "circle" ? "rounded-full" : ""
                      }`}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <aside className="space-y-5 rounded-sm border border-white/10 bg-black/20 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                Locked Ratio
              </p>
              <p className="mt-2 text-sm font-semibold text-brand-white">
                {formatAspectRatio(aspectRatio)}
              </p>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-brand-white">Zoom</span>
              <input
                className="mt-3 w-full accent-[#D4AF37]"
                min="1"
                max="3"
                step="0.01"
                type="range"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </label>

            <p className="text-sm leading-6 text-white/55">
              Drag to reposition the image inside the locked crop window. Zoom is available, but the aspect ratio stays fixed.
            </p>

            <div className="grid gap-3">
              <button
                className="min-h-11 rounded-sm bg-brand-gold px-4 text-sm font-bold text-brand-black transition-colors hover:brightness-105"
                type="button"
                onClick={handleConfirm}
              >
                Confirm Crop
              </button>
              <button
                className="min-h-11 rounded-sm border border-white/15 px-4 text-sm font-bold text-brand-white transition-colors hover:border-white/25"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeMimeType(type) {
  if (type === "image/png" || type === "image/webp") {
    return type;
  }

  return "image/jpeg";
}

function replaceExtension(fileName, mimeType) {
  const baseName = String(fileName || "cropped-image").replace(/\.[^.]+$/, "");
  const extension =
    mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  return `${baseName}.${extension}`;
}

function formatAspectRatio(aspectRatio) {
  if (Math.abs(aspectRatio - 1) < 0.01) {
    return "1:1";
  }

  if (Math.abs(aspectRatio - 16 / 6) < 0.01) {
    return "16:6";
  }

  if (Math.abs(aspectRatio - 4 / 5) < 0.01) {
    return "4:5";
  }

  if (Math.abs(aspectRatio - 1134 / 634) < 0.02) {
    return "1134:634";
  }

  return aspectRatio.toFixed(2);
}
