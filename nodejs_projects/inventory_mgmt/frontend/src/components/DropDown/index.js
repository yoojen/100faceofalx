import React from "react";
import { Link } from "react-router-dom";

const DropDown = () => {
  return (
    <div>
      <div>
        <h1 className="font-medium"> Profile DropDown</h1>
        <hr />
        <div className="flex flex-col space-y-1 mt-5 text-sky-600">
          <Link to={"/account"}>
            Account
          </Link>
          <Link to={"/setting"}>
            Setting
          </Link>
          <Link to={"/logout"}>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
