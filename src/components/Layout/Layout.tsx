import { type ReactElement } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

const Layout = ({ children }: LayoutProps) => (
  <>
    <div className="container relative mx-auto max-w-screen-xl gap-12 ">
      <Header />
      <ToastContainer />
      {children}
      <Footer />
    </div>
  </>
);

export default Layout;
