'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  available: boolean;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  availableProducts: number;
  totalCategories: number;
}

export default function HonoApiTestPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [helloMessage, setHelloMessage] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Test Hono health check endpoint
  const testHealthEndpoint = async () => {
    setLoading('health');
    setError('');
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHelloMessage(`✅ Hono API Working! Status: ${data.status} - ${data.message}`);
    } catch (err) {
      setError(`Health Check Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading('');
    }
  };

  // Test the users endpoint via Hono
  const testUsersEndpoint = async () => {
    setLoading('users');
    setError('');
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError(`Users API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading('');
    }
  };

  // Test the products endpoint via Hono
  const testProductsEndpoint = async () => {
    setLoading('products');
    setError('');
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError(`Products API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading('');
    }
  };

  // Test the stats endpoint
  const testStatsEndpoint = async () => {
    setLoading('stats');
    setError('');
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Stats = await response.json();
      setStats(data);
    } catch (err) {
      setError(`Stats API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading('');
    }
  };

  // Test all endpoints on component mount
  useEffect(() => {
    testHealthEndpoint();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hono API Test</h1>
        <p className="text-gray-600 mb-8">Testing Next.js with Hono framework integration</p>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={testHealthEndpoint}
            disabled={loading === 'health'}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded"
          >
            {loading === 'health' ? 'Loading...' : 'Test Health API'}
          </button>
          
          <button
            onClick={testUsersEndpoint}
            disabled={loading === 'users'}
            className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded"
          >
            {loading === 'users' ? 'Loading...' : 'Test Users API'}
          </button>
          
          <button
            onClick={testProductsEndpoint}
            disabled={loading === 'products'}
            className="bg-purple-500 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded"
          >
            {loading === 'products' ? 'Loading...' : 'Test Products API'}
          </button>

          <button
            onClick={testStatsEndpoint}
            disabled={loading === 'stats'}
            className="bg-orange-500 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded"
          >
            {loading === 'stats' ? 'Loading...' : 'Test Stats API'}
          </button>
        </div>

        {/* Results Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Check Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Health Check</h2>
            {helloMessage ? (
              <div className="bg-blue-50 p-4 rounded border">
                <p className="text-green-600 font-medium">✅ Connection Successful!</p>
                <p className="text-gray-700 mt-2">{helloMessage}</p>
              </div>
            ) : (
              <p className="text-gray-500">Click Test Health API to test basic connectivity</p>
            )}
          </div>

          {/* Stats Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Statistics</h2>
            {stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalUsers}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalProducts}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.availableProducts}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalCategories}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Click Test Stats API to load statistics</p>
            )}
          </div>

          {/* Users Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Users via Hono</h2>
            {users.length > 0 ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">✅ Found {users.length} users</p>
                <div className="max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="bg-gray-50 p-3 rounded border">
                      <p className="font-medium">{user.name || user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Click Test Users API to load users data</p>
            )}
          </div>

          {/* Products Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Products via Hono</h2>
            {products.length > 0 ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">✅ Found {products.length} products</p>
                <div className="max-h-60 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="bg-gray-50 p-3 rounded border">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                      <p className="text-xs text-gray-500">
                        {product.available ? '✅ Available' : '❌ Not Available'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Click Test Products API to load products data</p>
            )}
          </div>
        </div>

        {/* Connection Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Hono Integration Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Frontend:</strong> Next.js with Hono (http://localhost:3000)</p>
              <p><strong>Backend:</strong> Spring Boot (http://localhost:8080)</p>
              <p><strong>API Framework:</strong> Hono.js for API routing</p>
            </div>
            <div>
              <p><strong>Available Endpoints:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>/api/health - Hono health check</li>
                <li>/api/users - Users data (proxied to Spring Boot)</li>
                <li>/api/products - Products data (proxied to Spring Boot)</li>
                <li>/api/stats - Aggregated statistics</li>
                <li>/api/search - Search functionality</li>
                <li>/api/cart/* - Cart management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hono Benefits */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔥 Hono Benefits:</h4>
          <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
            <li>Ultra-fast performance with minimal overhead</li>
            <li>Built-in TypeScript support</li>
            <li>Middleware support for authentication, CORS, etc.</li>
            <li>Simple and intuitive API design</li>
            <li>Excellent Edge Runtime compatibility</li>
            <li>Flexible routing with parameter support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
