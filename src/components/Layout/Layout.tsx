import { type ReactElement } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

const Layout = ({ children }: LayoutProps) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default Layout;
