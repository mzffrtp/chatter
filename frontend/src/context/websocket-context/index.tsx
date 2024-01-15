import { ReactNode, createContext, useEffect, useState } from "react";
import { showSwal } from "../../utils/functions";

export type WebsocketContextPropsType = {
  children: ReactNode;
};
export type WebsocketValueType = {
  //
};

const WebsocketContextProvider = createContext<WebsocketValueType>({});
const websocket = new WebSocket(import.meta.env.VITE_CHAT_API_WEBSOCKET_URL);

export default function WebsocketContext(props: WebsocketContextPropsType) {
  const contextValue: WebsocketValueType = {};

  const onWebsocketOpen = (event: Event) => {
    websocket.send(
      JSON.stringify({
        hb: Date.now(),
      })
    );
  };

  const onWebsocketClose = (event: CloseEvent) => {
    showSwal("error", "Websocket connection lost, please refresh page!");
  };

  const onWebsocketMessage = (event: MessageEvent<any>) => {
    console.log("🚀 ~ onWebsocketMessage ~ Message from server:", event.data);
  };

  const onWebsocketError = (event: Event) => {
    console.log(
      "🚀 ~ onWebsocketMessage ~ Remote connection error occured:",
      event
    );
  };

  useEffect(() => {
    websocket.addEventListener("open", onWebsocketOpen);
    websocket.addEventListener("close", onWebsocketClose);
    websocket.addEventListener("message", onWebsocketMessage);
    websocket.addEventListener("error", onWebsocketError);

    return () => {
      console.log(">> websocket context unmount executed. ");

      websocket.removeEventListener("open", onWebsocketOpen);
      websocket.removeEventListener("close", onWebsocketClose);
      websocket.removeEventListener("message", onWebsocketMessage);
      websocket.removeEventListener("error", onWebsocketError);
    };
  }, []);

  return (
    <WebsocketContextProvider.Provider value={contextValue}>
      {props.children}
    </WebsocketContextProvider.Provider>
  );
}
