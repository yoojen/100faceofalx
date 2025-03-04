import React, { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import SideNav from "../SideNav";
import NavBar from "../NavBar";
import NavigationContext from "../../context/SideNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { isNavOpen, openNav, closeNav } = useContext(NavigationContext);

  return (
    <div>
      <div className="relative">
        <GiHamburgerMenu
          className="fixed top-5 left-2 z-50 bg-white cursor-pointer h-5 w-5 hover:text-blue-500 peer"
          onClick={isNavOpen ? closeNav : openNav}
        />
        <div className="absolute top-6 left-7 hidden text-sm text-white bg-gray-800 px-2 z-40 md:peer-hover:block">
          Toggle navigation
        </div>
      </div>
      <div className="w-full">
        <div
          className={`${isNavOpen
            ? "h-screen w-2/4 shadow-md bg-white p-5 space-y-32 md:block md:w-sidebar-width md:shadow-none"
            : "hidden"
            } fixed top-0 z-30`}
        >
          <SideNav />
        </div>

        <div
          className={`${isNavOpen ? "w-full md:ml-[18%] md:w-navbar-width" : "ml-0 w-full"} transition-all duration-300 fixed top-0 z-20`}
        >
          <NavBar />
        </div>
      </div>
      <div className={`${isNavOpen ? "md:ml-[18%] top-16" : "ml-0 top-16"} relative`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
