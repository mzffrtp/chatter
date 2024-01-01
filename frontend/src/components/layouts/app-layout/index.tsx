import { ReactNode } from "react";
import Header from "../../header";
import Footer from "../../footer";

export type AppLayoutPropType = {
  children: ReactNode;
};

export default function AppLayout(props: AppLayoutPropType) {
  return (
    <>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}
