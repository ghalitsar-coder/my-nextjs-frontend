'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CashierOnly } from "@/components/role-guard";
import { 
  IconCurrencyDollar, 
  IconShoppingCart, 
  IconClock,
  IconEye,
  IconSearch,
  IconRefresh,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconShoppingBag,
  IconChevronLeft,
  IconChevronRight,
  IconFilter
} from "@tabler/icons-react";
import { toast } from "sonner";
import { orderApi, Order } from "@/lib/api";
import { format, isToday, isYesterday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'PREPARING':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'READY':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Payment status color mapping
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
    case 'SETTLEMENT':
    case 'CAPTURE':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'FAILED':
    case 'DENY':
    case 'CANCEL':
    case 'EXPIRE':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

interface Statistics {
  totalOrders: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

const CashierOrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Statistics state
  const [statistics, setStatistics] = useState<Statistics>({
    totalOrders: 0,
    todayOrders: 0,
    weekOrders: 0,
    monthOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });

  // Load orders and calculate statistics
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await orderApi.getAll();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      calculateStatistics(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate comprehensive statistics
  const calculateStatistics = (ordersData: Order[]) => {
    const now = new Date();
    
    // Filter orders by date ranges
    const todayOrders = ordersData.filter(order => isToday(parseISO(order.orderDate)));
    const weekOrders = ordersData.filter(order => isThisWeek(parseISO(order.orderDate)));
    const monthOrders = ordersData.filter(order => isThisMonth(parseISO(order.orderDate)));
    
    // Calculate revenue for each period
    const calculateRevenue = (orders: Order[]) => {
      return orders.reduce((sum, order) => {
        const orderRevenue = order.payments
          .filter(payment => payment.status === 'COMPLETED' || payment.status === 'SETTLEMENT')
          .reduce((total, payment) => total + payment.amount, 0);
        return sum + orderRevenue;
      }, 0);
    };

    const totalRevenue = calculateRevenue(ordersData);
    const todayRevenue = calculateRevenue(todayOrders);
    const weekRevenue = calculateRevenue(weekOrders);
    const monthRevenue = calculateRevenue(monthOrders);

    // Calculate other statistics
    const pendingOrders = ordersData.filter(order => order.status === 'PENDING').length;
    const completedOrders = ordersData.filter(order => order.status === 'DELIVERED').length;
    const cancelledOrders = ordersData.filter(order => order.status === 'CANCELLED').length;
    const averageOrderValue = ordersData.length > 0 ? totalRevenue / ordersData.length : 0;

    setStatistics({
      totalOrders: ordersData.length,
      todayOrders: todayOrders.length,
      weekOrders: weekOrders.length,
      monthOrders: monthOrders.length,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      averageOrderValue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
    });
  };

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(searchTerm) ||
        order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply payment filter
    if (paymentFilter !== 'ALL') {
      filtered = filtered.filter(order => {
        return order.payments.some(payment => payment.status === paymentFilter);
      });
    }

    // Apply date filter
    if (dateFilter !== 'ALL') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = parseISO(order.orderDate);
        switch (dateFilter) {
          case 'TODAY':
            return isToday(orderDate);
          case 'YESTERDAY':
            return isYesterday(orderDate);
          case 'WEEK':
            return isThisWeek(orderDate);
          case 'MONTH':
            return isThisMonth(orderDate);
          default:
            return true;
        }
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, itemsPerPage]);

  // Get paginated orders
  const getPaginatedOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  };

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Calculate order total
  const calculateOrderTotal = (order: Order) => {
    return order.orderDetails.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice) - item.discount;
    }, 0);
  };

  const StatCard = ({ title, value, icon: Icon, subtitle, trend }: {
    title: string;
    value: string | number;
    icon: any;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' && title.includes('Revenue') 
            ? formatCurrency(value) 
            : value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' && <IconTrendingUp className="h-3 w-3 mr-1" />}
            {trend === 'down' && <IconTrendingDown className="h-3 w-3 mr-1" />}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <CashierOnly>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground">
              Complete order history with detailed analytics
            </p>
          </div>
          <Button onClick={loadOrders} disabled={isLoading}>
            <IconRefresh className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={statistics.totalOrders}
            icon={IconShoppingCart}
            subtitle="All time"
          />
          <StatCard
            title="Today's Orders"
            value={statistics.todayOrders}
            icon={IconCalendar}
            subtitle={`${statistics.todayOrders} orders today`}
          />
          <StatCard
            title="Total Revenue"
            value={statistics.totalRevenue}
            icon={IconCurrencyDollar}
            subtitle="All time revenue"
          />
          <StatCard
            title="Today's Revenue"
            value={statistics.todayRevenue}
            icon={IconTrendingUp}
            subtitle={formatCurrency(statistics.todayRevenue)}
          />
          <StatCard
            title="Average Order Value"
            value={statistics.averageOrderValue}
            icon={IconShoppingBag}
            subtitle="Per order average"
          />
          <StatCard
            title="Pending Orders"
            value={statistics.pendingOrders}
            icon={IconClock}
            subtitle="Awaiting processing"
          />
          <StatCard
            title="Completed Orders"
            value={statistics.completedOrders}
            icon={IconShoppingCart}
            subtitle="Successfully delivered"
          />
          <StatCard
            title="Weekly Revenue"
            value={statistics.weekRevenue}
            icon={IconTrendingUp}
            subtitle="This week's total"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFilter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PREPARING">Preparing</SelectItem>
                    <SelectItem value="READY">Ready</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Payments</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Time</SelectItem>
                    <SelectItem value="TODAY">Today</SelectItem>
                    <SelectItem value="YESTERDAY">Yesterday</SelectItem>
                    <SelectItem value="WEEK">This Week</SelectItem>
                    <SelectItem value="MONTH">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Results</label>
                <p className="text-sm text-muted-foreground pt-2">
                  {filteredOrders.length} orders found
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              Detailed view of all orders with pagination
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <IconRefresh className="h-6 w-6 animate-spin mr-2" />
                Loading orders...
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedOrders().map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-medium">
                          #{order.orderId}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{order.user?.fullName || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.user?.email || 'No email'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {format(parseISO(order.orderDate), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(order.orderDate), 'HH:mm')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.payments.map((payment, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className={getPaymentStatusColor(payment.status)}
                              >
                                {payment.type}: {payment.status}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(calculateOrderTotal(order))}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {order.orderDetails.length} items
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <IconEye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>
                                  Order Details #{order.orderId}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete order information and payment details
                                </DialogDescription>
                              </DialogHeader>
                              
                              <ScrollArea className="max-h-[60vh]">
                                <div className="space-y-6">
                                  {/* Customer Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Customer Information</h4>
                                    <div className="bg-muted p-3 rounded-lg space-y-2">
                                      <p><span className="font-medium">Name:</span> {order.user?.fullName || 'Unknown'}</p>
                                      <p><span className="font-medium">Email:</span> {order.user?.email || 'No email'}</p>
                                      <p><span className="font-medium">Order Date:</span> {format(parseISO(order.orderDate), 'PPp')}</p>
                                    </div>
                                  </div>

                                  {/* Order Status */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Order Status</h4>
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status}
                                    </Badge>
                                  </div>

                                  {/* Order Items */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Order Items</h4>
                                    <div className="space-y-3">
                                      {order.orderDetails.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                          <div className="flex-1">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                              {formatCurrency(item.unitPrice)} × {item.quantity}
                                            </p>
                                            {item.discount > 0 && (
                                              <p className="text-sm text-green-600">
                                                Discount: -{formatCurrency(item.discount)}
                                              </p>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <p className="font-medium">
                                              {formatCurrency((item.quantity * item.unitPrice) - item.discount)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Payment Information */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Payment Information</h4>
                                    <div className="space-y-3">
                                      {order.payments.map((payment, index) => (
                                        <div key={index} className="p-3 bg-muted rounded-lg">
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{payment.type}</span>
                                            <Badge className={getPaymentStatusColor(payment.status)}>
                                              {payment.status}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span>Amount:</span>
                                            <span className="font-medium">{formatCurrency(payment.amount)}</span>
                                          </div>
                                          {payment.paymentDate && (
                                            <div className="flex justify-between items-center mt-1">
                                              <span className="text-sm text-muted-foreground">Payment Date:</span>
                                              <span className="text-sm text-muted-foreground">
                                                {format(parseISO(payment.paymentDate), 'PPp')}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Order Total */}
                                  <Separator />
                                  <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Total Order Value:</span>
                                    <span>{formatCurrency(calculateOrderTotal(order))}</span>
                                  </div>
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <IconChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNumber = i + 1;
                          const isCurrentPage = pageNumber === currentPage;
                          
                          return (
                            <Button
                              key={pageNumber}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                        {totalPages > 5 && (
                          <>
                            <span className="text-muted-foreground">...</span>
                            <Button
                              variant={currentPage === totalPages ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(totalPages)}
                              className="w-8 h-8 p-0"
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <IconChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {filteredOrders.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <IconShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </CashierOnly>
  );
};

export default CashierOrderHistory;
