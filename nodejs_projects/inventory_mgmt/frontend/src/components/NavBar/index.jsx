import { IoSearchOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";

function NavBar() {

  const searchChanged = () => {
    console.log("Typing complete!");
  }

  const toggleNotification = () => {
    alert("requested to toggle notification");
  }

  const toggleProfile = () => {
    alert("requested to toggle profile");
  }

  return (
    <div className="px-8 py-3 flex justify-between w-full bg-white">
      <div className="relative w-full">
        <input
          type="text"
          className="border w-2/3 px-7 py-2 lg:w-1/2"
          id="search"
          name="search"
          placeholder="shaka igicuruzwa cg uwakiguhaye"
          onChange={searchChanged}
          />
        <IoSearchOutline  className="absolute top-1/4 left-2 w-5 h-5"  width={50} height={50}/>
      </div>

      <div className="flex">
        <div className="relative cursor-pointer">
          <IoMdNotificationsOutline className="h-10 w-10" onClick={toggleNotification}/>
          <span>
            <small
              className="absolute -top-3 left-1/2 bg-blue-400 text-white rounded-full p-1 font-medium">
              3
            </small>
          </span>
        </div>
        <img src="/assets/wa2024.jpg" alt="" className="rounded-full h-10 cursor-pointer" onClick={toggleProfile}/>
      </div>
    </div>
  )
}

export default NavBar;