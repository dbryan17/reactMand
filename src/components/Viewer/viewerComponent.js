// want to have the click handler here and pass it down to the canvas
// compoenent

// state of where the mouse is will be stored here, along with the state
// of the current size and all that shit for the fractal

import Canvas from "./canvasComponent";
import "./viewer.css";
import { useState } from "react";
import useGenPixels from "../../helpers/genPixlesHook";

const Viewer = ({ xRes, yRes }) => {
  // empty draw
  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  // to keep things kosher, we will put this here in the outermost part of our componenent, but it
  // depends on a bunch of stuff that changes, so will rerun when that stuff changes (namely - mandCords)
  // draw mand will depend on the pixle array that this returns, so then it will rerun every time this returns
  // I beleive this is the way to keep the flow all good
  //useGenPixels(0, 0, 3840, 2160, 1, 1, 186777600);

  const [pixles, setPixles] = useState();
  //useGenPixels(0, 0, 3840, 2160, 1, 1, 186777600)
  //console.log(pixles);

  const drawMand = (ctx) => {
    // in here have mandCords stuff, will cause rerun (thus update the mandlebeort canvas)
    // hoping to call genPixlesHook in here to get the pxiels we need, but might not be how
    // you should do things in react

    // clear
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    console.log("pixles");

    ctx.putImageData(pixles, 0, 0);

    // FIRST JUST TRY TO DRAW IT

    //
    // let width = mandCords.endX - mandCords.startX;
    // let height = mandCords.endY - mandCords.startY;

    // let widthScale = width / ctx.canvas.width;
    // let heightScale = height / ctx.canvas.height;
    // // if not on first iteration
    // if (!first) {
    //   // calculate new start corodinates
    //   startX = prevWidthScale * startX + prevStartX;
    //   startY = prevHeightScale * startY + prevStartY;
    //   // calculate new scales
    //   widthScale = widthScale * prevWidthScale;
    //   heightScale = heightScale * prevHeightScale;
    // }
    // let newCanHeight;
    // let newCanWidth;

    // // if height is more zoomed in
    // if (heightScale > widthScale) {
    //   // want full height
    //   newCanHeight = canHeight;
    //   // want width properlly scalled and correct based on height
    //   newCanWidth = canHeight * (width / height);
    //   widthScale = (canWidth / newCanWidth) * widthScale;
    //   // same for width
    // } else {
    //   newCanWidth = canWidth;
    //   newCanHeight = canWidth * (height / width);
    //   heightScale = (canHeight / newCanHeight) * heightScale;
    // }
    // // useGenPixels(mandCords.startX, mandCords.startY);
    // setFirst(false);
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

  //TEMPORTARY - DO THIS WITH ZUSTAND
  const [first, setFirst] = useState(true);

  const [mandCords, setMandCords] = useState({
    startX: null,
    startY: null,
    endX: null,
    endY: null,
  });

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
    setMandCords(
      finalCords.startX,
      finalCords.startY,
      finalCords.endX,
      finalCords.endY
    );

    // call setPixles to redraw
  }
  //useGenPixels(0, 0, 3840, 2160, 1, 1, 186777600);

  //let p = useGenPixels(0, 0, 3840, 2160, 1, 1, 186777600);

  /////////////////////////////////////////////

  // need to create two canvases, one for drawing and one for fractals

  return (
    <>
      <Canvas
        className="can"
        draw={draw}
        xRes={3840}
        yRes={2160}
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
