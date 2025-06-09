'use client';
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CashierOnly } from "@/components/role-guard";
import { 
  IconCurrencyDollar, 
  IconShoppingCart, 
  IconClock,
  IconPlus,
  IconEdit,
  IconEye,
  IconSearch,
  IconRefresh,
  IconPrinter,
  IconCheck
} from "@tabler/icons-react";
import { toast } from "sonner";
import { orderApi, Order } from "@/lib/api";
import { isToday, isSameDay, parseISO } from 'date-fns';

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PREPARED':
      return 'bg-blue-100 text-blue-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Payment status color mapping
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
    case 'SETTLEMENT':
    case 'CAPTURE':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'FAILED':
    case 'DENY':
    case 'CANCEL':
    case 'EXPIRE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CashierDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  // Dashboard statistics
  const [stats, setStats] = useState({
    todaysSales: 0,
    ordersProcessed: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    efficiency: 0
  });
  // Load orders
  const loadOrders = async () => {
    try {
      setIsLoading(true);      const ordersData = await orderApi.getAll();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setLastRefresh(new Date());      // Calculate statistics with enhanced metrics
      const todaysOrders = ordersData.filter(order => {
        const orderDate = parseISO(order.orderDate);
        return isToday(orderDate);
      });
      
      const todaysSales = todaysOrders.reduce((sum, order) => {
        const orderTotal = order.payments.reduce((total, payment) => 
          total + (payment.status === 'COMPLETED' ? payment.amount : 0), 0
        );
        return sum + orderTotal;
      }, 0);

      // Calculate average order value
      const averageOrderValue = todaysOrders.length > 0 ? todaysSales / todaysOrders.length : 0;
      
      // Calculate processing efficiency (completed vs total)
      const completedToday = todaysOrders.filter(order => order.status === 'DELIVERED').length;
      const efficiency = todaysOrders.length > 0 ? (completedToday / todaysOrders.length) * 100 : 0;      setStats({
        todaysSales,
        ordersProcessed: todaysOrders.length,
        pendingOrders: ordersData.filter(order => order.status === 'PENDING').length,
        completedOrders: ordersData.filter(order => order.status === 'DELIVERED').length,
        averageOrderValue,
        efficiency
      });
    } catch (error) {      console.error('Error loading orders:', error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(searchTerm) ||
        order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply payment filter
    if (paymentFilter !== 'ALL') {
      filtered = filtered.filter(order => {
        const hasPaymentStatus = order.payments.some(payment => 
          payment.status === paymentFilter
        );
        return hasPaymentStatus;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter]);
  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // Call the backend API to update order status
      await orderApi.updateStatus(orderId, newStatus);
      
      // Update local state
      const updatedOrders = orders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus as 'PENDING' | 'PREPARED' | 'DELIVERED' | 'CANCELLED' } : order
      );
      setOrders(updatedOrders);
      
      // Update selected order if it's the one being updated
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as 'PENDING' | 'PREPARED' | 'DELIVERED' | 'CANCELLED' });
      }
      
      toast.success(`Order status updated to ${newStatus}`);
      
      setIsUpdateStatusDialogOpen(false);
      setNewOrderStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error("Failed to update order status");
    }
  };
  // Calculate order total
  const calculateOrderTotal = (order: Order) => {
    return order.orderDetails.reduce((total, detail) => 
      total + (detail.unitPrice * detail.quantity), 0
    );
  };
  useEffect(() => {
    loadOrders();
  }, []);

 
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Cashier Dashboard</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      </div>
    );  }
    // Get today's orders using date-fns for proper timezone handling
  const todaysOrders = filteredOrders.filter(order => {
    const orderDate = parseISO(order.orderDate);
    return isToday(orderDate);
  });
  
  // Quick action for updating status
  const quickUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      
      const updatedOrders = orders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus as 'PENDING' | 'PREPARED' | 'DELIVERED' | 'CANCELLED' } : order
      );
      setOrders(updatedOrders);
      
      toast.success(`Order #${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error("Failed to update order status");
    }
  };
  return (
    <CashierOnly>
      <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Cashier Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage orders efficiently and provide great service</p>
        </div>        <div className="flex items-center space-x-4">
          <Button onClick={loadOrders} variant="outline" size="sm">
            <IconRefresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <div className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
            Cashier Mode
          </Badge>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
            <IconCurrencyDollar className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {stats.todaysSales.toLocaleString()}</div>
            <p className="text-blue-100 text-sm mt-1">
              +24% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <IconShoppingCart className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todaysOrders.length}</div>
            <p className="text-green-100 text-sm mt-1">
              {stats.ordersProcessed} processed
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
            <IconClock className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingOrders}</div>
            <p className="text-orange-100 text-sm mt-1">
              Need confirmation
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <IconCheck className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedOrders}</div>
            <p className="text-purple-100 text-sm mt-1">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>      {/* Today's Orders - Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>                  <CardTitle className="text-xl">Today&apos;s Orders</CardTitle>
                  <CardDescription>
                    {todaysOrders.length} orders • {todaysOrders.filter(o => o.status === 'PENDING').length} pending confirmation
                  </CardDescription>
                </div>                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PREPARED">Prepared</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Payments</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Scrollable Orders List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading orders...</p>
                  </div>
                ) : todaysOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <IconShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders today</h3>
                    <p className="text-gray-500">Orders will appear here as they come in</p>
                  </div>
                ) : (
                  todaysOrders.map((order) => (
                    <Card key={order.orderId} className={`border-l-4 transition-all hover:shadow-md ${
                      order.status === 'PENDING' ? 'border-l-yellow-500 bg-yellow-50' :
                      order.status === 'PREPARED' ? 'border-l-blue-500 bg-blue-50' :
                      order.status === 'DELIVERED' ? 'border-l-green-500 bg-green-50' :
                      'border-l-red-500 bg-red-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge variant="outline" className="font-mono">
                                #{order.orderId}
                              </Badge>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(order.orderDate).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-gray-900">{order.user.fullName}</p>
                                <p className="text-sm text-gray-500">{order.user.email}</p>
                              </div>
                              <div className="text-right md:text-left">
                                <p className="text-sm text-gray-500">Order Total</p>
                                <p className="font-bold text-lg text-gray-900">
                                  Rp {calculateOrderTotal(order).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-600 mb-2">
                                {order.orderDetails.length} item(s):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {order.orderDetails.slice(0, 3).map((detail, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {detail.quantity}x {detail.product.name}
                                  </Badge>
                                ))}
                                {order.orderDetails.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{order.orderDetails.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderDialogOpen(true);
                              }}
                            >
                              <IconEye className="w-4 h-4 mr-2" />
                              View
                            </Button>

                            {order.status === 'PENDING' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => quickUpdateStatus(order.orderId, 'PREPARED')}
                              >
                                <IconCheck className="w-4 h-4 mr-2" />
                                Confirm
                              </Button>
                            )}

                            {order.status === 'PREPARED' && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => quickUpdateStatus(order.orderId, 'DELIVERED')}
                              >
                                <IconCheck className="w-4 h-4 mr-2" />
                                Complete
                              </Button>
                            )}

                            {(order.status === 'PENDING' || order.status === 'PREPARED') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setNewOrderStatus(order.status);
                                  setIsUpdateStatusDialogOpen(true);
                                }}
                              >
                                <IconEdit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Queue Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Pending</span>
                  </div>
                  <Badge variant="secondary">
                    {todaysOrders.filter(o => o.status === 'PENDING').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Preparing</span>
                  </div>
                  <Badge variant="secondary">
                    {todaysOrders.filter(o => o.status === 'PREPARED').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Completed</span>
                  </div>
                  <Badge variant="secondary">
                    {todaysOrders.filter(o => o.status === 'DELIVERED').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysOrders.slice(0, 5).map((order) => (
                  <div key={order.orderId} className="flex items-center space-x-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-500' :
                      order.status === 'PREPARED' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <span className="flex-1">Order #{order.orderId}</span>
                    <span className="text-gray-500">
                      {new Date(order.orderDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <IconPlus className="w-4 h-4 mr-2" />
                      New Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Order</DialogTitle>
                      <DialogDescription>
                        Create a new order for a customer
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <IconShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">New order creation feature</p>
                        <p className="text-sm text-gray-400">This would integrate with the POS system</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full" onClick={loadOrders}>
                  <IconRefresh className="w-4 h-4 mr-2" />
                  Refresh Orders
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.print()}
                >
                  <IconPrinter className="w-4 h-4 mr-2" />
                  Print Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.orderId}</DialogTitle>
            <DialogDescription>
              Complete order information and history
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm">{selectedOrder.user.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{selectedOrder.user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Username</Label>
                      <p className="text-sm">{selectedOrder.user.username}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Order Date</Label>
                      <p className="text-sm">
                        {new Date(selectedOrder.orderDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Amount</Label>
                      <p className="text-sm font-bold">
                        Rp {calculateOrderTotal(selectedOrder).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.orderDetails.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {detail.product.name}
                          </TableCell>
                          <TableCell>{detail.product.category.name}</TableCell>
                          <TableCell>{detail.quantity}</TableCell>
                          <TableCell>Rp {detail.unitPrice.toLocaleString()}</TableCell>
                          <TableCell>
                            Rp {(detail.unitPrice * detail.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrder.payments.length === 0 ? (
                    <p className="text-gray-500">No payment information available</p>
                  ) : (                    <div className="space-y-4">
                      {selectedOrder.payments.map((payment) => (
                        <div key={payment.paymentId} className="border rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Type</Label>
                              <p className="text-sm">{payment.type}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Amount</Label>
                              <p className="text-sm">Rp {payment.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Status</Label>
                              <Badge className={getPaymentStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Date</Label>
                              <p className="text-sm">
                                {new Date(payment.paymentDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {payment.transactionId && (
                            <div className="mt-2">
                              <Label className="text-sm font-medium">Transaction ID</Label>
                              <p className="text-sm">{payment.transactionId}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <IconPrinter className="w-4 h-4 mr-2" />
              Print Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order #{selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newOrderStatus} onValueChange={setNewOrderStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PREPARED">Prepared</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUpdateStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedOrder && updateOrderStatus(selectedOrder.orderId, newOrderStatus)}
              disabled={!newOrderStatus || newOrderStatus === selectedOrder?.status}
            >
              Update Status
            </Button>
          </DialogFooter>        </DialogContent>
      </Dialog>
    </div>
    </CashierOnly>
  );
};

export default CashierDashboard;
