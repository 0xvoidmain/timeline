/* useWheelPicker — physics-based iOS-style wheel picker interaction */

import { useState, useRef, useEffect, useCallback } from "react";

interface UseWheelPickerOptions {
  itemCount: number;
  itemHeight: number;
  controlledIndex: number;
  defaultIndex?: number;
  onSelect?: (index: number) => void;
  mountAnimationDelay?: number;
}

export function useWheelPicker({
  itemCount,
  itemHeight,
  controlledIndex,
  defaultIndex = 0,
  onSelect,
  mountAnimationDelay = 3000,
}: UseWheelPickerOptions) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const offsetRef = useRef(0);
  const hasMountAnimated = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wheelHeight, setWheelHeight] = useState(0);

  /* Derived geometry */
  const radius = wheelHeight / 2;
  const visibleItems = Math.max(Math.floor(wheelHeight / itemHeight), 1);
  const anglePerItem = 360 / (visibleItems * 2);

  /* ── Drag state ── */
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(0);
  const lastDragY = useRef(0);
  const lastDragTime = useRef(0);
  const velocity = useRef(0);
  const momentumFrame = useRef(0);
  const dragMoved = useRef(false);

  const maxOffset = (itemCount - 1) * itemHeight;

  /** Suppress onSelect during external (controlled) updates */
  const isExternalUpdate = useRef(false);

  const clamp = (v: number) => Math.max(0, Math.min(v, maxOffset));

  /** Snap to nearest item — silent (no callback) */
  const snapToSilent = useCallback(
    (offset: number) => {
      const idx = Math.round(clamp(offset) / itemHeight);
      const snapped = idx * itemHeight;
      offsetRef.current = snapped;
      setScrollOffset(snapped);
    },
    [maxOffset, itemHeight],
  );

  /** Snap to nearest item */
  const snapTo = useCallback(
    (offset: number) => {
      const idx = Math.round(clamp(offset) / itemHeight);
      const snapped = idx * itemHeight;
      offsetRef.current = snapped;
      setScrollOffset(snapped);
      if (!isExternalUpdate.current) {
        onSelect?.(idx);
      }
    },
    [onSelect, maxOffset, itemHeight],
  );

  /** Animate to target offset with spring-like easing */
  const animateTo = useCallback(
    (target: number, silent = false) => {
      cancelAnimationFrame(momentumFrame.current);
      const snappedTarget = Math.round(clamp(target) / itemHeight) * itemHeight;
      const doSnap = silent ? snapToSilent : snapTo;
      const animate = () => {
        const current = offsetRef.current;
        const diff = snappedTarget - current;
        if (Math.abs(diff) < 0.5) {
          doSnap(snappedTarget);
          if (silent) isExternalUpdate.current = false;
          return;
        }
        const next = current + diff * 0.15;
        offsetRef.current = next;
        setScrollOffset(next);
        momentumFrame.current = requestAnimationFrame(animate);
      };
      animate();
    },
    [snapTo, snapToSilent, maxOffset, itemHeight],
  );

  /* ── Effects ── */

  /** On mount, animate from default to the controlled index */
  useEffect(() => {
    if (hasMountAnimated.current) return;
    hasMountAnimated.current = true;
    if (controlledIndex < 0 || controlledIndex === defaultIndex) return;
    const targetOffset = controlledIndex * itemHeight;
    const timer = setTimeout(() => {
      isExternalUpdate.current = true;
      animateTo(targetOffset, true);
    }, mountAnimationDelay);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Sync wheel position when controlled index changes externally */
  useEffect(() => {
    if (!hasMountAnimated.current) return;
    if (controlledIndex < 0) return;
    const targetOffset = controlledIndex * itemHeight;
    if (Math.abs(offsetRef.current - targetOffset) < itemHeight * 0.5) return;
    isExternalUpdate.current = true;
    animateTo(targetOffset, true);
  }, [controlledIndex, animateTo, itemHeight]);

  /** Measure container height and track resizes */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWheelHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setWheelHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  /* ── Pointer handlers ── */

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragMoved.current = false;
    dragStartY.current = e.clientY;
    dragStartOffset.current = offsetRef.current;
    lastDragY.current = e.clientY;
    lastDragTime.current = Date.now();
    velocity.current = 0;
    cancelAnimationFrame(momentumFrame.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dy = (dragStartY.current - e.clientY) * 0.35;
      if (Math.abs(dragStartY.current - e.clientY) > 3)
        dragMoved.current = true;
      const newOffset = clamp(dragStartOffset.current + dy);
      offsetRef.current = newOffset;
      setScrollOffset(newOffset);

      const now = Date.now();
      const dt = now - lastDragTime.current;
      if (dt > 0) {
        velocity.current = (lastDragY.current - e.clientY) / dt;
      }
      lastDragY.current = e.clientY;
      lastDragTime.current = now;
    },
    [maxOffset],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

      if (!dragMoved.current) {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const clickFromCenter = e.clientY - centerY;
          const r = radius || 1;
          const clamped = Math.max(-1, Math.min(1, clickFromCenter / r));
          const radians = Math.asin(clamped);
          const angleDeg = (radians * 180) / Math.PI;
          const currentCenterIdx = offsetRef.current / itemHeight;
          const targetIdx = Math.round(
            currentCenterIdx + angleDeg / anglePerItem,
          );
          const clampedIdx = Math.max(0, Math.min(itemCount - 1, targetIdx));
          animateTo(clampedIdx * itemHeight);
        }
        return;
      }

      const v = velocity.current;
      if (Math.abs(v) > 0.3) {
        const deceleration = 0.997;
        const frames = Math.log(0.01 / Math.abs(v)) / Math.log(deceleration);
        const distance =
          (v * 16 * (1 - Math.pow(deceleration, frames))) / (1 - deceleration);
        animateTo(offsetRef.current + distance);
      } else {
        snapTo(offsetRef.current);
      }
    },
    [animateTo, snapTo, radius, anglePerItem, itemHeight, itemCount],
  );

  /** Mouse wheel — attached as non-passive to allow preventDefault */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const newOffset = clamp(offsetRef.current + e.deltaY);
      offsetRef.current = newOffset;
      setScrollOffset(newOffset);
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = requestAnimationFrame(() => {
        snapTo(newOffset);
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [snapTo, maxOffset]);

  return {
    containerRef,
    scrollOffset,
    wheelHeight,
    radius,
    anglePerItem,
    isDragging,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
}
