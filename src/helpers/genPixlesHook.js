import createModule from "../mandlebrotCPP.mjs";
import { useState, useEffect, useRef } from "react";

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
  // const [genPixles, setGenPixles] = useState();
  //var [myModule, setMyModule] = useState();

  const [pixles, setPixles] = useState(null);
  //const [pixelArray, setPixelArray] = useState(null);

  // maybe try useCallback for this
  var genPixles = useRef(null);
  // for some reason this doesn't work in a useState, maybe try useRef? - always doesn't work as var, so need to chagne thius
  // to save tiume'

  var myModule = useRef(null);

  useEffect(() => {
    const myCreateModule = async () => {
      createModule().then((Module) => {
        genPixles.current = Module.cwrap("genPixles", "null", [
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
          "number",
        ]);

        //setMyModule(Module);
        myModule.current = Module;
        myGenPixles();
      });
    };

    const myGenPixles = async () => {
      // using emscriptens malloc to allocate memory on the emscripten heap
      // of array this returns a pointer to it
      let pixlesPtr = myModule.current._malloc(
        arrayLength * Uint8Array.BYTES_PER_ELEMENT
      );

      // copy data to Emscripten heap (directly accessed from Module.HEAPU8)
      let dataheap = new Uint8Array(
        myModule.current.HEAPU8.buffer,
        pixlesPtr,
        arrayLength * Uint8Array.BYTES_PER_ELEMENT
      );

      // call function
      await genPixles.current(
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

      myModule.current._free(myModule.current.HEAPU8.buffer);

      let data = new ImageData(tmpPixelArray, canWidth, canHeight);

      setPixles(data);

      return data;
    };
    if (!myModule.current) {
      myCreateModule();
      // myGenPixles();
    } else {
      myGenPixles();
    }

    // maybe return a cleanup to reset variales
  }, [
    startX,
    startY,
    newCanWidth,
    newCanHeight,
    canWidth,
    canHeight,
    widthScale,
    heightScale,
    arrayLength,
  ]);
  return pixles;
};

export default useGenPixles;
