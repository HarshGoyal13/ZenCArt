import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import DashBoard from "./pages/User/DashBoard";
import AdminDashBoard from "./pages/Admin/AdminDAshBoard";
import PrivateRoute from "./components/Routes/Private";
import AdminRoutes from "./components/Routes/AdminRoute";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Profile from "./pages/User/Profile";
import Orders from "./pages/User/Orders";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";

import { useAuth } from "./context/auth";
import AdminOrders from "./pages/Admin/AdminOrders";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";

function App() {
  const [auth] = useAuth();
  const role = auth?.user?.role;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm/:token" element={<ConfirmEmail/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories/:slug" element={<CategoryProduct />} />

        {role !== "Admin" && (
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<DashBoard />} />
            <Route path="user/profile" element={<Profile />} />
            <Route path="user/orders" element={<Orders />} />
          </Route>
        )}

          {role !== "Admin" && (
          <Route path="/cart" element={<CartPage />} />
          )}
          
        {role === "Admin" && (
          <Route path="/dashboard" element={<AdminRoutes />}>
            <Route path="admin" element={<AdminDashBoard />} />
            <Route path="admin/create-category" element={<CreateCategory />} />
            <Route path="admin/create-product" element={<CreateProduct />} />
            <Route path="admin/products" element={<Products />} />
            <Route path="admin/product/:slug" element={<UpdateProduct />} />
            <Route path="admin/orders" element={<AdminOrders />} />
          </Route>
        )}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
