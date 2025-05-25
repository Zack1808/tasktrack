import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutList } from "lucide-react";

import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import SideBarItem from "./components/SidebarItem";

const App: React.FC = () => {
  const [openBar, setOpenBar] = useState(false);
  return (
    <BrowserRouter>
      <TopNav
        logo={
          <h2 className="text-2xl font-semibold sticky top-0">TaskTrack</h2>
        }
        openMenu={() => setOpenBar(true)}
      />
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
    </BrowserRouter>
  );
};

export default App;
