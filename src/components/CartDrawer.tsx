import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { formatYen } from '../utils/formatters';
import { OrderType } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  Truck,
  Store,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    language,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    currentUser
  } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [address, setAddress] = useState(currentUser.address || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'mobile_pay'>('card');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculation in Yen
  const subtotal = cart.reduce((acc, i) => {
    const unitPrice = i.pricePerUnit < 100 ? Math.round(i.pricePerUnit * 100) : i.pricePerUnit;
    return acc + unitPrice * i.count;
  }, 0);
  const tax = Math.round(subtotal * 0.10);
  const deliveryFee = orderType === 'delivery' ? (subtotal > 0 ? 350 : 0) : 0;
  const totalAmount = subtotal + tax + deliveryFee;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (orderType === 'delivery' && !address.trim()) {
      setErrorMessage(getTranslation(language, 'required') + ': ' + getTranslation(language, 'deliveryAddress'));
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(async() => {
      const order =await createOrder({
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerPhone: phone || '090-0000-0000',
        deliveryAddress: orderType === 'delivery' ? address : undefined,
        orderType,
        items: [...cart],
        totalAmount,
        status: 'received',
        estimatedMinutes: orderType === 'delivery' ? 25 : 15,
        paymentMethod,
        notes
      });

      clearCart();
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(order.id);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#2D201A] shadow-2xl flex flex-col border-l border-[#E8E1D9] dark:border-[#443228]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8E1D9] dark:border-[#443228] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#1F1510]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#E67E22]" />
              <h2 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
                {getTranslation(language, 'yourCart')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8B735B] hover:text-[#3D2B1F] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-[#8B735B] dark:text-[#A6998A]">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">{getTranslation(language, 'cartEmpty')}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#FAF7F2] dark:bg-[#1F1510] rounded-xl border border-[#E8E1D9] dark:border-[#443228] flex items-center space-x-3"
                    >
                      <img
                        src={item.image}
                        alt={item.pizzaName[language]}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#3D2B1F] dark:text-[#F5E6D3] truncate">
                          {item.pizzaName[language]}
                        </h4>
                        <div className="text-[11px] text-[#8B735B] dark:text-[#A6998A] space-x-1">
                          <span>Size {item.size}</span>
                          <span>•</span>
                          <span className="capitalize">{item.crust} crust</span>
                        </div>
                        {item.extraToppings.length > 0 && (
                          <p className="text-[10px] text-[#E67E22] truncate">
                            +{item.extraToppings.join(', ')}
                          </p>
                        )}
                        <span className="text-xs font-bold text-[#E67E22] mt-0.5 block">
                          {formatYen(item.pricePerUnit * item.count)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8B735B] hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center space-x-1.5 bg-white dark:bg-[#3D2B1F] px-1.5 py-0.5 rounded-lg border border-[#E8E1D9] dark:border-[#443228] text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="text-[#5C4033] dark:text-[#F5E6D3]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] px-1">
                            {item.count}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="text-[#5C4033] dark:text-[#F5E6D3]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl flex items-center justify-between">
                    <span>{errorMessage}</span>
                    <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
                      &times;
                    </button>
                  </div>
                )}

                {/* Checkout Delivery & Contact Info */}
                <div className="pt-4 border-t border-[#E8E1D9] dark:border-[#443228] space-y-4 text-xs">
                  {/* Order Type Toggle */}
                  <div>
                    <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] block mb-1.5">
                      {getTranslation(language, 'orderType')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrderType('delivery')}
                        className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 font-semibold transition-colors ${
                          orderType === 'delivery'
                            ? 'border-[#E67E22] bg-[#E67E22]/15 text-[#3D2B1F] dark:text-[#F5E6D3]'
                            : 'border-[#E8E1D9] dark:border-[#443228] text-[#8B735B]'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-[#E67E22]" />
                        <span>{getTranslation(language, 'delivery')}</span>
                      </button>
                      <button
                        onClick={() => setOrderType('pickup')}
                        className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 font-semibold transition-colors ${
                          orderType === 'pickup'
                            ? 'border-[#E67E22] bg-[#E67E22]/15 text-[#3D2B1F] dark:text-[#F5E6D3]'
                            : 'border-[#E8E1D9] dark:border-[#443228] text-[#8B735B]'
                        }`}
                      >
                        <Store className="w-4 h-4 text-[#E67E22]" />
                        <span>{getTranslation(language, 'pickup')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderType === 'delivery' && (
                    <div>
                      <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#E67E22]" />
                        <span>{getTranslation(language, 'deliveryAddress')} *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                        placeholder="Street, Building, City..."
                      />
                    </div>
                  )}

                  {/* Contact Phone */}
                  <div>
                    <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1 flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>{getTranslation(language, 'phone')} *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1 flex items-center space-x-1">
                      <CreditCard className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>{getTranslation(language, 'paymentMethod')}</span>
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'cash' | 'mobile_pay')}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                    >
                      <option value="card">{getTranslation(language, 'card')}</option>
                      <option value="cash">{getTranslation(language, 'cash')}</option>
                      <option value="mobile_pay">{getTranslation(language, 'mobilePay')}</option>
                    </select>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1 flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>{getTranslation(language, 'notes')}</span>
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                      placeholder={getTranslation(language, 'notesPlaceholder')}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#FAF7F2] dark:bg-[#1F1510] border-t border-[#E8E1D9] dark:border-[#443228] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5C4033] dark:text-[#E8DCD0]">
                <div className="flex justify-between">
                  <span>{getTranslation(language, 'subtotal')}</span>
                  <span>{formatYen(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{getTranslation(language, 'tax')}</span>
                  <span>{formatYen(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{getTranslation(language, 'deliveryFee')}</span>
                  <span>{deliveryFee > 0 ? formatYen(deliveryFee) : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#3D2B1F] dark:text-[#F5E6D3] pt-1.5 border-t border-[#E8E1D9] dark:border-[#443228]">
                  <span>{getTranslation(language, 'total')}</span>
                  <span className="text-[#E67E22]">
                    {formatYen(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#E67E22] hover:bg-[#D36E17] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{getTranslation(language, 'confirmOrder')}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{getTranslation(language, 'placeOrder')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
