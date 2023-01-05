import "./control.css";
import { useRef, useState } from "react";
import Viewer from "../Viewer/viewerComponent";
function Control({}) {
  const Xref = useRef(3840);
  const Yref = useRef(2160);

  const [back, setBack] = useState(0);

  const [res, setRes] = useState({
    x: 3840,
    y: 2160,
  });

  console.log(res);

  const resetRef = useRef(null);

  function handleReset() {
    console.log(Xref.current.value);
    setRes({
      x: parseInt(Xref.current.value),
      y: parseInt(Yref.current.value),
    });
  }

  function handleBack() {
    setBack((prev) => prev + 1);
  }

  return (
    <>
      <div id="controls">
        <button onClick={handleBack}> Back</button>
        <label htmlFor="Xres">X resolution</label>
        <input name="Xres" ref={Xref} />
        <label htmlFor="Yres">Y resolution</label>
        <input name="Yres" ref={Yref} />
        <button onClick={handleReset} ref={resetRef}>
          Reset
        </button>
      </div>
      <Viewer key={(res.x, res.y)} xRes={res.x} yRes={res.y} back={back} />
    </>
  );
}

export default Control;
