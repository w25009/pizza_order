import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Bell, X, CheckCircle, ArrowRight } from 'lucide-react';

interface NewOrderAlertBannerProps {
  onViewOrder: () => void;
}

export const NewOrderAlertBanner: React.FC<NewOrderAlertBannerProps> = ({
  onViewOrder
}) => {
  const { language, latestOrderAlert, dismissOrderAlert, currentUser } = useApp();

  const isStaff = currentUser.role === 'staff' || currentUser.role === 'admin';

  if (!latestOrderAlert || !isStaff) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-bounceIn">
      <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-2xl border border-amber-400 flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md shrink-0">
            <Bell className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm font-serif">
              {getTranslation(language, 'newOrderAlert')}
            </h4>
            <p className="text-xs opacity-90 line-clamp-1">
              #{latestOrderAlert.orderNumber} - {latestOrderAlert.customerName} (
              ${latestOrderAlert.totalAmount.toFixed(2)})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => {
              onViewOrder();
              dismissOrderAlert();
            }}
            className="px-3 py-1.5 rounded-xl bg-white text-amber-900 font-bold text-xs flex items-center space-x-1 shadow-xs hover:bg-slate-100 transition-colors"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={dismissOrderAlert}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
