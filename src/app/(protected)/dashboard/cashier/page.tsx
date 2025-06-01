import React from "react";

const CashierDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Cashier Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Role:</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Cashier
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {" "}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Today&apos;s Sales
          </h3>
          <p className="text-2xl font-bold text-gray-900">$1,245</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Orders Processed
          </h3>
          <p className="text-2xl font-bold text-gray-900">23</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
              New Order
            </button>
            <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
              Process Payment
            </button>
            <button className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700">
              View Menu
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Order #1001</span>
              <span className="text-green-600">Completed</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Order #1002</span>
              <span className="text-yellow-600">Pending</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Order #1003</span>
              <span className="text-green-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
