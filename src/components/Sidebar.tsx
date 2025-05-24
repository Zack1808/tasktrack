import React from "react";
import { ChevronFirst } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "./Button";

interface SidebarProps {
  logo?: React.ReactNode;
  children: React.ReactNode;
}

type ColorResult = {
  backgroundColor: string;
  textColor: "black" | "white";
};

function getColorFromInitials(initials: string): ColorResult {
  // Generate hash from initials
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Convert hash to HSL
  const hue = hash % 360;
  const saturation = 70;
  const lightness = 80;

  // HSL to RGB conversion
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n: number) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);

  const backgroundColor = `rgb(${r}, ${g}, ${b})`;

  // Brightness for contrast text color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor: "black" | "white" = brightness > 128 ? "black" : "white";

  return { backgroundColor, textColor };
}

const Sidebar: React.FC<SidebarProps> = ({ logo, children }) => {
  const colors = getColorFromInitials("JN");

  return (
    <aside className="h-screen  max-w-xs">
      <nav className="h-full flex flex-col bg-white shadow-md">
        <div className="p-4 pb-15 flex justify-between items-center">
          <Link to="/dashboard">{logo}</Link>{" "}
          <Button variant="text" className="px-2!">
            <ChevronFirst />
          </Button>
        </div>
        <ul className="flex-1 px-4">{children}</ul>
        <Link
          to={`/dashboard/user`}
          className="border-t border-gray-200 flex shadow-md px-4 py-3"
        >
          <span
            style={{
              backgroundColor: colors.backgroundColor,
              color: colors.textColor,
            }}
            className={`p-3 rounded-lg font-bold w-10 h-10 flex items-center justify-center`}
          >
            JN
          </span>
          <div className="flex flex-col justify-between items-betwe w-full ml-4">
            <div className="leading-5">
              <p className="font-semibold">Jean-Pierre Novak</p>
              <small className="text-xs text-gray-600 font-extralight">
                jeanpierrenovak23@gmail.com
              </small>
            </div>
          </div>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
