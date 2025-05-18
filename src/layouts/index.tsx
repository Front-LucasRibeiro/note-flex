import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default function Layout(props: { element: ReactNode }) {
  return (
    <div className="h-screen m-0 p-0 justify-between flex flex-col">
      <Header />
      <div className="flex flex-1 md:flex">
        <div className="flex flex-row flex-1">
          <div className="flex flex-col w-full h-full overflow-x-hidden">
            {props.element}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
