import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import { Toaster } from "react-hot-toast";
const Layout = ({ children, title = 'ZenCArt - shop now', description = 'mern stack project', keywords = 'mern,react,node,mongodb', author = 'harsh' }) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Header />
      <Toaster/>
      <main>{children}</main>

      <Footer />
    </>
  );
};

export default Layout;
