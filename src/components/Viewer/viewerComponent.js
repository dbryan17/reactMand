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

  // const [pixles, setPixles] = useState(
  //   useGenPixels(0, 0, 3840, 2160, 3840, 2160, 1, 1, 33177600)
  // );
  //useGenPixels(0, 0, 3840, 2160, 1, 1, 186777600)

  // MANDLEBROT STATE

  //TEMPORTARY - DO THIS WITH ZUSTAND
  //const [first, setFirst] = useState(true);

  const [prevMandCords, setPrevMandCords] = useState({
    startX: 0,
    startY: 0,
    widthScale: 1,
    heightScale: 1,
  });

  const [clinetDims, setClientDims] = useState({
    width: null,
    height: null,
  });

  const [genPixlesParams, setGenPixlesParams] = useState({
    startX: 0,
    startY: 0,
    newCanWidth: xRes,
    newCanHeight: yRes,
    canWidth: xRes,
    canHeight: yRes,
    widthScale: 1,
    heightScale: 1,
    arrayLength: xRes * yRes * 4,
  });

  let p = useGenPixels(
    genPixlesParams.startX,
    genPixlesParams.startY,
    genPixlesParams.newCanWidth,
    genPixlesParams.newCanHeight,
    genPixlesParams.canWidth,
    genPixlesParams.canHeight,
    genPixlesParams.widthScale,
    genPixlesParams.heightScale,
    genPixlesParams.arrayLength
  );

  //let p = useGenPixels(0, 0, 3840, 2160, 3840, 2160, 1, 1, 33177600);

  const interDrawMand = (startX, startY, endX, endY) => {
    // this function will do all that draw does in generator.js - then set the final
    // state to trigger the what we need for genPixles hook to run
    // it is called on mouse up
    // will always be on second iteration

    startX = startX * (xRes / clinetDims.width);
    endX = endX * (xRes / clinetDims.width);
    startY = startY * (yRes / clinetDims.height);
    endY = endY * (yRes / clinetDims.height);

    let width = endX - startX;
    let height = endY - startY;

    // curretn width scales
    let widthScale = width / xRes;
    let heightScale = height / yRes;

    // idk if you can do this in react - might need a new var
    startX = prevMandCords.widthScale * startX + prevMandCords.startX;
    startY = prevMandCords.heightScale * startY + prevMandCords.startY;

    // calculate new scales
    widthScale = widthScale * prevMandCords.widthScale;
    heightScale = heightScale * prevMandCords.heightScale;

    let newCanWidth;
    let newCanHeight;

    // if height is more zoomed in
    if (heightScale > widthScale) {
      // want full height
      newCanHeight = yRes;
      // want width properlly scalled and correct based on height
      newCanWidth = yRes * (width / height);
      widthScale = (xRes / newCanWidth) * widthScale;
      // same for width
    } else {
      newCanWidth = xRes;
      newCanHeight = xRes * (height / width);
      heightScale = (yRes / newCanHeight) * heightScale;
    }

    // now we have all we need for the useGenPixles hook to rerun, so set that state
    setGenPixlesParams({
      startX: startX,
      startY: startY,
      newCanWidth: newCanWidth,
      newCanHeight: newCanHeight,
      canWidth: xRes,
      canHeight: yRes,
      widthScale: widthScale,
      heightScale: heightScale,
      arrayLength: xRes * yRes * 4,
    });

    setPrevMandCords({
      startX: startX,
      startY: startY,
      widthScale: widthScale,
      heightScale: heightScale,
    });
  };

  const drawMand = (ctx) => {
    // in here have mandCords stuff, will cause rerun (thus update the mandlebeort canvas)
    // hoping to call genPixlesHook in here to get the pxiels we need, but might not be how
    // you should do things in react

    // clear

    if (
      ctx.canvas.clientHeight !== clinetDims.height ||
      ctx.canvas.clientWidth !== clinetDims.width
    ) {
      setClientDims({
        width: ctx.canvas.clientWidth,
        height: ctx.canvas.clientHeight,
      });
    }

    //interDrawMand(realStartX, realStartY, realEndX, realEndY);

    // calling this everytime anyway so

    if (p) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.putImageData(p, 0, 0);
    }
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

  // RECTANGLE STATE
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
    // resetting these mandCords should trigger a rerender of usegenPixles

    let startX = finalCords.startX;
    let endX = finalCords.endX;
    let startY = finalCords.startY;
    let endY = finalCords.endY;

    if (startX > endX) {
      let tmpStart = startX;
      startX = endX;
      endX = tmpStart;
    }
    if (startY > endY) {
      let tmpStart = startY;
      startY = endY;
      endY = tmpStart;
    }

    // instead call a function to with these and set all variables used in genPixles hook at once,
    // make that function dshould be a hook but I don't think it needs to
    if (!(startY === endY || startX === endX)) {
      // need to have mand cords after all
      interDrawMand(
        Math.round(startX),
        Math.round(startY),
        Math.round(endX),
        Math.round(endY)
      );
      // setMandCords(
      //   Math.round(finalCords.startX),
      //   Math.round(finalCords.startY),
      //   Math.round(finalCords.endX),
      //   Math.round(finalCords.endY)
      // );
    }

    // setMandCords(
    //   Math.round(finalCords.startX),
    //   Math.round(finalCords.startY),
    //   Math.round(finalCords.endX),
    //   Math.round(finalCords.endY)
    // );
    //setFirst(true);
  }
  //useGenPixels(0, 0, 3840, 2160, 1, 1, 186777600);

  //let p = useGenPixels(0, 0, 3840, 2160, 1, 1, 186777600);

  /////////////////////////////////////////////

  // need to create two canvases, one for drawing and one for fractals

  return (
    <>
      <Canvas
        className="can"
        draw={drawMand}
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
