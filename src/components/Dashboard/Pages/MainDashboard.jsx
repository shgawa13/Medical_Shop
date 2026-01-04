import React from "react";
import { Outlet } from "react-router-dom";
import SheardLayout from "../DashboardComponents/SharedLyout";

const MainDashboard = () => {
  return (
    <>
      <SheardLayout>
        <h1>DashBoard</h1>
        <Outlet />
      </SheardLayout>
    </>
  );
};

export default MainDashboard;
