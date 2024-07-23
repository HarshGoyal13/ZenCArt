import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from '../components/ProductCard';  // Import your custom ProductCard component
import ReviewForm from "../components/Review/ReviewForm";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { FaStar } from 'react-icons/fa';
import toast from "react-hot-toast";

const baseurl = process.env.REACT_APP_BASE_URL;

const ProductDetails = () => {
  const params = useParams();
  
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();

  const token = auth?.token
  const role = auth?.user?.role

  // Fetch product details and reviews
  useEffect(() => {
    if (params?.slug) {
      getProduct();
      getProductReview();
    }
  }, [params?.slug]);

  // Get product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${baseurl}/product/single-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get product reviews
  const getProductReview = async () => {
    try {
      const { data } = await axios.get(
        `${baseurl}/product/get-review/${params.slug}`
      );
      setReviews(data);
      console.log(reviews)
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${baseurl}/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

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
    <Layout title={"Product Details - ZenCart"}>
      <div className="max-w-[1150px] mx-auto flex flex-col items-center font-header">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 flex justify-center">
              <img
                src={`${baseurl}/product/product-photo/${product._id}`}
                className="w-full md:w-3/4 lg:w-2/3 h-auto rounded-lg shadow-lg object-cover transition-transform duration-300 transform hover:scale-105"
                alt={product.name}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mt-8 md:mt-0 flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <hr className="my-4 border-gray-300" />
              <p className="mb-4 text-lg text-gray-700">{product.description}</p>
              <h6 className="mb-4 text-2xl font-semibold text-gray-800">
                Price:{" "}
                {product?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </h6>
              <h6 className="mb-4 text-lg text-gray-600">Category: {product?.category?.name}</h6>

              {token && role === "Client" && (
              <button 
               onClick={addToCart}
              className="btn bg-pink-800 text-white py-2 px-6 rounded-lg hover:bg-pink-900 transition duration-300 mt-4">
                ADD TO CART
              </button>

            )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-900">Product Reviews</h3>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Average Rating: {calculateAverageRating()} / 5</h4>
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                      
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-900">{review.user.name}</h4>
                            <div className="flex items-center space-x-1 text-yellow-500">
                              {[...Array(5)].map((_, index) => (
                                <FaStar
                                  key={index}
                                  size={22}
                                  color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                          <p className="mt-1 text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <ReviewForm />
          </div>

          <hr className="my-8 border-gray-300" />
          <div>
            <h4 className="text-2xl font-bold mb-6 text-gray-800">Similar Products ➡️</h4>
            {relatedProducts.length < 1 && (
              <p className="text-center text-gray-600">No Similar Products found</p>
            )}
            <div className="flex flex-wrap -mx-4">
              {relatedProducts?.map((p) => (
                <div className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8" key={p._id}>
                  <ProductCard product={p} baseurl={baseurl} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
