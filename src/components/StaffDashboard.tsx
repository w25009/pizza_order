import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { formatYen } from '../utils/formatters';
import { Order, OrderStatus } from '../types';
import {
  Clock,
  CheckCircle,
  Truck,
  Flame,
  ChefHat,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  Search,
  ArrowRight,
  Filter,
  XCircle,
  Phone,
  MapPin,
  Maximize2
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { language, orders, updateOrderStatus, cancelOrder } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status map details
  const statusFlow: OrderStatus[] = [
    'received',
    'preparing',
    'baking',
    'out_for_delivery',
    'delivered'
  ];

  const statusIcons: Record<OrderStatus, React.ReactNode> = {
    received: <Clock className="w-4 h-4 text-amber-500" />,
    preparing: <ChefHat className="w-4 h-4 text-blue-500" />,
    baking: <Flame className="w-4 h-4 text-orange-500" />,
    out_for_delivery: <Truck className="w-4 h-4 text-purple-500" />,
    ready_for_pickup: <ShoppingBag className="w-4 h-4 text-emerald-500" />,
    delivered: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    cancelled: <XCircle className="w-4 h-4 text-rose-500" />
  };

  const getNextStatus = (current: OrderStatus, orderType: string): OrderStatus | null => {
    if (current === 'received') return 'preparing';
    if (current === 'preparing') return 'baking';
    if (current === 'baking') return orderType === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup';
    if (current === 'out_for_delivery' || current === 'ready_for_pickup') return 'delivered';
    return null;
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'active') {
      return order.status !== 'delivered' && order.status !== 'cancelled';
    }
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // Analytics Metrics
  const todayRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const pendingCount = orders.filter((o) => o.status === 'received').length;
  const completedCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 border border-[#E8E1D9] dark:border-[#443228] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <ChefHat className="w-7 h-7 text-[#E67E22]" />
              <h1 className="text-2xl font-extrabold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
                {getTranslation(language, 'staffDashboardTitle')}
              </h1>
            </div>
            <p className="text-xs text-[#8B735B] dark:text-[#E8DCD0] mt-1">
              Live real-time order queue with instant kitchen status controls
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#E67E22]/10 dark:bg-[#E67E22]/20 p-3 rounded-xl border border-[#E67E22]/30">
              <span className="text-[11px] font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] block">
                {getTranslation(language, 'totalRevenue')}
              </span>
              <span className="text-lg font-extrabold text-[#E67E22]">
                {formatYen(todayRevenue)}
              </span>
            </div>

            <div className="bg-[#8B735B]/10 dark:bg-[#8B735B]/20 p-3 rounded-xl border border-[#8B735B]/30">
              <span className="text-[11px] font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] block">
                {getTranslation(language, 'activeOrders')}
              </span>
              <span className="text-lg font-extrabold text-[#8B735B] dark:text-[#F5E6D3]">
                {activeCount}
              </span>
            </div>

            <div className="bg-rose-500/10 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-300 dark:border-rose-800">
              <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 block">
                {getTranslation(language, 'pendingCount')}
              </span>
              <span className="text-lg font-extrabold text-rose-700 dark:text-rose-400">
                {pendingCount}
              </span>
            </div>

            <div className="bg-[#4A7C59]/10 dark:bg-[#4A7C59]/20 p-3 rounded-xl border border-[#4A7C59]/30">
              <span className="text-[11px] font-semibold text-[#4A7C59] dark:text-[#A3D1AF] block">
                {getTranslation(language, 'completedToday')}
              </span>
              <span className="text-lg font-extrabold text-[#4A7C59] dark:text-[#A3D1AF]">
                {completedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F3EFE9] dark:border-[#443228]">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'active', label: 'Active Queue' },
              { id: 'all', label: 'All Orders' },
              { id: 'received', label: 'Received' },
              { id: 'preparing', label: 'Preparing' },
              { id: 'baking', label: 'Baking' },
              { id: 'out_for_delivery', label: 'Delivery/Pickup' },
              { id: 'delivered', label: 'Completed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#E67E22] text-white shadow-xs'
                    : 'bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#E8E1D9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8B735B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white text-xs focus:ring-2 focus:ring-[#E67E22] outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Orders Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-[#2D201A] rounded-2xl border border-[#E8E1D9] dark:border-[#443228] text-[#8B735B]">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No orders matching current filter</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const nextStatus = getNextStatus(order.status, order.orderType);

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-[#2D201A] rounded-2xl p-4 border transition-all shadow-xs flex flex-col justify-between ${
                  order.status === 'received'
                    ? 'border-[#E67E22] dark:border-[#E67E22] ring-2 ring-[#E67E22]/20'
                    : 'border-[#E8E1D9] dark:border-[#443228]'
                }`}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-extrabold text-sm text-[#3D2B1F] dark:text-[#F5E6D3]">
                      #{order.orderNumber}
                    </span>
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3]">
                      {statusIcons[order.status]}
                      <span className="capitalize">{order.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="text-xs text-[#5C4033] dark:text-[#E8DCD0] space-y-1 mb-3">
                    <p className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">
                      {order.customerName}
                    </p>
                    <p className="flex items-center space-x-1 text-[#8B735B]">
                      <Phone className="w-3 h-3" />
                      <span>{order.customerPhone}</span>
                    </p>
                    {order.deliveryAddress && (
                      <p className="flex items-center space-x-1 text-[#8B735B] line-clamp-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{order.deliveryAddress}</span>
                      </p>
                    )}
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1510] text-xs space-y-1.5 mb-3 border border-[#E8E1D9]/50 dark:border-[#443228]/50">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-medium text-[#3D2B1F] dark:text-[#F5E6D3]">
                          {item.count}x {item.pizzaName[language]} ({item.size})
                        </span>
                        <span className="text-[#8B735B] font-mono">
                          {formatYen(item.pricePerUnit * item.count)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-[11px] text-[#3D2B1F] dark:text-[#F5E6D3] italic mb-3 bg-[#F3EFE9] dark:bg-[#3D2B1F] p-2 rounded-lg border border-[#E8E1D9] dark:border-[#443228]">
                      Note: "{order.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-[#F3EFE9] dark:border-[#443228] flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-[#8B735B] block text-[10px]">Total</span>
                    <span className="font-extrabold text-[#E67E22]">
                      {formatYen(order.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-xl bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#E8E1D9] transition-colors"
                      title="Inspect Details"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {nextStatus && (
                      <button
                        onClick={() => updateOrderStatus(order.id, nextStatus)}
                        className="px-3 py-1.5 rounded-xl bg-[#4A7C59] hover:bg-[#3d6849] text-white font-bold text-xs flex items-center space-x-1 shadow-xs active:scale-95 transition-all"
                      >
                        <span>Advance</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Order Details #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Customer: {selectedOrder.customerName}
                </p>
                <p>Phone: {selectedOrder.customerPhone}</p>
                <p>
                  Type:{' '}
                  <span className="uppercase font-semibold text-amber-600">
                    {selectedOrder.orderType}
                  </span>
                </p>
                {selectedOrder.deliveryAddress && (
                  <p>Address: {selectedOrder.deliveryAddress}</p>
                )}
                <p>Payment: {selectedOrder.paymentMethod.replace('_', ' ')}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((i, idx) => (
                    <div
                      key={idx}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {i.count}x {i.pizzaName[language]}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Size {i.size}, {i.crust} crust{' '}
                          {i.extraToppings.length > 0 && `+ ${i.extraToppings.join(', ')}`}
                        </p>
                      </div>
                      <span className="font-mono font-bold">
                        {formatYen(i.pricePerUnit * i.count)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <button
                onClick={() => {
                  cancelOrder(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-semibold text-xs hover:bg-rose-50"
              >
                Cancel Order
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
