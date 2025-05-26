import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import Button from "./Button";

interface TopNavProps {
  logo: React.ReactNode;
  openMenu: () => void;
}

const isNotAuthenticated = false; // TODO: Replace with actual logic

const TopNav: React.FC<TopNavProps> = ({ logo, openMenu }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");

  return (
    <header
      aria-label="Top navigation"
      className={`border-b shadow-sm border-gray-100 p-4 flex justify-center items-center ${
        isDashboard ? "md:hidden" : ""
      }`}
    >
      <nav className="flex justify-between items center w-full max-w-[97.25rem]">
        <Link to="/" aria-label="Starting page">
          {logo}
        </Link>
        <div className="flex gap-2">
          {isNotAuthenticated ? (
            <>
              <Button variant="outlined" link="/sign-up">
                Sign Up
              </Button>
              <Button variant="contained" link="/log-in">
                Log In
              </Button>
            </>
          ) : isDashboard ? (
            <Button variant="text" onClick={openMenu} aria-label="Open menu">
              <Menu />
            </Button>
          ) : (
            <Button variant="text" link="/dashboard">
              Go to Dashboard
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default React.memo(TopNav);
