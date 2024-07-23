import React from 'react';
import Layout from "../../components/Layout/Layout";
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Admin Dashboard - ZenCart"}>
      <div className="max-w-[1150px] mx-auto flex flex-col items-center">
      <div className='container mx-auto p-4'>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
            <AdminMenu />
          </div>
          <div className="w-full md:w-3/4 p-6 bg-white rounded-lg mt-4 md:mt-0 shadow-md border border-gray-200">
            <h2 className="text-3xl font-bold mb-4 text-pink-800">Welcome to the Admin Dashboard</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Admin Information</h3>
              <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">Name:</span> {auth?.user?.name}</p>
              <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">Email:</span> {auth?.user?.email}</p>
              <p className="text-gray-600"><span className="font-medium text-gray-800">Contact:</span> {auth?.user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard;
