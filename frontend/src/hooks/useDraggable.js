import { useRef, useState, useEffect, useCallback } from "react";

/**
 * useDraggable – hook that makes an element draggable, resizable from all corners,
 * and maximizable/restorable.
 *
 * @param {Object} params
 * @param {number} params.initW - Initial width in pixels (default: 480)
 * @param {number} params.initH - Initial height in pixels (default: 360)
 */
export default function useDraggable({ initW = 480, initH = 360 } = {}) {
  const ref = useRef(null);

  // Position defaults to bottom-right corner of viewport with comfortable padding
  const [position, setPosition] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return {
      x: Math.max(20, w - initW - 30),
      y: Math.max(20, h - initH - 30),
    };
  });

  const [size, setSize] = useState({ width: initW, height: initH });
  const [dragging, setDragging] = useState(false);
  const [resizingDirection, setResizingDirection] = useState(null); // 'se' | 'nw' | 'ne' | 'sw'
  const [isMaximized, setIsMaximized] = useState(false);

  const prevLayoutRef = useRef({ position: { x: 0, y: 0 }, size: { width: initW, height: initH } });
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0, width: initW, height: initH });

  const toggleMaximize = useCallback(() => {
    const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
    const winH = typeof window !== "undefined" ? window.innerHeight : 800;

    if (!isMaximized) {
      prevLayoutRef.current = { position, size };
      const maxW = Math.min(1000, Math.max(400, winW - 60));
      const maxH = Math.min(720, Math.max(300, winH - 80));
      const centerX = Math.max(20, Math.floor((winW - maxW) / 2));
      const centerY = Math.max(20, Math.floor((winH - maxH) / 2));
      setSize({ width: maxW, height: maxH });
      setPosition({ x: centerX, y: centerY });
      setIsMaximized(true);
    } else {
      const prev = prevLayoutRef.current;
      setSize(prev.size);
      setPosition(prev.position);
      setIsMaximized(false);
    }
  }, [isMaximized, position, size]);

  const onMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest("button")) return;
    if (isMaximized) return;
    e.preventDefault();
    setDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const startResize = (direction) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingDirection(direction);
    setIsMaximized(false);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
      width: size.width,
      height: size.height,
    };
  };

  useEffect(() => {
    if (!dragging && !resizingDirection) return;

    const handleMouseMove = (e) => {
      const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
      const winH = typeof window !== "undefined" ? window.innerHeight : 800;

      if (dragging) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;
        const newX = Math.max(10, Math.min(winW - size.width - 10, dragStartRef.current.posX + deltaX));
        const newY = Math.max(10, Math.min(winH - size.height - 10, dragStartRef.current.posY + deltaY));
        setPosition({ x: newX, y: newY });
      } else if (resizingDirection) {
        const deltaX = e.clientX - resizeStartRef.current.mouseX;
        const deltaY = e.clientY - resizeStartRef.current.mouseY;
        const { posX, posY, width: startW, height: startH } = resizeStartRef.current;

        const MIN_W = 280;
        const MIN_H = 200;
        const MAX_W = Math.max(MIN_W, winW - 40);
        const MAX_H = Math.max(MIN_H, winH - 40);

        if (resizingDirection === "se") {
          let newW = Math.max(MIN_W, Math.min(MAX_W, startW + deltaX));
          let newH = Math.max(MIN_H, Math.min(MAX_H, startH + deltaY));
          let newX = posX;
          let newY = posY;

          // When stretching towards the screen edge, auto-push position left/up
          // so the user can freely expand the box as big as needed!
          if (newX + newW > winW - 15) {
            newX = Math.max(10, winW - 15 - newW);
          }
          if (newY + newH > winH - 15) {
            newY = Math.max(10, winH - 15 - newH);
          }

          setSize({ width: newW, height: newH });
          setPosition({ x: newX, y: newY });
        } else if (resizingDirection === "nw") {
          let newW = Math.max(MIN_W, Math.min(MAX_W, startW - deltaX));
          let newH = Math.max(MIN_H, Math.min(MAX_H, startH - deltaY));
          let newX = Math.max(10, posX + (startW - newW));
          let newY = Math.max(10, posY + (startH - newH));

          setSize({ width: newW, height: newH });
          setPosition({ x: newX, y: newY });
        } else if (resizingDirection === "sw") {
          let newW = Math.max(MIN_W, Math.min(MAX_W, startW - deltaX));
          let newH = Math.max(MIN_H, Math.min(MAX_H, startH + deltaY));
          let newX = Math.max(10, posX + (startW - newW));
          let newY = posY;
          if (newY + newH > winH - 15) {
            newY = Math.max(10, winH - 15 - newH);
          }

          setSize({ width: newW, height: newH });
          setPosition({ x: newX, y: newY });
        } else if (resizingDirection === "ne") {
          let newW = Math.max(MIN_W, Math.min(MAX_W, startW + deltaX));
          let newH = Math.max(MIN_H, Math.min(MAX_H, startH - deltaY));
          let newX = posX;
          let newY = Math.max(10, posY + (startH - newH));
          if (newX + newW > winW - 15) {
            newX = Math.max(10, winW - 15 - newW);
          }

          setSize({ width: newW, height: newH });
          setPosition({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizingDirection(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizingDirection, size.width, size.height]);

  const style = {
    position: "fixed",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: 9999,
  };

  return {
    ref,
    style,
    size,
    isMaximized,
    toggleMaximize,
    onMouseDown,
    onResizeSE: startResize("se"),
    onResizeNW: startResize("nw"),
    onResizeNE: startResize("ne"),
    onResizeSW: startResize("sw"),
  };
}
