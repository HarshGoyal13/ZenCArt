import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="text-center my-4 font-hedder">
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
        <NavLink to={"/dashboard/admin"}>
        <h4 className="text-2xl font-semibold mb-6 text-pink-800">Admin Panel</h4>
        </NavLink>
        <div className="flex flex-col gap-3">
          <NavLink
            to="/dashboard/admin/create-category"
            className={({ isActive }) =>
              `py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-pale-brown text-black shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            Create Category
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className={({ isActive }) =>
              `py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-pale-brown text-black shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className={({ isActive }) =>
              `py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-pale-brown text-black shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
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

export default AdminMenu;
