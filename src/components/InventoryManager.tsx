import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { formatYen } from '../utils/formatters';
import { Pizza } from '../types';
import { PizzaModal } from './PizzaModal';
import {
  Boxes,
  Plus,
  Edit3,
  Trash2,
  Power,
  Search,
  Star,
  Flame,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { language, pizzas, deletePizza, togglePizzaStock } = useApp();

  const [selectedPizzaForEdit, setSelectedPizzaForEdit] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredPizzas = pizzas.filter(
    (p) =>
      p.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedPizzaForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pizza: Pizza) => {
    setSelectedPizzaForEdit(pizza);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deletePizza(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 border border-[#E8E1D9] dark:border-[#443228] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Boxes className="w-7 h-7 text-[#E67E22]" />
            <h1 className="text-2xl font-extrabold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
              {getTranslation(language, 'inventoryTitle')}
            </h1>
          </div>
          <p className="text-xs text-[#8B735B] dark:text-[#A6998A] mt-1">
            Real-time menu item creation, price updates, stock toggling, and ingredient management
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#E67E22] hover:bg-[#D36E17] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>{getTranslation(language, 'addNewPizza')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8B735B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter pizza items..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-white text-xs focus:ring-2 focus:ring-[#E67E22] outline-hidden"
        />
      </div>

      {/* Pizza Items Table / List */}
      <div className="bg-white dark:bg-[#2D201A] rounded-2xl border border-[#E8E1D9] dark:border-[#443228] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] dark:bg-[#1F1510] text-[#8B735B] dark:text-[#A6998A] uppercase font-semibold border-b border-[#E8E1D9] dark:border-[#443228]">
              <tr>
                <th className="p-3 sm:p-4">Pizza Item</th>
                <th className="p-3 sm:p-4">Category</th>
                <th className="p-3 sm:p-4">Price</th>
                <th className="p-3 sm:p-4">Stock Status</th>
                <th className="p-3 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F3EFE9] dark:divide-[#443228]">
              {filteredPizzas.map((pizza) => (
                <tr
                  key={pizza.id}
                  className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#1F1510]/60 transition-colors"
                >
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={pizza.image}
                        alt={pizza.name[language]}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">
                          {pizza.name[language]}
                        </h4>
                        <p className="text-xs text-[#8B735B] line-clamp-1">
                          {pizza.description[language]}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 sm:p-4">
                    <span className="capitalize px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-[#F5E6D3] border border-[#E8E1D9] dark:border-[#443228]">
                      {pizza.category}
                    </span>
                  </td>

                  <td className="p-3 sm:p-4 font-mono font-extrabold text-[#E67E22]">
                    {formatYen(pizza.price)}
                  </td>

                  <td className="p-3 sm:p-4">
                    <button
                      onClick={() => togglePizzaStock(pizza.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 transition-colors ${
                        pizza.inStock
                          ? 'bg-[#4A7C59]/15 text-[#4A7C59] dark:text-[#A3D1AF]'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {pizza.inStock ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{getTranslation(language, 'inStock')}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{getTranslation(language, 'outOfStock')}</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="p-3 sm:p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(pizza)}
                        className="p-2 rounded-lg bg-[#FAF7F2] text-[#3D2B1F] dark:bg-[#1F1510] dark:text-[#F5E6D3] hover:bg-[#E8E1D9] transition-colors"
                        title={getTranslation(language, 'editPizza')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(pizza.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                        title={getTranslation(language, 'deletePizza')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#2D201A] rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#E8E1D9] dark:border-[#443228] space-y-4">
            <h3 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">
              {getTranslation(language, 'deletePizza')}
            </h3>
            <p className="text-xs text-[#5C4033] dark:text-[#E8DCD0]">
              {getTranslation(language, 'deleteConfirm')}
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] text-xs font-semibold text-[#3D2B1F] dark:text-[#F5E6D3]"
              >
                {getTranslation(language, 'cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700"
              >
                {getTranslation(language, 'delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Pizza Modal */}
      <PizzaModal
        pizza={selectedPizzaForEdit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
