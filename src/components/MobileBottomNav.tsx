import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import {
  Pizza as PizzaIcon,
  ShoppingBag,
  LayoutDashboard,
  Boxes,
  User as UserIcon
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'menu' | 'orders' | 'dashboard' | 'inventory' | 'profile';
  setActiveTab: (tab: 'menu' | 'orders' | 'dashboard' | 'inventory' | 'profile') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { language, currentUser, orders } = useApp();
  const isStaff = currentUser.role === 'staff' || currentUser.role === 'admin';

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#2D201A]/95 backdrop-blur-md border-t border-[#E8E1D9] dark:border-[#443228] z-40 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('menu')}
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
          activeTab === 'menu'
            ? 'text-[#E67E22] font-bold'
            : 'text-[#8B735B] dark:text-[#A6998A]'
        }`}
      >
        <PizzaIcon className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{getTranslation(language, 'menu')}</span>
      </button>

      <button
        onClick={() => setActiveTab('orders')}
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors relative ${
          activeTab === 'orders'
            ? 'text-[#E67E22] font-bold'
            : 'text-[#8B735B] dark:text-[#A6998A]'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{getTranslation(language, 'myOrders')}</span>
        {activeOrdersCount > 0 && (
          <span className="absolute top-0 right-2 w-2 h-2 bg-[#E67E22] rounded-full" />
        )}
      </button>

      {isStaff && (
        <>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'dashboard'
                ? 'text-[#E67E22] font-bold'
                : 'text-[#8B735B] dark:text-[#A6998A]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{getTranslation(language, 'dashboard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'inventory'
                ? 'text-[#E67E22] font-bold'
                : 'text-[#8B735B] dark:text-[#A6998A]'
            }`}
          >
            <Boxes className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{getTranslation(language, 'inventory')}</span>
          </button>
        </>
      )}

      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
          activeTab === 'profile'
            ? 'text-[#E67E22] font-bold'
            : 'text-[#8B735B] dark:text-[#A6998A]'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{getTranslation(language, 'profile')}</span>
      </button>
    </nav>
  );
};
