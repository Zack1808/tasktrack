import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Sidebar logo={<h2 className="font-semibold text-2xl">Logo</h2>}>
        Hello
      </Sidebar>
    </BrowserRouter>
  );
};

export default App;
