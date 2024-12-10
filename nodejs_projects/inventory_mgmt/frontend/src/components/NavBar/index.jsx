import { IoSearchOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import DropDown from "../DropDown";
import { useState } from "react";

function NavBar() {
  const [notificationOpen, setNofiticationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)


  const searchChanged = () => {
    console.log("Typing complete!");
  }
  
  const toggleNotification = () => {
    if (profileOpen) {
      setProfileOpen(prev => !prev);
    }
    setNofiticationOpen((prev) =>   !prev);
  }
  
  const toggleProfile = () => {
    if (notificationOpen) {
      setNofiticationOpen(prev => !prev);
    }
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
        <IoSearchOutline  className="absolute top-1/4 left-2 w-5 h-5"  width={50} height={50}/>
      </div>

      <div className="flex basis-1/4 justify-end">
        <div className="cursor-pointer">
          <div className="relative">
            <IoMdNotificationsOutline className="h-10 w-10" onClick={toggleNotification} />
            <span>
              <small
                className="absolute -top-3 left-1/2 bg-blue-400 text-white rounded-full p-1 font-medium">
                3
              </small>
            </span>
          </div>
            { notificationOpen && (
              <div className="absolute z-10 top-14 right-2 w-3/4 md:w-1/4 bg-slate-300  px-2 shadow-md rounded-md content-center">
                <DropDown type='Notification' />
              </div>
            )
          }
        </div>
        <div>
          <img src="/assets/wa2024.jpg" alt="" className="rounded-full h-10 cursor-pointer" onClick={toggleProfile} />
          {profileOpen && (
              <div className="absolute z-10 top-14 right-2 w-2/4 md:w-1/4 bg-slate-300  px-4 py-4 shadow-md rounded-md content-center">
                <DropDown type='Profile' />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default NavBar;