import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaStore, FaUserLock, FaUserCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchSellers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/auth/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Filter only buyer users
      const buyerUsers = response.data.filter(user => user.role === 'buyer');
      setUsers(buyerUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/auth/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Filter only seller users
      const sellerUsers = response.data.filter(user => user.role === 'seller');
      setSellers(sellerUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Failed to fetch sellers');
      setLoading(false);
    }
  };

  const toggleUserBlock = async (userId, currentStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_KEY}/auth/users/${userId}/block`,
        { isBlocked: !currentStatus },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
      fetchSellers();
    } catch (error) {
      console.error('Error toggling user block status:', error);
      toast.error('Failed to update user status');
    }
  };

  const stats = {
    totalUsers: users.length,
    totalSellers: sellers.length,
    blockedUsers: users.filter(user => user.isBlocked).length,
    blockedSellers: sellers.filter(seller => seller.isBlocked).length
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Please login as admin to access this page</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
            <FaUsers className="text-3xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sellers</p>
              <h3 className="text-2xl font-bold">{stats.totalSellers}</h3>
            </div>
            <FaStore className="text-3xl text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Blocked Users</p>
              <h3 className="text-2xl font-bold">{stats.blockedUsers}</h3>
            </div>
            <FaUserLock className="text-3xl text-red-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Blocked Sellers</p>
              <h3 className="text-2xl font-bold">{stats.blockedSellers}</h3>
            </div>
            <FaUserLock className="text-3xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('sellers')}
              className={`${
                activeTab === 'sellers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Sellers
            </button>
          </nav>
        </div>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserBlock(user._id, user.isBlocked)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        user.isBlocked
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.isBlocked ? (
                        <div className="flex items-center gap-2">
                          <FaUserCheck /> Unblock
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaUserLock /> Block
                        </div>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sellers Table */}
      {activeTab === 'sellers' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{seller.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{seller.email}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{seller.products?.length || 0}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      seller.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {seller.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserBlock(seller._id, seller.isBlocked)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        seller.isBlocked
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {seller.isBlocked ? (
                        <div className="flex items-center gap-2">
                          <FaUserCheck /> Unblock
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaUserLock /> Block
                        </div>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 