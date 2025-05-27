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

export default function ApiTestPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [helloMessage, setHelloMessage] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');// Test basic connectivity using Hono health check
  const testHelloEndpoint = async () => {
    setLoading('hello');
    setError('');
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHelloMessage(`✅ Hono API Working! Status: ${data.status} - ${data.message}`);
    } catch (err) {
      setError(`Hono API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading('');
    }
  };

  // Test the users endpoint
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

  // Test the products endpoint
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
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(`Stats API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading('');
    }
  };

  // Test all endpoints on component mount
  useEffect(() => {
    testHelloEndpoint();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={testHelloEndpoint}
            disabled={loading === 'hello'}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded"
          >
            {loading === 'hello' ? 'Loading...' : 'Test API Connection'}
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
            className="bg-red-500 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded"
          >
            {loading === 'stats' ? 'Loading...' : 'Test Stats API'}
          </button>
        </div>

        {/* Results Display */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Hello Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">API Connection Test</h2>
            {helloMessage ? (
              <div className="bg-blue-50 p-4 rounded border">
                <p className="text-green-600 font-medium">✅ Connection Successful!</p>
                <p className="text-gray-700 mt-2">Response: {helloMessage}</p>
              </div>
            ) : (
              <p className="text-gray-500">Click "Test Hello API" to test basic connectivity</p>
            )}
          </div>

          {/* Users Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Users API Response</h2>
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
              <p className="text-gray-500">Click "Test Users API" to load users data</p>
            )}
          </div>

          {/* Products Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Products API Response</h2>
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
              <p className="text-gray-500">Click "Test Products API" to load products data</p>
            )}
          </div>

          {/* Stats Response */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Stats API Response</h2>
            {stats ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">✅ Stats loaded successfully</p>
                <div className="bg-gray-50 p-3 rounded border">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(stats, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Click "Test Stats API" to load stats data</p>
            )}
          </div>
        </div>

        {/* Connection Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Connection Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Frontend:</strong> Next.js (http://localhost:3000)</p>
              <p><strong>Backend:</strong> Spring Boot (http://localhost:8080)</p>
            </div>
            <div>
              <p><strong>API Endpoints Tested:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>/api/hello - Basic connectivity test</li>
                <li>/api/users - Users data from database</li>
                <li>/api/products - Products data from database</li>
                <li>/api/stats - Application stats</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">📝 Instructions:</h4>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1 text-sm">
            <li>Make sure your Spring Boot app is running on http://localhost:8080</li>
            <li>Make sure your Next.js app is running on http://localhost:3000</li>
            <li>Click the test buttons above to verify API connectivity</li>
            <li>Check browser console for any additional error details</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
