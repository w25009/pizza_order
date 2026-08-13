import React, { useState, useEffect } from 'react';
import { Pizza, PizzaCategory } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { PRESET_PIZZA_IMAGES } from '../data/presetImages';
import { X, Save, Image as ImageIcon, Check, Upload } from 'lucide-react';

interface PizzaModalProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PizzaModal: React.FC<PizzaModalProps> = ({
  pizza,
  isOpen,
  onClose
}) => {
  const { language, addPizza, updatePizza } = useApp();

  const [nameEn, setNameEn] = useState('');
  const [nameJa, setNameJa] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descJa, setDescJa] = useState('');
  const [price, setPrice] = useState(15.0);
  const [image, setImage] = useState('');
  const [imageTab, setImageTab] = useState<'presets' | 'upload' | 'custom'>('presets');

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [category, setCategory] = useState<PizzaCategory>('classic');
  const [calories, setCalories] = useState(1000);
  const [inStock, setInStock] = useState(true);
  const [ingredientsEn, setIngredientsEn] = useState('Mozzarella, Tomato Sauce');
  const [ingredientsJa, setIngredientsJa] = useState('モッツァレラ, トマトソース');

  useEffect(() => {
    if (pizza) {
      setNameEn(pizza.name.en);
      setNameJa(pizza.name.ja);
      setDescEn(pizza.description.en);
      setDescJa(pizza.description.ja);
      setPrice(pizza.price < 100 ? Math.round(pizza.price * 100) : pizza.price);
      setImage(pizza.image);
      setCategory(pizza.category);
      setCalories(pizza.calories);
      setInStock(pizza.inStock);
      setIngredientsEn(pizza.ingredients.en.join(', '));
      setIngredientsJa(pizza.ingredients.ja.join(', '));
    } else {
      setNameEn('');
      setNameJa('');
      setDescEn('');
      setDescJa('');
      setPrice(1699);
      setImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80');
      setCategory('classic');
      setCalories(1050);
      setInStock(true);
      setIngredientsEn('Mozzarella, Basil, Olive Oil');
      setIngredientsJa('モッツァレラ, バジル, オリーブオイル');
    }
  }, [pizza, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ingEnArr = ingredientsEn.split(',').map((s) => s.trim()).filter(Boolean);
    const ingJaArr = ingredientsJa.split(',').map((s) => s.trim()).filter(Boolean);

    const pizzaData = {
      name: { en: nameEn || 'Custom Pizza', ja: nameJa || 'カスタムピザ' },
      description: { en: descEn, ja: descJa },
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      category,
      inStock,
      rating: pizza ? pizza.rating : 4.8,
      calories: Number(calories),
      ingredients: { en: ingEnArr, ja: ingJaArr }
    };

    if (pizza) {
      updatePizza(pizza.id, pizzaData);
    } else {
      addPizza(pizzaData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#2D201A] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#E8E1D9] dark:border-[#443228] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] dark:bg-[#1F1510] border-b border-[#E8E1D9] dark:border-[#443228] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#3D2B1F] dark:text-[#F5E6D3] font-serif">
            {pizza ? getTranslation(language, 'editPizzaTitle') : getTranslation(language, 'addNewPizza')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B735B] hover:text-[#3D2B1F] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'pizzaNameEn')} *
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                placeholder="e.g. Meat Lovers"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'pizzaNameJa')} *
              </label>
              <input
                type="text"
                required
                value={nameJa}
                onChange={(e) => setNameJa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
                placeholder="例: ミートラバーズ"
              />
            </div>
          </div>

          {/* Description Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'descEn')}
              </label>
              <textarea
                rows={2}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'descJa')}
              </label>
              <textarea
                rows={2}
                value={descJa}
                onChange={(e) => setDescJa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
              />
            </div>
          </div>

          {/* Price, Category & Calories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'priceLabel')} (¥)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                {getTranslation(language, 'categoryLabel')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PizzaCategory)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
              >
                <option value="classic">Classic</option>
                <option value="specialty">Specialty</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="spicy">Spicy</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
              />
            </div>
          </div>

          {/* Image Selection Options (Preset Gallery, Device Upload, or Custom URL) */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1510] border border-[#E8E1D9] dark:border-[#443228] space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3] flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-[#E67E22]" />
                <span>{getTranslation(language, 'choosePizzaImage')}</span>
              </label>

              <div className="flex items-center space-x-1 bg-[#E8E1D9] dark:bg-[#2D201A] p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageTab('presets')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    imageTab === 'presets'
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'text-[#8B735B] dark:text-[#A6998A] hover:text-[#3D2B1F]'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                    imageTab === 'upload'
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'text-[#8B735B] dark:text-[#A6998A] hover:text-[#3D2B1F]'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('custom')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    imageTab === 'custom'
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'text-[#8B735B] dark:text-[#A6998A] hover:text-[#3D2B1F]'
                  }`}
                >
                  URL
                </button>
              </div>
            </div>

            {imageTab === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-1">
                {PRESET_PIZZA_IMAGES.map((preset) => {
                  const isSelected = image === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all p-1 flex flex-col items-center bg-white dark:bg-[#2D201A] ${
                        isSelected
                          ? 'border-[#E67E22] ring-2 ring-[#E67E22]/30 scale-102'
                          : 'border-[#E8E1D9] dark:border-[#443228] hover:border-[#8B735B]'
                      }`}
                    >
                      <div className="relative w-full h-16 rounded-lg overflow-hidden mb-1">
                        <img
                          src={preset.url}
                          alt={preset.name[language] || preset.name.en}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#E67E22]/35 flex items-center justify-center text-white">
                            <Check className="w-5 h-5 drop-shadow-md" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#3D2B1F] dark:text-[#F5E6D3] line-clamp-1 text-center w-full">
                        {preset.name[language] || preset.name.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {imageTab === 'upload' && (
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

                {image && (
                  <div className="flex items-center space-x-3 p-2 bg-white dark:bg-[#2D201A] rounded-xl border border-[#E8E1D9] dark:border-[#443228]">
                    <img
                      src={image}
                      alt="Uploaded Pizza Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[#E67E22]"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-[#3D2B1F] dark:text-[#F5E6D3]">Pizza Photo Loaded</p>
                      <p className="text-[10px] text-[#4A7C59]">Ready to save</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {imageTab === 'custom' && (
              <div className="flex space-x-2 items-center">
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-white dark:bg-[#2D201A] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden text-xs"
                />
                {image && (
                  <img
                    src={image}
                    alt="preview"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover border border-[#E8E1D9] dark:border-[#443228] shrink-0"
                  />
                )}
              </div>
            )}
          </div>

          {/* Ingredients Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                Ingredients (English, comma separated)
              </label>
              <input
                type="text"
                value={ingredientsEn}
                onChange={(e) => setIngredientsEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3D2B1F] dark:text-[#F5E6D3] mb-1">
                具材 (日本語, カンマ区切り)
              </label>
              <input
                type="text"
                value={ingredientsJa}
                onChange={(e) => setIngredientsJa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] bg-[#FAF7F2] dark:bg-[#1F1510] text-[#3D2B1F] dark:text-white focus:ring-2 focus:ring-[#E67E22] outline-hidden"
              />
            </div>
          </div>

          {/* Stock Toggle */}
          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="stockCheck"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 text-[#E67E22] rounded focus:ring-[#E67E22]"
            />
            <label htmlFor="stockCheck" className="font-semibold text-[#3D2B1F] dark:text-[#F5E6D3]">
              {getTranslation(language, 'stockToggle')}
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#E8E1D9] dark:border-[#443228] flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8E1D9] dark:border-[#443228] text-[#3D2B1F] dark:text-[#F5E6D3] font-semibold hover:bg-[#FAF7F2] dark:hover:bg-[#1F1510]"
            >
              {getTranslation(language, 'cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E67E22] hover:bg-[#D36E17] text-white font-semibold flex items-center space-x-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{getTranslation(language, 'saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
