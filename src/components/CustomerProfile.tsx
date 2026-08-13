import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { formatYen } from '../utils/formatters';
import { PRESET_AVATARS, DEFAULT_USER_AVATAR, DEFAULT_USER_AVATAR_MALE, DEFAULT_USER_AVATAR_FEMALE } from '../data/presetImages';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Gift,
  Award,
  Save,
  CheckCircle,
  RotateCcw,
  Trash2,
  AlertTriangle,
  X,
  LogOut,
  Image as ImageIcon,
  Check,
  Upload
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { language, currentUser, setCurrentUser, logoutUser, orders, addToCart, deleteOrder, clearOrderHistory } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [avatar, setAvatar] = useState(currentUser.avatar || DEFAULT_USER_AVATAR);
  const [avatarTabMode, setAvatarTabMode] = useState<'presets' | 'upload' | 'url'>('presets');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      email,
      phone,
      address,
      avatar
    };
    setCurrentUser(updated);
    localStorage.setItem('pizzeria_user', JSON.stringify(updated));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const customerOrders = orders.filter(
    (o) => o.customerId === currentUser.id || o.customerId === 'usr-customer-1'
  );

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

  // Loyalty rewards calculations
  const nextRewardThreshold = 150;
  const progressPercent = Math.min(
    100,
    (currentUser.loyaltyPoints / nextRewardThreshold) * 100
  );

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 sm:p-6 border border-[#E8E1D9] dark:border-[#443228] shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E67E22] shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-extrabold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
              {currentUser.name}
            </h1>
            <p className="text-xs text-[#E67E22] font-semibold capitalize">
              Role: {currentUser.role} Account • {currentUser.email}
            </p>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center space-x-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{getTranslation(language, 'logout')}</span>
        </button>
      </div>

      {/* Loyalty Points Reward Card (Customer Only) */}
      {!isAdmin && (
        <div className="bg-[#3D2B1F] text-[#F5E6D3] rounded-2xl p-6 shadow-lg border border-[#5C4033] relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gift className="w-6 h-6 text-[#E67E22]" />
                <span className="font-extrabold text-sm uppercase tracking-wider text-white">
                  {getTranslation(language, 'loyaltyPoints')}
                </span>
              </div>
              <span className="text-2xl font-mono font-extrabold bg-[#E67E22] text-white px-3 py-1 rounded-xl shadow-sm">
                {currentUser.loyaltyPoints} {getTranslation(language, 'pointsCount')}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 opacity-90">
                <span>{getTranslation(language, 'rewardsProgress')}</span>
                <span>
                  {currentUser.loyaltyPoints} / {nextRewardThreshold} pts
                </span>
              </div>
              <div className="w-full bg-[#1F1510] h-3 rounded-full overflow-hidden p-0.5 border border-[#5C4033]">
                <div
                  className="bg-[#E67E22] h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 sm:p-6 border border-[#E8E1D9] dark:border-[#443228] shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif border-b border-[#F3EFE9] dark:border-[#443228] pb-3">
          {getTranslation(language, 'personalInfo')}
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          {/* Avatar Change Section */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1510] border border-[#E8E1D9] dark:border-[#443228] space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#E67E22]" />
                <span>{getTranslation(language, 'changeAvatar')}</span>
              </label>

              <div className="flex items-center space-x-1 bg-[#E8E1D9] dark:bg-[#2D201A] p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setAvatarTabMode('presets')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    avatarTabMode === 'presets'
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'text-[#8B735B] dark:text-[#A6998A] hover:text-[#3D2B1F]'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarTabMode('upload')}
                  className={`px-2 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                    avatarTabMode === 'upload'
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'text-[#8B735B] dark:text-[#A6998A] hover:text-[#3D2B1F]'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarTabMode('url')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    avatarTabMode === 'url'
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'text-[#8B735B] dark:text-[#A6998A] hover:text-[#3D2B1F]'
                  }`}
                >
                  URL
                </button>
              </div>
            </div>

            {avatarTabMode === 'presets' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 pb-1">
                  <button
                    type="button"
                    onClick={() => setAvatar(DEFAULT_USER_AVATAR_MALE)}
                    className={`flex-1 py-1.5 px-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                      avatar === DEFAULT_USER_AVATAR_MALE
                        ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-xs'
                        : 'bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-[#F5E6D3] border-[#E8E1D9] dark:border-[#443228] hover:border-[#E67E22]'
                    }`}
                  >
                    <img src={DEFAULT_USER_AVATAR_MALE} alt="Male Default" className="w-5 h-5 rounded-full" />
                    <span>Default Male</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatar(DEFAULT_USER_AVATAR_FEMALE)}
                    className={`flex-1 py-1.5 px-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                      avatar === DEFAULT_USER_AVATAR_FEMALE
                        ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-xs'
                        : 'bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-[#F5E6D3] border-[#E8E1D9] dark:border-[#443228] hover:border-[#E67E22]'
                    }`}
                  >
                    <img src={DEFAULT_USER_AVATAR_FEMALE} alt="Female Default" className="w-5 h-5 rounded-full" />
                    <span>Default Female</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((item) => {
                    const isSelected = avatar === item.url;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAvatar(item.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                          isSelected
                            ? 'border-[#E67E22] ring-2 ring-[#E67E22]/30 scale-105'
                            : 'border-transparent hover:border-[#8B735B]'
                        }`}
                        title={item.label}
                      >
                        <img
                          src={item.url}
                          alt={item.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-12 object-cover rounded-lg"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#E67E22]/35 flex items-center justify-center text-white">
                            <Check className="w-4 h-4 drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {avatarTabMode === 'upload' && (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#E67E22]/40 hover:border-[#E67E22] rounded-2xl cursor-pointer bg-white dark:bg-[#2D201A] transition-colors p-3 text-center">
                  <Upload className="w-6 h-6 text-[#E67E22] mb-1" />
                  <span className="text-xs font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">
                    {getTranslation(language, 'uploadFromDevice')}
                  </span>
                  <span className="text-[10px] text-[#8B735B]">JPG, PNG, GIF, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="hidden"
                  />
                </label>

                {avatar && avatar !== DEFAULT_USER_AVATAR && (
                  <div className="flex items-center space-x-3 p-2 bg-white dark:bg-[#2D201A] rounded-xl border border-[#E8E1D9] dark:border-[#443228]">
                    <img
                      src={avatar}
                      alt="Current Profile Avatar"
                      className="w-12 h-12 rounded-xl object-cover border border-[#E67E22]"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">Active Avatar Updated</p>
                      <p className="text-[10px] text-[#4A7C59]">Save changes below to keep</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {avatarTabMode === 'url' && (
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden text-xs"
                />
                {avatar && (
                  <img
                    src={avatar}
                    alt="avatar preview"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-[#E8E1D9] dark:border-[#443228] shrink-0"
                  />
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'fullName')}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-[#8B735B]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#8B735B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'phone')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-[#8B735B]" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'savedAddress')}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-[#8B735B]" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-[#4A7C59] dark:text-[#A3D1AF] text-xs font-bold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>{getTranslation(language, 'profileUpdated')}</span>
              </span>
            )}

            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-[#E67E22] hover:bg-[#D36E17] text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{getTranslation(language, 'saveProfile')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Customer Order History Card */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 sm:p-6 border border-[#E8E1D9] dark:border-[#443228] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F3EFE9] dark:border-[#443228] pb-3">
          <h2 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
            {getTranslation(language, 'orderHistory')}
          </h2>

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
          <p className="text-xs text-[#8B735B] py-2">{getTranslation(language, 'noOrdersYet')}</p>
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
