import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import ProductCard from "./../components/ProductCard";

const baseurl = process.env.REACT_APP_BASE_URL;

const Search = () => {
  const [values] = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="container mx-auto p-4 font-header">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-800 mb-4">Search Results</h1>
          <h6 className="text-xl text-gray-600">
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} Products`}
          </h6>
          <div className="flex flex-wrap mt-8 justify-center">
            {values?.results.map((product) => (
              <div key={product._id} className="m-4">
                <ProductCard product={product} baseurl={baseurl} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
