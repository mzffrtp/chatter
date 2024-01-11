import { ReactNode, createContext, useEffect, useState } from "react";

export type WebsocketContextPropsType = {
  children: ReactNode;
};
export type WebsocketValueType = {
  //
};

const WebsocketContextProvider = createContext<WebsocketValueType>({});

export default function WebsocketContext(props: WebsocketContextPropsType) {
  const [websocket, setWebsocket] = useState<WebSocket>(
    new WebSocket(import.meta.env.VITE_CHAT_API_WEBSOCKET_URL)
  );
  const contextValue: WebsocketValueType = {};

  useEffect(() => {
    // Connection opened
    websocket.addEventListener("open", (event) => {
      websocket.send(
        JSON.stringify({
          hb: Date.now(),
        })
      );
    });

    // Listen for messages
    websocket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });

    // Connection closed
    websocket.addEventListener("close", (event) => {
      console.log("Connection closed");
    });

    // Connection error
    websocket.addEventListener("error", (event) => {
      console.log("Connection error occured", event);
    });

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <WebsocketContextProvider.Provider value={contextValue}>
      {props.children}
    </WebsocketContextProvider.Provider>
  );
}
