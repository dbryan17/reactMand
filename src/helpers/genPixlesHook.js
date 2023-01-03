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
  // const [genPixles, setGenPixles] = useState();
  //var [myModule, setMyModule] = useState();
  var genPixles = null;
  // for some reason this doesn't work in a useState, maybe try useRef?
  var myModule = null;
  const [pixles, setPixles] = useState(null);
  //const [pixelArray, setPixelArray] = useState(null);

  // this use effect runs once!!!! gets the module

  useEffect(() => {
    const myCreateModule = async () => {
      createModule().then((Module) => {
        genPixles = Module.cwrap("genPixles", "null", [
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

        // console.log("created"); // CHECK - this should only run on first call
        //setMyModule(Module);
        myModule = Module;
        // console.log(myModule);
        myGenPixles();
      });
    };

    const myGenPixles = async () => {
      // using emscriptens malloc to allocate memory on the emscripten heap
      // of array this returns a pointer to it
      // console.log("in myGenPixes");
      // console.log(myModule);
      let pixlesPtr = myModule._malloc(
        arrayLength * Uint8Array.BYTES_PER_ELEMENT
      );

      // copy data to Emscripten heap (directly accessed from Module.HEAPU8)
      let dataheap = new Uint8Array(
        myModule.HEAPU8.buffer,
        pixlesPtr,
        arrayLength * Uint8Array.BYTES_PER_ELEMENT
      );

      // console.log(
      //   startX,
      //   startY,
      //   newCanHeight,
      //   newCanWidth,
      //   canWidth,
      //   canHeight,
      //   widthScale,
      //   heightScale
      // );

      // call function
      await genPixles(
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

      myModule._free(myModule.HEAPU8.buffer);

      // console.log(tmpPixelArray.length);
      // console.log(canWidth, canHeight);

      let data = new ImageData(tmpPixelArray, canWidth, canHeight);

      setPixles(data);

      return data;
    };

    if (!myModule) {
      myCreateModule();
      // console.log("here");
      // myGenPixles();
    } else {
      // console.log("h");
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
  // console.log("returne");
  return pixles;
};

export default useGenPixles;
