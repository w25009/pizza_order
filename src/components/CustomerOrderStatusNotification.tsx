import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { OrderStatus } from '../types';
import {
  Clock,
  ChefHat,
  Flame,
  Truck,
  CheckCircle2,
  X,
  ArrowRight,
  Pizza
} from 'lucide-react';

interface CustomerOrderStatusNotificationProps {
  onTrackOrder: () => void;
}

export const CustomerOrderStatusNotification: React.FC<CustomerOrderStatusNotificationProps> = ({
  onTrackOrder
}) => {
  const { language, latestCustomerStatusAlert, dismissCustomerStatusAlert } = useApp();

  useEffect(() => {
    if (latestCustomerStatusAlert) {
      const timer = setTimeout(() => {
        dismissCustomerStatusAlert();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [latestCustomerStatusAlert, dismissCustomerStatusAlert]);

  if (!latestCustomerStatusAlert) return null;

  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return {
          title: getTranslation(language, 'shopReceived'),
          desc: getTranslation(language, 'shopReceivedDesc'),
          icon: <Clock className="w-6 h-6 text-amber-500" />
        };
      case 'preparing':
        return {
          title: getTranslation(language, 'kitchenPreparing'),
          desc: getTranslation(language, 'kitchenPreparingDesc'),
          icon: <ChefHat className="w-6 h-6 text-blue-500" />
        };
      case 'baking':
        return {
          title: getTranslation(language, 'bakingInOven'),
          desc: getTranslation(language, 'bakingInOvenDesc'),
          icon: <Flame className="w-6 h-6 text-orange-500" />
        };
      case 'out_for_delivery':
      case 'ready_for_pickup':
        return {
          title: getTranslation(language, 'outForDelivery'),
          desc: getTranslation(language, 'outForDeliveryDesc'),
          icon: <Truck className="w-6 h-6 text-purple-500" />
        };
      case 'delivered':
        return {
          title: getTranslation(language, 'orderDelivered'),
          desc: getTranslation(language, 'orderDeliveredDesc'),
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        };
      default:
        return {
          title: 'Order Status Updated',
          desc: `Your order #${latestCustomerStatusAlert.orderNumber} status changed.`,
          icon: <Pizza className="w-6 h-6 text-[#E67E22]" />
        };
    }
  };

  const details = getStatusDetails(latestCustomerStatusAlert.status);

  return (
    <div className="fixed top-20 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-bounceIn">
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-4 shadow-2xl border border-[#E67E22] flex items-start justify-between space-x-3">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1F1510] border border-[#E8E1D9] dark:border-[#443228] shrink-0 mt-0.5">
            {details.icon}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm font-serif text-[#3D2B1F] dark:text-[#F5E6D3]">
                {details.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E67E22]/20 text-[#E67E22] font-bold">
                #{latestCustomerStatusAlert.orderNumber}
              </span>
            </div>
            <p className="text-xs text-[#5C4033] dark:text-[#E8DCD0] leading-snug">
              {details.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => {
              onTrackOrder();
              dismissCustomerStatusAlert();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#E67E22] text-white font-bold text-xs flex items-center space-x-1 shadow-sm hover:bg-[#D36E17] transition-all"
          >
            <span>{getTranslation(language, 'trackLiveOrder')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={dismissCustomerStatusAlert}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
