import { ReactNode, createContext } from "react";
import AppLayout from "../../components/layouts/app-layout";

export type LayoutContextComponentProp = {
  children: ReactNode;
};
export type LayoutContextType = {
  //
};
const LayoutContext = createContext<LayoutContextType>({});

export default function LayoutContextComponent(
  props: LayoutContextComponentProp
) {
  const contextValue: LayoutContextType = {};

  //TODO set layout conditionally
  const SelectedLayout = AppLayout;
  return (
    <LayoutContext.Provider value={contextValue}>
      <SelectedLayout>{props.children}</SelectedLayout>
    </LayoutContext.Provider>
  );
}
