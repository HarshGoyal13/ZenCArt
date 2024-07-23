import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div className="text-center my-4 font-hedder">
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
        <NavLink to={"/dashboard/user"}>
        <h4 className="text-2xl font-semibold mb-6 text-pink-800">User DashBoard</h4>
        </NavLink>
        <div className="flex flex-col gap-3">
          <NavLink
            to="/dashboard/user/profile"
            className={({ isActive }) =>
              `py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-pale-brown text-black shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className={({ isActive }) =>
              `py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-pale-brown text-black shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            Orders
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default UserMenu;
