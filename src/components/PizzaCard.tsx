import React from 'react';
import { Pizza } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { formatYen } from '../utils/formatters';
import { Star, Flame, Edit3, Trash2, Plus, Power } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  onSelect: (pizza: Pizza) => void;
  onEdit?: (pizza: Pizza) => void;
  onDelete?: (pizzaId: string) => void;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({
  pizza,
  onSelect,
  onEdit,
  onDelete
}) => {
  const { language, currentUser, togglePizzaStock } = useApp();
  const isStaff = currentUser.role === 'staff' || currentUser.role === 'admin';

  const categoryColors: Record<string, string> = {
    classic: 'bg-[#E67E22]/15 text-[#3D2B1F] dark:text-[#F5E6D3] border-[#E67E22]/30',
    specialty: 'bg-[#8B735B]/15 text-[#3D2B1F] dark:text-[#F5E6D3] border-[#8B735B]/30',
    vegetarian: 'bg-[#4A7C59]/15 text-[#4A7C59] dark:text-[#A3D1AF] border-[#4A7C59]/30',
    spicy: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300'
  };

  return (
    <div
      className={`group relative bg-white dark:bg-[#2D201A] rounded-2xl overflow-hidden border border-[#E8E1D9] dark:border-[#443228] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
        !pizza.inStock ? 'opacity-75 grayscale-30' : ''
      }`}
    >
      {/* Top Image Section */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#F3EFE9] dark:bg-[#1F1510]">
        <img
          src={pizza.image}
          alt={pizza.name[language]}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1510]/70 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
              categoryColors[pizza.category] || 'bg-slate-500/10 text-slate-700'
            }`}
          >
            {getTranslation(language, pizza.category as keyof typeof import('../i18n/translations').translations.en)}
          </span>

          {!pizza.inStock && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
              {getTranslation(language, 'outOfStock')}
            </span>
          )}
        </div>

        {/* Rating & Calories Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10">
          <div className="flex items-center space-x-1 bg-[#1F1510]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#443228]/50">
            <Star className="w-3.5 h-3.5 text-[#E67E22] fill-[#E67E22]" />
            <span>{pizza.rating}</span>
          </div>

          <div className="flex items-center space-x-1 bg-[#1F1510]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#443228]/50">
            <Flame className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>
              {pizza.calories} {getTranslation(language, 'calories')}
            </span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif leading-snug">
              {pizza.name[language]}
            </h3>
            <span className="text-lg font-extrabold text-[#E67E22] whitespace-nowrap">
              {formatYen(pizza.price)}
            </span>
          </div>

          <p className="text-xs text-[#5C4033] dark:text-[#E8DCD0] line-clamp-2 mb-3 leading-relaxed">
            {pizza.description[language]}
          </p>

          {/* Ingredient Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {pizza.ingredients[language].map((ing, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-[#F3EFE9] dark:bg-[#3D2B1F] text-[#5C4033] dark:text-[#E8DCD0] text-[11px]"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-[#F3EFE9] dark:border-[#443228]">
          {/* Customer Add to Cart */}
          <button
            onClick={() => pizza.inStock && onSelect(pizza)}
            disabled={!pizza.inStock}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-xs ${
              pizza.inStock
                ? 'bg-[#E67E22] hover:bg-[#D36E17] text-white active:scale-98'
                : 'bg-[#E8E1D9] dark:bg-[#3D2B1F] text-[#8B735B] cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{getTranslation(language, 'customize')}</span>
          </button>

          {/* Staff/Admin Real-time Controls */}
          {isStaff && (
            <div className="mt-3 pt-2 flex items-center justify-between border-t border-dashed border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Staff Controls
              </span>

              <div className="flex items-center space-x-1.5">
                {/* Stock Toggle Button */}
                <button
                  onClick={() => togglePizzaStock(pizza.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                    pizza.inStock
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                  title="Toggle In-Stock / Out-of-Stock"
                >
                  <Power className="w-3.5 h-3.5" />
                </button>

                {/* Edit Button */}
                {onEdit && (
                  <button
                    onClick={() => onEdit(pizza)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                    title={getTranslation(language, 'editPizza')}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={() => onDelete(pizza.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                    title={getTranslation(language, 'deletePizza')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
