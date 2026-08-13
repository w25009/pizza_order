import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { formatYen } from '../utils/formatters';
import { OrderStatus } from '../types';
import {
  Clock,
  ChefHat,
  Flame,
  Truck,
  CheckCircle2,
  ShoppingBag,
  RotateCcw,
  MapPin,
  Calendar,
  Phone,
  Trash2,
  AlertTriangle,
  X,
  Zap,
  Play,
  Pause
} from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const {
    language,
    orders,
    currentUser,
    addToCart,
    deleteOrder,
    clearOrderHistory,
    updateOrderStatus
  } = useApp();

  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [autoSimulate, setAutoSimulate] = useState(true);

  // Find customer's active orders or all history
  const customerOrders = orders.filter(
    (o) => o.customerId === currentUser.id || o.customerId === 'usr-customer-1'
  );

  const activeOrder = customerOrders.find(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  const steps: { status: OrderStatus; labelKey: keyof typeof import('../i18n/translations').translations.en; icon: React.ReactNode }[] = [
    { status: 'received', labelKey: 'statusReceived', icon: <Clock className="w-5 h-5" /> },
    { status: 'preparing', labelKey: 'statusPreparing', icon: <ChefHat className="w-5 h-5" /> },
    { status: 'baking', labelKey: 'statusBaking', icon: <Flame className="w-5 h-5" /> },
    { status: 'out_for_delivery', labelKey: 'statusOutForDelivery', icon: <Truck className="w-5 h-5" /> },
    { status: 'delivered', labelKey: 'statusDelivered', icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'received') return 0;
    if (status === 'preparing') return 1;
    if (status === 'baking') return 2;
    if (status === 'out_for_delivery' || status === 'ready_for_pickup') return 3;
    if (status === 'delivered') return 4;
    return -1;
  };

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      addToCart({
        pizzaId: item.pizzaId,
        pizzaName: item.pizzaName,
        image: item.image,
        size: item.size,
        crust: item.crust,
        extraToppings: item.extraToppings,
        count: item.count,
        pricePerUnit: item.pricePerUnit
      });
    });
    alert('Items added to cart!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 border border-[#E8E1D9] dark:border-[#443228] shadow-xs">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-7 h-7 text-[#E67E22]" />
          <div>
            <h1 className="text-2xl font-extrabold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
              {getTranslation(language, 'orderTracker')}
            </h1>
            <p className="text-xs text-[#8B735B] dark:text-[#A6998A]">
              {getTranslation(language, 'driverStatus')}
            </p>
          </div>
        </div>
      </div>

      {/* Active Live Order Tracker Section */}
      {activeOrder ? (
        <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 sm:p-6 border border-[#E67E22] dark:border-[#E67E22] shadow-lg space-y-6">
          {/* Active Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3EFE9] dark:border-[#443228] pb-4">
            <div>
              <span className="text-xs font-semibold text-[#8B735B] uppercase tracking-wider block">
                {getTranslation(language, 'orderNumber')}
              </span>
              <span className="text-xl font-mono font-extrabold text-[#3D2B1F] dark:text-[#F5E6D3]">
                {activeOrder.orderNumber}
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-[#E67E22]/15 px-3 py-1.5 rounded-xl border border-[#E67E22]/30">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E67E22] animate-ping" />
              <span className="text-xs font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">
                {getTranslation(language, 'estimatedTime')}: ~{activeOrder.estimatedMinutes} {getTranslation(language, 'mins')}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-4">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E8E1D9] dark:bg-[#443228] -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E67E22] transition-all duration-700 -z-0"
                style={{
                  width: `${(getStepIndex(activeOrder.status) / (steps.length - 1)) * 100}%`
                }}
              />

              {steps.map((step, idx) => {
                const currentIndex = getStepIndex(activeOrder.status);
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#E67E22] text-white ring-4 ring-[#E67E22]/30 scale-110'
                          : isCompleted
                          ? 'bg-[#E67E22] text-white'
                          : 'bg-[#E8E1D9] dark:bg-[#443228] text-[#8B735B]'
                      }`}
                    >
                      {step.icon}
                    </div>

                    <span
                      className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] hidden sm:block ${
                        isCurrent
                          ? 'text-[#E67E22] font-bold'
                          : isCompleted
                          ? 'text-[#3D2B1F] dark:text-[#F5E6D3]'
                          : 'text-[#8B735B]'
                      }`}
                    >
                      {getTranslation(language, step.labelKey)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items List in Active Order */}
          <div className="bg-[#FAF7F2] dark:bg-[#1F1510] p-4 rounded-xl space-y-2 border border-[#E8E1D9] dark:border-[#443228]">
            <h4 className="text-xs font-bold text-[#3D2B1F] dark:text-[#F5E6D3] uppercase">
              {getTranslation(language, 'itemsOrdered')}
            </h4>
            <div className="divide-y divide-[#E8E1D9] dark:divide-[#443228]">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.image}
                      alt={item.pizzaName[language]}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">
                        {item.count}x {item.pizzaName[language]}
                      </span>
                      <span className="text-[10px] text-[#8B735B] block">
                        Size {item.size}, {item.crust} crust
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-[#E67E22]">
                    {formatYen(item.pricePerUnit * item.count)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E8E1D9] dark:border-[#443228] flex justify-between items-center text-xs">
              <span className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">
                {getTranslation(language, 'total')}
              </span>
              <span className="text-base font-extrabold text-[#E67E22]">
                {formatYen(activeOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-8 text-center border border-[#E8E1D9] dark:border-[#443228] text-[#8B735B]">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#E67E22]" />
          <p className="text-sm font-semibold text-[#3D2B1F] dark:text-[#F5E6D3]">
            No active orders right now.
          </p>
          <p className="text-xs text-[#8B735B] mt-1">
            Choose a pizza from the menu to place a live order!
          </p>
        </div>
      )}

      {/* Historic Customer Orders List */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 border border-[#E8E1D9] dark:border-[#443228] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
            {getTranslation(language, 'orderHistory')}
          </h3>

          {customerOrders.length > 0 && (
            <button
              onClick={() => setShowClearHistoryModal(true)}
              className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'clearHistory')}</span>
            </button>
          )}
        </div>

        {customerOrders.length === 0 ? (
          <p className="text-xs text-[#8B735B] py-4">{getTranslation(language, 'noOrdersYet')}</p>
        ) : (
          <div className="space-y-3">
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-[#FAF7F2] dark:bg-[#1F1510] rounded-xl border border-[#E8E1D9] dark:border-[#443228] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#3D2B1F] dark:text-[#F5E6D3] text-sm">
                      #{order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4A7C59]/15 text-[#4A7C59] dark:text-[#A3D1AF] capitalize">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8B735B] mt-1 block">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3">
                  <span className="font-extrabold font-mono text-sm text-[#3D2B1F] dark:text-[#F5E6D3]">
                    {formatYen(order.totalAmount)}
                  </span>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3 py-1.5 rounded-xl bg-[#E67E22] hover:bg-[#D36E17] text-white font-bold text-xs flex items-center space-x-1 shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{getTranslation(language, 'reorder')}</span>
                  </button>

                  {deletingOrderId === order.id ? (
                    <div className="flex items-center space-x-1 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-xl border border-rose-300 dark:border-rose-800">
                      <button
                        onClick={() => {
                          deleteOrder(order.id);
                          setDeletingOrderId(null);
                        }}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeletingOrderId(null)}
                        className="p-1 text-[#8B735B] hover:text-[#3D2B1F] dark:text-gray-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingOrderId(order.id)}
                      className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                      title={getTranslation(language, 'deleteOrder')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clear All History */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#2D201A] rounded-2xl max-w-md w-full p-6 border border-[#E8E1D9] dark:border-[#443228] shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/80 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#3D2B1F] dark:text-[#F5E6D3]">
                {getTranslation(language, 'deleteHistory')}
              </h3>
            </div>

            <p className="text-xs text-[#5C4033] dark:text-[#E8DCD0]">
              {getTranslation(language, 'deleteHistoryConfirm')}
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowClearHistoryModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] text-xs font-bold text-[#5C4033] dark:text-[#F5E6D3] hover:bg-[#FAF7F2] dark:hover:bg-[#1F1510] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearOrderHistory(currentUser.id);
                  setShowClearHistoryModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                {getTranslation(language, 'clearHistory')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
