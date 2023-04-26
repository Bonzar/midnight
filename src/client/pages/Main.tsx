import React from "react";
import { Footer } from "../components/Footer";

export const Main = () => {
  const clickHandler = async () => {
    const result = await fetch("/api");
    console.log(await result.json());
  };

  return (
    <>
      <button onClick={clickHandler}>Click</button>
      <div>Hello world!</div>
      <Footer />
    </>
  );
};
