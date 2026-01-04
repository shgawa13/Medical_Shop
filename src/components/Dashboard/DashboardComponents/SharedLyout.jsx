import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { DataProvider } from "./DataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SheardLayout = () => {
  return (
    <div className="relative flex w-[100vw] h-[100vh]">
      <Sidebar />
      {/* here is the body */}
      <div className="flex-1 flex flex-col bg-[#F7F9FB] border-r-slate-50	">
        <div className="px-2 h-[calc(100vh - 60px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
            {" "}
            <ToastContainer />
            <DataProvider>
              <Outlet />
            </DataProvider>
          </div>

          <div className="xl:sticky relative top-0 h-fit"></div>
        </div>
      </div>
    </div>
  );
};

export default SheardLayout;
