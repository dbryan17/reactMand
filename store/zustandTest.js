import create from "zustand";

const useDimStore = create((set) => ({
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  prevStartX: 0,
  prevStartY: 0,
  prevWidthScale: 0,
  prevHeightScale: 0,
}));
