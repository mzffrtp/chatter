import { ReactNode, createContext, useEffect, useState } from "react";
import { showSwal } from "../../utils/functions";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

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
  const authState = useSelector((state: RootState) => state.authState);
  const [isloogedIn, setIsLogedIn] = useState<boolean>(false);

  {
    /*

 //TODO fix here
 useEffect(() => {
    if (!isloogedIn && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({
          command: "auth_login",
          token: authState.token,
        })
      );
      setIsLogedIn(true);
    }
  }, [authState.user]);

*/
  }

  if (authState.user) {
    websocket.send(
      JSON.stringify({
        command: "auth_login",
        token: authState.token,
      })
    );
  }
  const onWebsocketOpen = (event: Event) => {
    console.log(">> 🚀 event:", event);
    console.log(">> websocket open event triggered.");
    websocket.send(
      JSON.stringify({
        hb: Date.now(),
      })
    );
  };

  const onWebsocketClose = (event: CloseEvent) => {
    showSwal("error", "Websocket connection lost, page is loading!");
    setTimeout(() => {
      document.location.reload();
    }, 1_000);
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
