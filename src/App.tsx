import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutList } from "lucide-react";

import Sidebar from "./components/Sidebar";
import SideBarItem from "./components/SidebarItem";
import Button from "./components/Button";

const App: React.FC = () => {
  const [openBar, setOpenBar] = useState(false);
  return (
    <BrowserRouter>
      <div className="flex items-start">
        <Sidebar
          logo={<h2 className="font-semibold text-2xl">Logo</h2>}
          visible={openBar}
          closeSidebar={() => setOpenBar(false)}
        >
          <SideBarItem
            label="Lists"
            link="/lists"
            icon={<LayoutList size={20} />}
            closeSidebar={() => setOpenBar(false)}
          />
          <SideBarItem
            label="Lists"
            link="/lists4"
            icon={<LayoutList size={20} />}
            closeSidebar={() => setOpenBar(false)}
          />
          <SideBarItem
            label="Lists"
            link="/lists1"
            icon={<LayoutList size={20} />}
            closeSidebar={() => setOpenBar(false)}
          />
          <SideBarItem
            label="Lists"
            link="/lists2"
            icon={<LayoutList size={20} />}
            closeSidebar={() => setOpenBar(false)}
          />
          <SideBarItem
            label="Lists"
            link="/lists3"
            icon={<LayoutList size={20} />}
            closeSidebar={() => setOpenBar(false)}
          />
        </Sidebar>
        <Button
          variant="contained"
          onClick={() => setOpenBar((prevState) => !prevState)}
        >
          Press Me
        </Button>
      </div>
    </BrowserRouter>
  );
};

export default App;
