import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import { SidebarContext } from "./Sidebar";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  link: string;
  closeSidebar: () => void;
}

const SideBarItem: React.FC<SidebarItemProps> = React.memo(
  ({ icon, label, link, closeSidebar }) => {
    const location = useLocation();

    const context = useContext(SidebarContext);

    if (!context) return;

    const { sidebarExpanded } = context;

    return (
      <li onClick={closeSidebar}>
        <Link
          to={link}
          className={`group relative flex items-center py-2 px-3 font-medium my-1 rounded-md cursor-pointer transition-all ${
            location.pathname === link
              ? "bg-gradient-to-tr from-blue-100 to-blue-200 text-blue-700 "
              : "hover:bg-blue-50 text-gray-600"
          }`}
        >
          {icon}{" "}
          <span
            className={` overflow-hidden transition-all duration-50 ${
              sidebarExpanded ? "ml-3 w-full" : "w-0"
            }`}
          >
            {label}
          </span>
          {!sidebarExpanded && (
            <div
              className={`absolute left-full rounded-md px-2 py-1 ml-8 text-blue-700 text-sm bg-blue-100 invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
            >
              {label}
            </div>
          )}
        </Link>
      </li>
    );
  }
);

export default SideBarItem;
