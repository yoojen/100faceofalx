import { IoHomeOutline } from "react-icons/io5";
import { MdProductionQuantityLimits } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";

function SideNav() {
  return (
    <div className="hidden h-screen w-full bg-white p-5 space-y-40 lg:block">
      <div className="space-y-10">
        <GiHamburgerMenu className="cursor-pointer h-5 w-5 hover:text-blue-500"/>
        <div className="flex items-center">
          <img src="/assets/logo_.png" alt="" width={80} height={80} />
          <div className="uppercase -space-y-3 text-center text-sky-500">
            <small>stock</small>
            <h1 className="text-xl">yanjye</h1>
          </div>
        </div>
        <div>
          <ul className="space-y-6">
            <li className="flex items-center space-x-3 active:text-sky-500 hover:text-sky-500">
              <IoHomeOutline className="h-5 w-5"/>
              <NavLink to='/dashboard'> Ahabanza </NavLink>
            </li>
            <li className="flex items-center space-x-3 active:text-sky-500 hover:text-sky-500">
              <MdProductionQuantityLimits className="h-5 w-5"/>
              <NavLink to='/dashboard'> Stock </NavLink>
            </li>
            <li className="flex items-center space-x-3 active:text-sky-500 hover:text-sky-500">
              <BsFillPeopleFill className="h-5 w-5"/>
              <NavLink to='/dashboard'> Abo mukorana </NavLink>
            </li>
            <li className="flex items-center space-x-3 active:text-sky-500 hover:text-sky-500">
              <BiSolidReport className="h-5 w-5"/>
              <NavLink to='/dashboard'> Raporo </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center space-x-3 cursor-pointer">
        <FiLogOut className="h-5 w-5 peer/logout  hover:text-sky-500" />
        <button className="peer-hover/logout:text-red-500 hover:text-red-500">Logout</button>
      </div>
    </div>
  )
}

export default SideNav