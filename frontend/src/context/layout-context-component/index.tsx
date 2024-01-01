import { ReactNode, createContext, useEffect, useState } from "react";
import AppLayout from "../../components/layouts/app-layout";
import { useLocation } from "react-router-dom";
import AuthLayout from "../../components/layouts/auth-layout";

export type LayoutContextComponentPropsType = {
  children: ReactNode;
};
export type LayoutContextType = {
  //
};
const LayoutContextProvider = createContext<LayoutContextType>({});

export default function LayoutContext(props: LayoutContextComponentPropsType) {
  let location = useLocation();
  const [isAuthhUrl, setIsAuthUrl] = useState<boolean>(
    location.pathname.startsWith("/auth")
  );

  useEffect(() => {
    console.log("location changed:" + location.pathname);
    setIsAuthUrl(location.pathname.startsWith("/auth"));
  }, [location]);

  console.log(">> 🎾 file:index.tsx:24🎾 isAuthUrl:", isAuthhUrl);

  const contextValue: LayoutContextType = {};

  //! setting layout conditionally
  const SelectedLayout = isAuthhUrl ? AuthLayout : AppLayout;
  return (
    <LayoutContextProvider.Provider value={contextValue}>
      <SelectedLayout>{props.children}</SelectedLayout>
    </LayoutContextProvider.Provider>
  );
}
