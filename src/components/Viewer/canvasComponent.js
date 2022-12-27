//
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

// this should just be for creating the canvas and updating it with state in viewComponent
// by calling useCanvas

import useCanvas from "../../helpers/canvasHook";

const Canvas = ({
  draw,
  xRes,
  yRes,
  className,
  id,
  options,
  mouseDown,
  mouseMove,
  mouseUp,
}) => {
  const canRef = useCanvas(draw, options);

  // console.log(canRef);
  // canRef.current.width = xRes;
  // canRef.currentheight = yRes;

  return (
    <canvas
      ref={canRef}
      className={className}
      id={id}
      width={xRes}
      height={yRes}
      onMouseDown={(e) => mouseDown(e)}
      onMouseMove={(e) => mouseMove(e)}
      onMouseUp={(e) => mouseUp(e)}
    />
  );
};

export default Canvas;
