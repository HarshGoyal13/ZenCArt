import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import logo from "../../assets/logo2.png";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useSearch } from "../../context/search";
import axios from "axios";

const baseurl = process.env.REACT_APP_BASE_URL;

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const navigate = useNavigate();
  const [isSideMenuOpen, setMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const location = useLocation();
  const [values, setValues] = useSearch();
  const [categories, setCategories] = useState([]);

  const role = auth?.user?.role

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get(`${baseurl}/product/search/${values.keyword}`);
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/category/all-category`);
      if (data.success) {
        setCategories(data.categories.slice(0, 5));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    toast.success("Logged out successfully");
    localStorage.removeItem("auth");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCategoriesDropdown = () => {
    setCategoriesDropdownOpen(!categoriesDropdownOpen);
  };

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `block py-2 px-4 text-base lg:text-lg font-medium text-taupegray hover:text-darkred ${
      isActive ? "text-pink-800 border-b-2 border-pink-600 font-black" : "text-taupegray"
    }`;
  };

  const getMobileLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `block py-2 px-4 text-base lg:text-lg text-taupegray hover:text-darkred ${
      isActive ? "text-pink-800 font-black border-b-2 border-pink-600" : "text-taupegray"
    }`;
  };

  return (
    <main>
      <nav className="flex justify-between px-4 lg:px-8 items-center py-6 bg-white shadow-md z-50 relative">
        <div className="flex items-center gap-4 lg:gap-8">
          <section className="flex items-center gap-4">
            {/* menu */}
            <FiMenu
              onClick={() => setMenu(true)}
              className="text-3xl cursor-pointer lg:hidden text-black"
            />
            {/* logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-12 lg:h-14" />
              <span className="text-xl lg:text-xl text-black ml-[-10px]">
                ZenCart
              </span>
            </Link>
          </section>
        </div>

        {/* Laptop view */}
        <div className="hidden lg:flex flex-grow items-center justify-between">
          <div className="flex-grow flex items-center justify-center gap-2 text-black font-header">
            <Link to="/" className={getLinkClasses("/")}>
              Home
            </Link>
            <div className="relative group">
              <button to="/categories" className={getLinkClasses("/categories")}>
                Categories
              </button>
              <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 max-h-56 overflow-y-auto">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/categories/${category.slug}`}
                    className="block py-2 px-4 text-base lg:text-lg text-taupegray hover:text-darkred hover:bg-gray-100"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contactus" className={getLinkClasses("/contactus")}>
              Contact Us
            </Link>

            {!auth.user && 
              <Link to="/register" className={getLinkClasses("/register")}>
                Register
              </Link>
            }

            <div className="flex-shrink-0 ml-[30px]">
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={values.keyword}
                  placeholder="Search..."
                  className="py-2 px-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-darkred transition duration-300 ease-in-out"
                  onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-800 text-white rounded-lg hover:bg-pink-900 transition-colors duration-300"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile view */}
        <div
          className={`lg:hidden fixed h-full w-screen font-header bg-white text-black top-0 right-0 transform transition-transform font-semibold z-50 ${
            isSideMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <section className="text-black bg-white flex-col absolute left-0 top-0 h-screen p-8 gap-8 z-50 w-56 flex">
            <IoCloseOutline
              onClick={() => setMenu(false)}
              className="mt-0 mb-8 text-3xl cursor-pointer text-black"
            />
            {/* Mobile search bar */}
            <form onSubmit={handleSearchSubmit} className="flex mb-6">
              <input
                type="text"
                value={values.keyword}
                placeholder="Search..."
                onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                className="w-[150px] py-2 px-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-darkred transition duration-300 ease-in-out"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-pink-800 text-white rounded-lg hover:bg-pink-900 transition-colors"
              >
                Search
              </button>
            </form>
            <Link to="/" className={getMobileLinkClasses("/")}>
              Home
            </Link>
            <div className="relative">
              <button
                onClick={toggleCategoriesDropdown}
                className={getMobileLinkClasses("/categories")}
              >
                Categories
              </button>
              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/categories/${category.slug}`}
                      className="block py-2 px-4 text-base lg:text-lg text-taupegray hover:text-darkred hover:bg-gray-100"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/contactus" className={getMobileLinkClasses("/contactus")}>
              Contact Us
            </Link>
            {!auth.user && 
              <Link to="/register" className={getMobileLinkClasses("/register")}>
                Register
              </Link>
            }
          </section>
        </div>

        <section className="flex items-center gap-4 relative">
          {auth.user ? (
            <div className="relative">
              <img
                src={auth.user.image} // Assuming `auth.user.image` contains the URL of the user's image
                alt="User Image"
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => navigate(`/dashboard/${auth?.user?.role === "Admin" ? "admin" : "user"}`)}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    DashBoard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            ""
          )}

            {
              role === "Client" && (
                <Link 
                to="/cart" 
                className="relative flex items-center text-black hover:text-gray-700 transition-colors duration-300"
              >
                <AiOutlineShoppingCart className="text-3xl text-gray-800" />
                {cart.length > 0 && (
                  <span className="absolute top-[-8px] right-[-8px] bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
              )
            }


        


        </section>
      </nav>
      <hr />
    </main>
  );
};

export default Header;
