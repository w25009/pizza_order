import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { PRESET_AVATARS, DEFAULT_USER_AVATAR, DEFAULT_USER_AVATAR_MALE, DEFAULT_USER_AVATAR_FEMALE } from '../data/presetImages';
import { UserRole } from '../types';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Sparkles,
  Check,
  Image as ImageIcon,
  User as UserIcon,
  Upload
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { language, loginUser, registerUser } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('customer');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(DEFAULT_USER_AVATAR);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [avatarTabMode, setAvatarTabMode] = useState<'presets' | 'upload' | 'url'>('presets');
  const [signupError, setSignupError] = useState('');

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError(language === 'ja' ? 'メールアドレスを入力してください。' : 'Please enter your email.');
      return;
    }

    const result = loginUser(loginEmail);
    if (result.success) {
      onClose();
    } else {
      setLoginError(result.message || (language === 'ja' ? 'ログインに失敗しました。' : 'Login failed.'));
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setSignupError(language === 'ja' ? 'すべてのお名前・メール・パスワードを入力してください。' : 'Please fill in name, email and password.');
      return;
    }

    const avatarToUse = avatarTabMode === 'url' && customAvatarInput.trim()
      ? customAvatarInput.trim()
      : (selectedAvatarUrl || DEFAULT_USER_AVATAR);

    const result = registerUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      role: signupRole,
      avatar: avatarToUse,
      phone: signupPhone.trim(),
      address: signupAddress.trim()
    });

    if (result.success) {
      onClose();
    } else {
      setSignupError(result.message || (language === 'ja' ? '登録に失敗しました。' : 'Registration failed.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#2D201A] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8E1D9] dark:border-[#443228] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Close */}
        <div className="p-5 bg-[#FAF7F2] dark:bg-[#1F1510] border-b border-[#E8E1D9] dark:border-[#443228] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#E67E22] text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
                {getTranslation(language, 'authTitle')}
              </h2>
              <p className="text-xs text-[#8B735B] dark:text-[#A6998A]">
                {getTranslation(language, 'authSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8B735B] hover:text-[#3D2B1F] dark:hover:text-white hover:bg-[#E8E1D9] dark:hover:bg-[#3D2B1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-[#E8E1D9] dark:border-[#443228] bg-white dark:bg-[#2D201A]">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-[#E67E22] text-[#E67E22] bg-[#FAF7F2] dark:bg-[#1F1510]/50'
                : 'border-transparent text-[#8B735B] hover:text-[#3D2B1F] dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{getTranslation(language, 'signIn')}</span>
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'signup'
                ? 'border-[#E67E22] text-[#E67E22] bg-[#FAF7F2] dark:bg-[#1F1510]/50'
                : 'border-transparent text-[#8B735B] hover:text-[#3D2B1F] dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{getTranslation(language, 'signUp')}</span>
          </button>
        </div>

        {/* Tab Contents Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* TAB 1: LOG IN */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'email')} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8B735B] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'password')} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8B735B] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#E67E22] hover:bg-[#D36E17] text-white font-extrabold flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{getTranslation(language, 'signIn')}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {signupError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  {signupError}
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Taro Yamada"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                  />
                </div>
              </div>

              {/* Password & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'password')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'selectRole')} *
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden capitalize"
                  >
                    <option value="customer">Customer (お客様)</option>
                    <option value="staff">Store Staff (厨房スタッフ)</option>
                    <option value="admin">Store Admin (店舗管理者)</option>
                  </select>
                </div>
              </div>

              {/* Address & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'phone')}
                  </label>
                  <input
                    type="text"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="e.g. 090-1234-5678"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                    {getTranslation(language, 'savedAddress')}
                  </label>
                  <input
                    type="text"
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    placeholder="e.g. Tokyo, Shibuya-ku"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                  />
                </div>
              </div>

              {/* Profile Avatar Image Selection Gallery */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1510] border border-[#E8E1D9] dark:border-[#443228] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-[#E67E22]" />
                    <span>{getTranslation(language, 'chooseAvatar')}</span>
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
                        onClick={() => setSelectedAvatarUrl(DEFAULT_USER_AVATAR_MALE)}
                        className={`flex-1 py-1.5 px-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                          selectedAvatarUrl === DEFAULT_USER_AVATAR_MALE
                            ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-xs'
                            : 'bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-[#F5E6D3] border-[#E8E1D9] dark:border-[#443228] hover:border-[#E67E22]'
                        }`}
                      >
                        <img src={DEFAULT_USER_AVATAR_MALE} alt="Male Default" className="w-5 h-5 rounded-full" />
                        <span>Default Male</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedAvatarUrl(DEFAULT_USER_AVATAR_FEMALE)}
                        className={`flex-1 py-1.5 px-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                          selectedAvatarUrl === DEFAULT_USER_AVATAR_FEMALE
                            ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-xs'
                            : 'bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-[#F5E6D3] border-[#E8E1D9] dark:border-[#443228] hover:border-[#E67E22]'
                        }`}
                      >
                        <img src={DEFAULT_USER_AVATAR_FEMALE} alt="Female Default" className="w-5 h-5 rounded-full" />
                        <span>Default Female</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5">
                      {PRESET_AVATARS.map((avatar) => {
                        const isSelected = selectedAvatarUrl === avatar.url;
                        return (
                          <button
                            key={avatar.id}
                            type="button"
                            onClick={() => setSelectedAvatarUrl(avatar.url)}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                              isSelected
                                ? 'border-[#E67E22] ring-2 ring-[#E67E22]/30 scale-105'
                                : 'border-transparent hover:border-[#8B735B]'
                            }`}
                            title={avatar.label}
                          >
                            <img
                              src={avatar.url}
                              alt={avatar.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-10 object-cover rounded-lg"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#E67E22]/30 flex items-center justify-center text-white">
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

                    {selectedAvatarUrl && selectedAvatarUrl !== DEFAULT_USER_AVATAR && (
                      <div className="flex items-center space-x-3 p-2 bg-white dark:bg-[#2D201A] rounded-xl border border-[#E8E1D9] dark:border-[#443228]">
                        <img
                          src={selectedAvatarUrl}
                          alt="Uploaded Avatar Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-[#E67E22]"
                        />
                        <div className="flex-1 text-xs">
                          <p className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">Image Loaded Successfully</p>
                          <p className="text-[10px] text-[#4A7C59]">Ready for profile</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {avatarTabMode === 'url' && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={customAvatarInput}
                      onChange={(e) => {
                        setCustomAvatarInput(e.target.value);
                        if (e.target.value.trim()) {
                          setSelectedAvatarUrl(e.target.value.trim());
                        }
                      }}
                      placeholder="Paste image URL (https://...)"
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden text-xs"
                    />
                    {customAvatarInput && (
                      <div className="flex items-center space-x-2">
                        <img
                          src={customAvatarInput}
                          alt="URL Preview"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border border-[#E8E1D9]"
                        />
                        <span className="text-xs text-[#8B735B]">Preview</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#E67E22] hover:bg-[#D36E17] text-white font-extrabold flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>{getTranslation(language, 'createAccount')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

