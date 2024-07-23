import React, { useState } from 'react';
import { AiOutlineShoppingCart, AiOutlineInfoCircle, AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import toast from 'react-hot-toast';

const ProductCard = ({ product, baseurl }) => {
  const [auth] = useAuth()
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const token = auth?.token
  const role = auth?.user?.role

  const addToCart = () => {
    // Check if item is already in the cart
    const itemExists = cart.some(item => item._id === product._id);

    if (!itemExists) {
      // Add item to the cart and update localStorage
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success("Item Added To Cart");
    } else {
      toast.error("Item already in cart");
    }
  };

  return (
    <div className="relative w-64 h-[380px] bg-white overflow-hidden rounded-lg shadow-sm transform scale-95 transition duration-500 hover:scale-100 hover:shadow-xl">
      <div className="absolute w-full h-full top-0 bg-cover bg-center" style={{ backgroundImage: `url(${baseurl}/product/product-photo/${product._id})` }}></div>
      <div className={`absolute bottom-0 left-0 w-[200%] h-1/5 bg-gray-100 transition-transform duration-500 ${clicked ? 'transform -translate-x-1/2 mb-6' : ''}`}>
        <div className="h-full w-1/2 float-left bg-gray-200 p-5 flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <p className="text-lg">£{product.price}</p>
          </div>

          {token && role === "Client" && (
              <button
              onClick={addToCart}
              className="flex items-center justify-center bg-gray-300 hover:bg-blue-400 transition duration-500 rounded-full p-3 cursor-pointer"
            >
              <AiOutlineShoppingCart className="text-3xl text-gray-700 hover:text-white transition duration-500" />
            </button>
          )}
        



        </div>
        <div className="h-full w-1/2 float-left bg-stone-300 text-white flex flex-col items-center justify-center space-y-2">
          <div className="text-center">
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <p className="text-lg text-black">Added to your cart</p>
          </div>
          <div className="flex items-center justify-center bg-red-500 hover:bg-red-600 transition duration-500 rounded-full p-3 cursor-pointer" onClick={() => setClicked(false)}>
            <AiOutlineClose className="text-3xl text-white transition duration-500 " />
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[50px] h-[60px] bg-pink-800 rounded-b-full transition duration-500 overflow-hidden">
        <button
          onClick={() => navigate(`/product/${product.slug}`)}
          className="flex items-center justify-center h-full text-white transition duration-500 ml-1 opacity-100 hover:bg-rose-900"
        >
          <AiOutlineInfoCircle className="text-4xl" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
