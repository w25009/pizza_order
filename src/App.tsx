import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { getTranslation } from './i18n/translations';
import { Pizza, PizzaCategory } from './types';
import { Navbar } from './components/Navbar';
import { PizzaCard } from './components/PizzaCard';
import { PizzaCustomizerModal } from './components/PizzaCustomizerModal';
import { PizzaModal } from './components/PizzaModal';
import { CartDrawer } from './components/CartDrawer';
import { StaffDashboard } from './components/StaffDashboard';
import { InventoryManager } from './components/InventoryManager';
import { OrderTracker } from './components/OrderTracker';
import { CustomerProfile } from './components/CustomerProfile';
import { AuthModal } from './components/AuthModal';
import { NewOrderAlertBanner } from './components/NewOrderAlertBanner';
import { CustomerOrderStatusNotification } from './components/CustomerOrderStatusNotification';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

function AppContent() {
  const { language, pizzas, currentUser, deletePizza } = useApp();

  // Do not treat the old demo-user localStorage entry as a signed-in session.
  // A visitor must explicitly sign in or create an account before seeing orders.
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'menu' | 'orders' | 'dashboard' | 'inventory' | 'profile'
  >('menu');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Modals
  const [selectedPizzaForCustomizer, setSelectedPizzaForCustomizer] = useState<Pizza | null>(null);
  const [selectedPizzaForEdit, setSelectedPizzaForEdit] = useState<Pizza | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);



  // Filtered Pizzas
  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesCategory =
      selectedCategory === 'all' || pizza.category === selectedCategory;

    const nameMatch =
      pizza.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      pizza.ingredients[language].some((i) =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const stockMatch = !inStockOnly || pizza.inStock;

    return matchesCategory && nameMatch && stockMatch;
  });

  const isStaff = currentUser.role === 'staff' || currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-[#F5E6D3] transition-colors pb-24 md:pb-12 font-sans selection:bg-[#E67E22] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* TAB 1: MENU VIEW */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            {/* Hero Welcome Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-[#3D2B1F] text-[#F5E6D3] p-6 sm:p-10 shadow-xl border border-[#5C4033]">
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E67E22] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fresh Oven Baked Daily</span>
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif leading-tight text-white">
                  Authentic Artisan Pizza
                </h1>
                <p className="text-sm sm:text-base text-[#F5E6D3]/90 leading-relaxed">
                  Handcrafted with imported Italian flour, fresh San Marzano tomatoes, and 100% real mozzarella. Delivered hot to your door in real-time.
                </p>
              </div>

              {/* Decorative Circle Graphics */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#E67E22]/20 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Category Filter & Search Bar */}
            <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-4 sm:p-5 border border-[#E8E1D9] dark:border-[#443228] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                  {[
                    { id: 'all', label: getTranslation(language, 'allPizzas') },
                    { id: 'classic', label: getTranslation(language, 'classic') },
                    { id: 'specialty', label: getTranslation(language, 'specialty') },
                    { id: 'vegetarian', label: getTranslation(language, 'vegetarian') },
                    { id: 'spicy', label: getTranslation(language, 'spicy') }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#E67E22] text-white shadow-md scale-102'
                          : 'bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#E8E1D9] dark:hover:bg-[#4E382C]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8B735B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={getTranslation(language, 'searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white text-xs focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                  />
                </div>
              </div>

              {/* Stock Filter Checkbox */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F3EFE9] dark:border-[#443228] text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-[#5C4033] dark:text-[#E8DCD0]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-[#E67E22] rounded focus:ring-[#E67E22]"
                  />
                  <span>{getTranslation(language, 'inStockOnly')}</span>
                </label>

                <span className="text-[#8B735B] font-medium">
                  Showing {filteredPizzas.length} pizzas
                </span>
              </div>
            </div>

            {/* Pizza Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPizzas.map((pizza) => (
                <PizzaCard
                  key={pizza.id}
                  pizza={pizza}
                  onSelect={(p) => setSelectedPizzaForCustomizer(p)}
                  onEdit={
                    isStaff
                      ? (p) => {
                          setSelectedPizzaForEdit(p);
                          setIsEditModalOpen(true);
                        }
                      : undefined
                  }
                  onDelete={isStaff ? (id) => deletePizza(id) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS TRACKER */}
        {activeTab === 'orders' && <OrderTracker />}

        {/* TAB 3: STAFF KITCHEN DASHBOARD */}
        {activeTab === 'dashboard' && <StaffDashboard />}

        {/* TAB 4: INVENTORY CRUD */}
        {activeTab === 'inventory' && <InventoryManager />}

        {/* TAB 5: CUSTOMER PROFILE */}
        {activeTab === 'profile' && <CustomerProfile />}
      </main>

      {/* Modals & Slide-overs */}
      <PizzaCustomizerModal
        pizza={selectedPizzaForCustomizer}
        onClose={() => setSelectedPizzaForCustomizer(null)}
      />

      <PizzaModal
        pizza={selectedPizzaForEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPizzaForEdit(null);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={() => setActiveTab('orders')}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={completeAuthentication}
      />

      <NewOrderAlertBanner onViewOrder={() => setActiveTab('dashboard')} />

      <CustomerOrderStatusNotification onTrackOrder={() => setActiveTab('orders')} />

      {/* Mobile Bottom Bar */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
