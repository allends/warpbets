/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "../utils";

const frameHandler = frames(async (ctx) => {
  const counter = ctx.message
    ? ctx.searchParams.op === "+"
      ? ctx.state.counter + 1
      : ctx.state.counter - 1
    : ctx.state.counter;

  return {
    image: 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb.jpg',
    // image: (
    //   <div tw="flex flex-col">
    //     <div tw="flex">frames.js starter</div>
    //     {ctx.message?.inputText && (
    //       <div tw="flex">{`Input: ${ctx.message.inputText}`}</div>
    //     )}
    //     <div tw="flex">Counter {counter}</div>
    //   </div>
    // ),
    textInput: "Say something",
    buttons: [
      <Button action="post" target={{ pathname: "/", query: { op: "+" } }}>
        Increment
      </Button>,
      <Button action="post" target={{ pathname: "/", query: { op: "-" } }}>
        Decrement
      </Button>,
      <Button action="link" target={appURL()}>
        External
      </Button>,
    ],
    state: { counter: counter },
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
