import React, { useState, useRef, useCallback, useMemo } from "react";
import { ChevronFirst, ChevronLast, X } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "./Button";

interface SidebarProps {
  logo?: React.ReactNode;
  children: React.ReactNode;
  visible: boolean;
  closeSidebar: () => void;
}

type SidebarContextType = {
  sidebarExpanded: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

type ColorResult = {
  backgroundColor: string;
  textColor: "black" | "white";
};

function getColorFromInitials(input: string): ColorResult {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 50 + (Math.abs(hash >> 3) % 36);
  const lightness = 30 + (Math.abs(hash >> 5) % 51);

  const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const textColor = lightness < 50 ? "white" : "black";

  return { backgroundColor, textColor };
}

export const SidebarContext = React.createContext<
  SidebarContextType | undefined
>(undefined);

export const Sidebar: React.FC<SidebarProps> = ({
  logo,
  children,
  visible,
  closeSidebar,
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const colors = useMemo(() => getColorFromInitials("John Doe"), []);

  const handleBackgroundClick = useCallback((event: React.MouseEvent) => {
    if (!sidebarRef.current) return;
    if (event.target === sidebarRef.current) closeSidebar();
  }, []);

  return (
    <aside
      className={`h-screen absolute w-full top-0 bg-black/20 z-50 md:w-max md:sticky md:bg-transparent transition-all duration-100 ${
        visible
          ? "visible opacity-100"
          : "invisible opacity-0 delay-100 md:visible md:opacity-100"
      }`}
      ref={sidebarRef}
      onClick={handleBackgroundClick}
    >
      <nav
        className={`h-full flex flex-col bg-white shadow-md  ${
          sidebarExpanded ? "w-3xs" : "w-max"
        } -translate-x-full  ${
          visible ? "translate-x-0 delay-100 duration-200" : "duration-100"
        } md:-translate-0`}
      >
        <div className="p-4 pb-15 flex justify-between items-center">
          <Link
            to="/dashboard"
            className={`overflow-clip transition-all duration-50  ${
              sidebarExpanded ? "w-full" : "w-0"
            }`}
          >
            {logo}
          </Link>
          <Button
            variant="text"
            className="px-2! hidden md:flex"
            aria-label={sidebarExpanded ? "Colapse sidebar" : "Expand sidebar"}
            onClick={() => setSidebarExpanded((prevState) => !prevState)}
          >
            {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
          <Button
            variant="text"
            className="px-2! md:hidden"
            aria-label="Close sidebar"
            onClick={() => closeSidebar()}
          >
            <X />
          </Button>
        </div>
        <SidebarContext.Provider
          value={{ sidebarExpanded, setSidebarExpanded }}
        >
          <ul className="flex-1 px-4 ">{children}</ul>
        </SidebarContext.Provider>
        <Link
          to={`/dashboard/user`}
          className="border-t border-gray-200 flex shadow-md px-4 py-3"
          onClick={closeSidebar}
        >
          <span
            style={{
              backgroundColor: colors.backgroundColor,
              color: colors.textColor,
            }}
            className={`p-3 rounded-lg font-bold w-10 h-10 flex items-center justify-center`}
          >
            JD
          </span>
          <div
            className={`flex flex-col justify-between h-10 overflow-clip transition-all duration-50  ${
              sidebarExpanded ? "w-full ml-4" : "w-0 "
            }`}
          >
            <div className="leading-5">
              <p className="font-semibold">John Doe</p>
              <small className="text-xs text-gray-600 font-extralight">
                jdoe@gmail.com
              </small>
            </div>
          </div>
        </Link>
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);
