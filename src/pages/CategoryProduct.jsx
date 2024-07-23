import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/ProductCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const baseurl = process.env.REACT_APP_BASE_URL;

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/product/category-product/${params.slug}`);
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Category - ZenCart"}>
      <div className="max-w-[1150px] mx-auto flex flex-col items-center font-hedder">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <h4 className="text-3xl font-semibold text-center text-pink-800 mb-4">
          Category - {category?.name}
        </h4>
        <h6 className="text-lg text-center text-gray-600 mb-6">
          ({products?.length}) results found
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((p) => (
            <div className="flex justify-center" key={p._id}>
              <ProductCard product={p} baseurl={baseurl} />
            </div>
          ))}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
