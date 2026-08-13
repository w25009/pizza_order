import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import {
  Pizza as PizzaIcon,
  ShoppingBag,
  Sun,
  Moon,
  Globe,
  User as UserIcon,
  LayoutDashboard,
  Boxes,
  Bell,
  SlidersHorizontal,
  LogOut,
  Trash2,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'menu' | 'orders' | 'dashboard' | 'inventory' | 'profile';
  setActiveTab: (tab: 'menu' | 'orders' | 'dashboard' | 'inventory' | 'profile') => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenAuth
}) => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    currentUser,
    cart,
    orders,
    notifications,
    markNotificationsRead,
    deleteNotification,
    clearAllNotifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.count, 0);
  const isStaff = currentUser.role === 'staff' || currentUser.role === 'admin';

  // Count active customer orders
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#2D201A]/95 backdrop-blur-md border-b border-[#E8E1D9] dark:border-[#443228] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('menu')}
          >
            <div className="p-2 rounded-xl bg-[#E67E22] text-white shadow-md group-hover:scale-105 transition-transform">
              <PizzaIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
                {getTranslation(language, 'appName')}
              </span>
              <span className="hidden sm:block text-xs text-[#8B735B] dark:text-[#E8DCD0] font-medium">
                {getTranslation(language, 'subTitle')}
              </span>
            </div>
          </div>

          {/* Nav Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'menu'
                  ? 'bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] font-bold'
                  : 'text-[#5C4033] dark:text-[#E8DCD0] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F]/60'
              }`}
            >
              <PizzaIcon className="w-4 h-4 text-[#E67E22]" />
              <span>{getTranslation(language, 'menu')}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 relative ${
                activeTab === 'orders'
                  ? 'bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] font-bold'
                  : 'text-[#5C4033] dark:text-[#E8DCD0] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F]/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#E67E22]" />
              <span>{getTranslation(language, 'myOrders')}</span>
              {activeOrdersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-[#E67E22] text-white rounded-full">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {isStaff && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] font-bold'
                      : 'text-[#5C4033] dark:text-[#E8DCD0] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F]/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#4A7C59]" />
                  <span>{getTranslation(language, 'dashboard')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'inventory'
                      ? 'bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] font-bold'
                      : 'text-[#5C4033] dark:text-[#E8DCD0] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F]/60'
                  }`}
                >
                  <Boxes className="w-4 h-4 text-[#8B735B]" />
                  <span>{getTranslation(language, 'inventory')}</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'profile'
                  ? 'bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] font-bold'
                  : 'text-[#5C4033] dark:text-[#E8DCD0] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F]/60'
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#E67E22]" />
              <span>{getTranslation(language, 'profile')}</span>
            </button>
          </nav>

          {/* Controls: Lang, Theme, Cart, Role & User */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (unreadNotifs > 0) markNotificationsRead();
                }}
                className="p-2 rounded-lg text-[#5C4033] dark:text-[#F5E6D3] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F] relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E67E22] rounded-full animate-ping" />
                )}
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E67E22] rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#2D201A] rounded-2xl shadow-xl border border-[#E8E1D9] dark:border-[#443228] p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F3EFE9] dark:border-[#443228]">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-[#3D2B1F] dark:text-[#F5E6D3]">
                        Notifications
                      </span>
                      {notifications.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E67E22]/15 text-[#E67E22]">
                          {notifications.length}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
                          title="Clear all notifications"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear All</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-[#8B735B] hover:text-[#3D2B1F] dark:hover:text-white p-1 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#8B735B] dark:text-[#A6998A] py-3 text-center">
                      No notifications yet
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (n.orderId) setActiveTab('orders');
                            setShowNotifications(false);
                          }}
                          className={`group relative p-2.5 rounded-xl text-xs transition-all border cursor-pointer hover:shadow-xs ${
                            !n.read
                              ? 'bg-[#E67E22]/10 dark:bg-[#E67E22]/20 border-[#E67E22]/40'
                              : 'bg-[#FAF7F2] dark:bg-[#1F1510] border-[#E8E1D9] dark:border-[#443228]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <p className="font-bold text-[#E67E22] pr-4">
                              {n.title[language] || n.title.en}
                            </p>

                            <div className="flex items-center space-x-1 shrink-0">
                              <span className="text-[10px] text-[#8B735B]">
                                {n.timestamp}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(n.id);
                                }}
                                className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                                title="Delete message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[#5C4033] dark:text-[#E8DCD0] leading-snug">
                            {n.message[language] || n.message.en}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              className="px-2.5 py-1.5 rounded-lg border border-[#E8E1D9] dark:border-[#443228] text-xs font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F] transition-colors flex items-center space-x-1"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>{language === 'en' ? '日本語' : 'English'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#5C4033] dark:text-[#F5E6D3] hover:bg-[#F3EFE9] dark:hover:bg-[#3D2B1F] transition-colors"
              title={getTranslation(language, theme === 'dark' ? 'lightMode' : 'darkMode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#E67E22]" />
              ) : (
                <Moon className="w-5 h-5 text-[#3D2B1F]" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="px-3.5 py-2 rounded-xl bg-[#E67E22] hover:bg-[#D36E17] text-white text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{getTranslation(language, 'cart')}</span>
              {totalCartCount > 0 && (
                <span className="bg-white text-[#E67E22] px-2 py-0.5 rounded-full text-xs font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Role / User Auth Button */}
            <button
              onClick={onOpenAuth}
              className="pl-1.5 pr-2.5 py-1 rounded-xl bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#E8E1D9] dark:hover:bg-[#4E382C] transition-all border border-[#E8E1D9] dark:border-[#443228] flex items-center space-x-2 text-xs font-semibold shadow-xs"
              title="Log In / Sign Up / Switch Account"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-lg object-cover border border-[#E67E22]"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-[#E67E22] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left hidden lg:block">
                <span className="block leading-tight text-[11px] font-bold line-clamp-1">
                  {currentUser.name}
                </span>
                <span className="block leading-none text-[9px] text-[#E67E22] font-semibold capitalize">
                  {currentUser.role}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
