import createModule from "../mandlebrotCPP.mjs";
import { useState, useEffect } from "react";

const useGenPixles = (
  startX,
  startY,
  newCanWidth,
  newCanHeight,
  canWidth,
  canHeight,
  widthScale,
  heightScale,
  arrayLength // eetually get this from global zustand store
) => {
  const [genPixles, setGenPixles] = useState();
  const [Module, setModule] = useState(null);
  const [pixelArray, setPixelArray] = useState(null);

  // this use effect runs once!!!! gets the module

  useEffect(() => {
    createModule().then((Module) => {
      setModule(Module);
      setGenPixles(() =>
        Module.cwrap("genPixles", "null", [
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
        ])
      );
      console.log("created"); // CHECK - this should only run on first call
    });
  }, []);

  if (Module) {
    // this useeffect runs everytime we have new deminisions
    // useEffect(() => {
    // using emscriptens malloc to allocate memory on the emscripten heap
    // of array this returns a pointer to it
    let pixlesPtr = Module._malloc(arrayLength * Uint8Array.BYTES_PER_ELEMENT);

    // copy data to Emscripten heap (directly accessed from Module.HEAPU8)
    let dataheap = new Uint8Array(
      Module.HEAPU8.buffer,
      pixlesPtr,
      arrayLength * Uint8Array.BYTES_PER_ELEMENT
    );

    // call function
    genPixles(
      startX,
      startY,
      newCanWidth,
      newCanHeight,
      canWidth,
      canHeight,
      widthScale,
      heightScale,
      dataheap.byteOffset
    );

    // get the result of the function from the dataheap by way of creating a js array
    let tmpPixelArray = new Uint8ClampedArray(
      dataheap.buffer,
      dataheap.byteOffset,
      arrayLength
    );

    setPixelArray(tmpPixelArray);
    // }, [
    //   startX,
    //   startY,
    //   newCanWidth,
    //   newCanHeight,
    //   canWidth,
    //   canHeight,
    //   widthScale,
    //   heightScale,
    //   Module,
    // ]);

    console.log("returned");
    console.log(pixelArray);
    return pixelArray;
  }
  return "Loading...";

  // return - want to return the pixelArray
};

export default useGenPixles;
