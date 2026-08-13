import React, { useState } from 'react';
import { Pizza, PizzaSize, CrustType } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { TOPPING_OPTIONS } from '../data/initialData';
import { formatYen } from '../utils/formatters';
import { X, Check, ShoppingBag, Plus, Minus } from 'lucide-react';

interface PizzaCustomizerModalProps {
  pizza: Pizza | null;
  onClose: () => void;
}

export const PizzaCustomizerModal: React.FC<PizzaCustomizerModalProps> = ({
  pizza,
  onClose
}) => {
  const { language, addToCart } = useApp();

  if (!pizza) return null;

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
  const [selectedCrust, setSelectedCrust] = useState<CrustType>('thin');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  // Price Calculation in Yen
  const sizeMultipliers: Record<PizzaSize, number> = {
    S: 0.85,
    M: 1.0,
    L: 1.25
  };

  const crustAddons: Record<CrustType, number> = {
    thin: 0,
    pan: 150,
    stuffed: 300
  };

  const rawBase = pizza.price < 100 ? Math.round(pizza.price * 100) : pizza.price;
  const basePrice = rawBase * sizeMultipliers[selectedSize];
  const crustPrice = crustAddons[selectedCrust];
  const toppingsPrice = selectedToppings.length * 220;

  const unitPrice = Math.round(basePrice + crustPrice + toppingsPrice);
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((t) => t !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      pizzaId: pizza.id,
      pizzaName: pizza.name,
      image: pizza.image,
      size: selectedSize,
      crust: selectedCrust,
      extraToppings: selectedToppings.map(
        (id) => TOPPING_OPTIONS.find((t) => t.id === id)?.name[language] || id
      ),
      count: quantity,
      pricePerUnit: unitPrice
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#2D201A] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#E8E1D9] dark:border-[#443228] max-h-[90vh] flex flex-col">
        {/* Header Image Header */}
        <div className="relative h-44 w-full bg-[#FAF7F2] dark:bg-[#1F1510]">
          <img
            src={pizza.image}
            alt={pizza.name[language]}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1510]/90 via-[#1F1510]/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#1F1510]/60 text-white hover:bg-[#1F1510] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="text-xl font-bold font-serif">{pizza.name[language]}</h2>
            <p className="text-xs text-[#E8DCD0] line-clamp-1">
              {pizza.description[language]}
            </p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* 1. Size Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B735B] dark:text-[#A6998A] block mb-2">
              {getTranslation(language, 'selectSize')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['S', 'M', 'L'] as PizzaSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedSize === size
                      ? 'border-[#E67E22] bg-[#E67E22]/15 text-[#3D2B1F] dark:text-[#F5E6D3] font-bold shadow-xs'
                      : 'border-[#E8E1D9] dark:border-[#443228] text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#FAF7F2] dark:hover:bg-[#1F1510]'
                  }`}
                >
                  <div className="text-sm">{size}</div>
                  <div className="text-[10px] opacity-75">
                    {size === 'S' && getTranslation(language, 'sizeS')}
                    {size === 'M' && getTranslation(language, 'sizeM')}
                    {size === 'L' && getTranslation(language, 'sizeL')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Crust Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B735B] dark:text-[#A6998A] block mb-2">
              {getTranslation(language, 'selectCrust')}
            </label>
            <div className="space-y-2">
              {(['thin', 'pan', 'stuffed'] as CrustType[]).map((crust) => (
                <button
                  key={crust}
                  onClick={() => setSelectedCrust(crust)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                    selectedCrust === crust
                      ? 'border-[#E67E22] bg-[#E67E22]/15 text-[#3D2B1F] dark:text-[#F5E6D3] font-semibold'
                      : 'border-[#E8E1D9] dark:border-[#443228] text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#FAF7F2] dark:hover:bg-[#1F1510]'
                  }`}
                >
                  <span>
                    {crust === 'thin' && getTranslation(language, 'crustThin')}
                    {crust === 'pan' && getTranslation(language, 'crustPan')}
                    {crust === 'stuffed' && getTranslation(language, 'crustStuffed')}
                  </span>
                  {selectedCrust === crust && <Check className="w-4 h-4 text-[#E67E22]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Extra Toppings */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B735B] dark:text-[#A6998A] block mb-2">
              {getTranslation(language, 'extraToppings')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TOPPING_OPTIONS.map((topping) => {
                const isSelected = selectedToppings.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#E67E22] bg-[#E67E22]/15 text-[#3D2B1F] dark:text-[#F5E6D3] font-semibold'
                        : 'border-[#E8E1D9] dark:border-[#443228] text-[#3D2B1F] dark:text-[#F5E6D3] hover:bg-[#FAF7F2] dark:hover:bg-[#1F1510]'
                    }`}
                  >
                    <span>{topping.name[language]}</span>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-[#E67E22]" />
                    ) : (
                      <span className="text-[10px] text-[#8B735B]">+¥220</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Quantity Selector */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F3EFE9] dark:border-[#443228]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B735B] dark:text-[#A6998A]">
              {getTranslation(language, 'quantity')}
            </span>

            <div className="flex items-center space-x-3 bg-[#FAF7F2] dark:bg-[#1F1510] p-1.5 rounded-xl border border-[#E8E1D9] dark:border-[#443228]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] shadow-xs hover:bg-[#E8E1D9] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-extrabold text-[#3D2B1F] dark:text-[#F5E6D3] px-2">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1.5 rounded-lg bg-white dark:bg-[#3D2B1F] text-[#3D2B1F] dark:text-[#F5E6D3] shadow-xs hover:bg-[#E8E1D9] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer with Total & Add button */}
        <div className="p-4 bg-[#FAF7F2] dark:bg-[#1F1510] border-t border-[#E8E1D9] dark:border-[#443228] flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#8B735B] dark:text-[#A6998A] block">
              {getTranslation(language, 'total')}
            </span>
            <span className="text-2xl font-extrabold text-[#E67E22]">
              {formatYen(totalPrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center space-x-2 shadow-md transition-all active:scale-95 ${
              added ? 'bg-[#4A7C59]' : 'bg-[#E67E22] hover:bg-[#D36E17]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{getTranslation(language, 'addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
