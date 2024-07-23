import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import axios from "axios";
import { HashLoader } from "react-spinners";

const baseurl = process.env.REACT_APP_BASE_URL;

const CartPage = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [cart, setCart] = useCart();

  const token = auth?.token;

  // Initialize count state for each item
  const [counts, setCounts] = useState(
    cart.reduce((acc, item) => {
      acc[item._id] = item.count || 1; // Set default count to 1
      return acc;
    }, {})
  );

  const getToken = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.error("Error fetching client token:", error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${baseurl}/product/braintree/payment`,
        {
          nonce,
          cart,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment Error");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getToken();
    }
  }, [auth?.token]);

  // Mock total price calculation
  const totalPrice = () => {
    let total = 0;
    if (Array.isArray(cart)) {
      cart.forEach((item) => {
        total += item.price * (counts[item._id] || 0); // Use count from state
      });
    }
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // Handle count change
  const handleCountChange = (id, change) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: Math.max((prevCounts[id] || 0) + change, 0), // Ensure count is at least 0
    }));
  };

  // Handle remove item
  const handleRemoveItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      toast.success("Removed Item from Cart");
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={'Your Cart - ZenCart'}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center bg-gray-100 p-6 mb-6 rounded-lg shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
            {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {cart.length
              ? `You have ${cart.length} item${cart.length > 1 ? "s" : ""} in your cart ${
                  auth?.token ? "" : "please login to checkout!"
                }`
              : "Your cart is empty"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-[1150px] mx-auto ">
          {/* Product Card Section */}
          <div className="w-full md:w-2/3 p-2 flex flex-col">
            {cart.map((p) => (
              <div
                className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg mb-4 p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                key={p._id}
              >
                <div className="w-full md:w-1/3 p-2 flex justify-center items-center">
                  <img
                    src={`${baseurl}/product/product-photo/${p._id}`}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    alt={p.name}
                  />
                </div>
                <div className="w-full md:w-2/3 p-2 flex flex-col justify-between">
                  <p className="text-base md:text-lg font-semibold text-gray-800">{p.name}</p>
                  <p className="text-sm md:text-md text-gray-600">
                    {p.description.substring(0, 30)}
                    {p.description.length > 30 && "..."}
                  </p>
                  <p className="text-base md:text-md font-bold text-gray-900">
                    Price: ${p.price.toFixed(2)}
                  </p>
                  <div className="flex flex-col md:flex-row items-start md:items-center mt-2">
                    <div className="flex items-center mb-2 md:mb-0">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300 text-sm md:text-base"
                        onClick={() => handleCountChange(p._id, -1)}
                        disabled={(counts[p._id] || 0) <= 0}
                      >
                        -
                      </button>
                      <span className="mx-2 text-base md:text-lg font-semibold">
                        {counts[p._id] || 0}
                      </span>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300 text-sm md:text-base"
                        onClick={() => handleCountChange(p._id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 text-sm md:text-base"
                      onClick={() => handleRemoveItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Section */}
          <div className="w-full md:w-1/3 p-2 bg-gray-100 rounded-lg shadow-md flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Cart Summary</h2>
            <p className="text-sm md:text-md mb-3 text-gray-600">Total | Checkout | Payment</p>
            <hr className="mb-4 border-gray-300" />
            <h4 className="text-lg md:text-xl font-bold mb-4 text-gray-900">Total: {totalPrice()}</h4>
            {auth?.user?.address ? (
              <div className="mb-4">
                <h4 className="text-sm md:text-md font-semibold text-gray-800">Current Address</h4>
                <h5 className="text-sm md:text-md text-gray-700">{auth?.user?.address}</h5>
                <button
                  className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 text-sm md:text-base"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              </div>
            ) : (
              <div className="mb-4">
                {auth?.token ? (
                  <button
                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 text-sm md:text-base"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 text-sm md:text-base"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please Login to Checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-300 flex flex-col">
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Payment</h3>
              {clientToken ? (
                <DropIn
                  options={{
                    authorization: clientToken,
                    // Only include card options
                    paypal: false,
                  }}
                  onInstance={(instance) => setInstance(instance)}
                />
              ) : (
                <p>Loading payment options...</p> // Display message while clientToken is loading
              )}
              <button
                onClick={handlePayment}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm md:text-base"
                disabled={!instance || !auth?.user?.address}
              >
                {loading ? <div className="absolute inset-0 flex items-center justify-center">
                    <HashLoader size={25} color="#fff" />
                  </div> : "Make Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
