import DropDown from "../DropDown";
import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";
import useAuth from '../../hooks/useAuth';

function NavBar() {
  const [profileOpen, setProfileOpen] = useState(false)
  const { auth } = useAuth();

  const searchChanged = () => {
    console.log("Typing complete!");
  }


  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
  }

  return (
    <div className="px-8 py-3 flex justify-between bg-white">
      <div className="relative basis-3/4">
        <input
          type="text"
          className="border px-7 py-2 md:w-full"
          id="search"
          name="search"
          placeholder="shaka igicuruzwa cg uwakiguhaye"
          onChange={searchChanged}
        />
        <IoSearchOutline className="absolute top-1/4 left-2 w-5 h-5" width={50} height={50} />
      </div>

      <div className="flex basis-1/4 justify-end items-center">
        <div className="cursor-pointer">
          <div className="italic">
            <span>{auth?.user.email}</span>
          </div>
        </div>
        <div>
          <img src="/assets/wa2024.jpg" alt="" className="rounded-full h-10 cursor-pointer" onClick={toggleProfile} />
          {profileOpen && (
            <div className="absolute z-10 top-14 right-2 w-2/4 md:w-1/4 bg-slate-300  px-4 py-4 shadow-md rounded-md content-center">
              <DropDown />
            </div>
          )
          }
        </div>
      </div>
    </div>
  )
}

export default NavBar;