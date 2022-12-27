// want to have the click handler here and pass it down to the canvas
// compoenent

// state of where the mouse is will be stored here, along with the state
// of the current size and all that shit for the fractal

import Canvas from "./canvasComponent";
import "./viewer.css";
import { useState } from "react";

const Viewer = ({ xRes, yRes }) => {
  // empty draw
  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  // RECTANGLE STUFF //
  /////////////////////////////////////////////

  const clearRect = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawRect = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let realStartX = finalCords.startX * (xRes / ctx.canvas.clientWidth);
    let realStartY = finalCords.startY * (yRes / ctx.canvas.clientHeight);
    let realEndX = finalCords.endX * (xRes / ctx.canvas.clientWidth);
    let realEndY = finalCords.endY * (yRes / ctx.canvas.clientHeight);
    let width = realEndX - realStartX;
    let height = realEndY - realStartY;
    ctx.strokeRect(realStartX, realStartY, width, height);
  };

  // this state needs to be seperate because changing this is what trigger
  // a redraw since it is in drawRect
  const [finalCords, setFinalCords] = useState({
    startX: null,
    startY: null,
    endX: null,
    endY: null,
  });

  const [rectStartCords, setStartRectCords] = useState({
    x: null,
    y: null,
  });

  const [isDown, setIsDown] = useState(false);

  const [drawing, setDrawing] = useState(false);

  const rectOpts = {
    strokeStyle: "red",
    lineWidth: 5,
  };

  function mouseDown(e) {
    e.preventDefault();
    setStartRectCords({
      x: parseInt(e.nativeEvent.offsetX), // * (xRes / rectCanvas.clientWidth), //+ parseInt(e.offsetX);
      y: parseInt(e.nativeEvent.offsetY), // * (yRes / rectCanvas.clientHeight), //+ parseInt(e.offsetY);
    });
    // the 3840/ 356 and 2160/ 200 is to convert from the pixel range to the css size range - 356 and 200 is size of the canvas in css pixels
    setIsDown(true);
  }

  function mouseMove(e) {
    e.preventDefault();
    // want to trigger a redraw - should do it by changing the draw function,
    // as change is props trigger re render
    setDrawing(true);

    setFinalCords({
      startX: rectStartCords.x,
      startY: rectStartCords.y,
      endX: parseInt(e.nativeEvent.offsetX), // * (xRes / rectCanvas.clientWidth), //+ parseInt(e.offsetX);
      endY: parseInt(e.nativeEvent.offsetY),
    });
  }

  function mouseUp(e) {
    e.preventDefault();
    // TODO add ending stuff for drawing the mandlebrot
    setIsDown(false);
    setDrawing(false);
  }

  /////////////////////////////////////////////

  // need to create two canvases, one for drawing and one for fractals
  return (
    <>
      <Canvas
        className="can"
        xRes={3840}
        yRes={2160}
        draw={draw}
        id="mandCan"
      />
      <Canvas
        className="can"
        xRes={3840}
        yRes={2160}
        draw={drawing && isDown ? drawRect : clearRect}
        id="rectCan"
        options={rectOpts}
        mouseDown={(e) => mouseDown(e)}
        mouseMove={(e) => (isDown ? mouseMove(e) : null)}
        mouseUp={(e) => mouseUp(e)}
      />
    </>
  );
};

export default Viewer;
