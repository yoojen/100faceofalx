import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import { navLinks } from "../Utils";

function SideNav() {

  return (
    <div>
      <div className="mt-14 space-y-6">
        <div className="lg:flex items-center  w-1/4">
          <img src="/assets/logo_.png" alt="" width={80} height={80} />
          <div className="-mt-5 uppercase -space-y-3 text-center text-sky-500">
            <small className="text-black font-medium">stock</small>
            <h1 className="text-xl">yanjye</h1>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <ul className="space-y-6 w-full">
            {
              navLinks.map((link) => {
                return (
                  <li className="flex items-center space-x-3 active:text-sky-500 hover:text-sky-500" key={link.id}>
                    {link.icon}
                    <NavLink to={link.rel}> {link.text} </NavLink>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className="flex items-center space-x-3 cursor-pointer absolute z-50 bottom-5 left-5">
        <FiLogOut className="h-5 w-5 peer/logout  hover:text-sky-500" />
        <button className="peer-hover/logout:text-red-500 hover:text-red-500">Logout</button>
      </div>
    </div>
  )
}

export default SideNav