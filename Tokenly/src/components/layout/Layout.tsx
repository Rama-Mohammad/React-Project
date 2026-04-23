import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import Navbar from "../common/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#eaf4ff_0%,#e9ecff_50%,#f3e8ff_100%)]">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

