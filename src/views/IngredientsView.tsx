import { Package, Plus, Layers, Tag, Filter, Check, X, Edit3, Trash2, Scale, Info, ChevronDown } from 'lucide-react';

interface IngredientsViewProps {
  ingredients: any[];
  categories: string[];
  selectedFilterCategory: string;
  setSelectedFilterCategory: (cat: string) => void;
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: (open: boolean) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  currencySymbol: string;
  currencyMultiplier: number;
  isDark: boolean;
  bgCard: string;
  bgInner: string;
  textMain: string;
  textSub: string;
  newIngName: string;
  setNewIngName: (val: string) => void;
  newIngSupplier: string;
  setNewIngSupplier: (val: string) => void;
  newIngCategory: string;
  setNewIngCategory: (val: string) => void;
  newIngPrice: string;
  setNewIngPrice: (val: string) => void;
  newIngQty: string;
  setNewIngQty: (val: string) => void;
  newIngUnit: any;
  setNewIngUnit: (unit: any) => void;
  handleAddIngredient: (e: React.FormEvent) => void;
  handleDeleteIngredient: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editPriceVal: string;
  setEditPriceVal: (val: string) => void;
  handleUpdatePrice: (id: string) => void;
  isAddingNewCat: boolean;
  setIsAddingNewCat: (add: boolean) => void;
  customCatName: string;
  setCustomCatName: (name: string) => void;
  handleCreateCategory: () => void;
  isNewIngCategoryOpen: boolean;
  setIsNewIngCategoryOpen: (open: boolean) => void;
  isNewIngUnitOpen: boolean;
  setIsNewIngUnitOpen: (open: boolean) => void;
}

export function IngredientsView({
  ingredients,
  categories,
  selectedFilterCategory,
  setSelectedFilterCategory,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  showAddModal,
  setShowAddModal,
  currencySymbol,
  currencyMultiplier,
  isDark,
  bgCard,
  bgInner,
  textMain,
  textSub,
  newIngName,
  setNewIngName,
  newIngSupplier,
  setNewIngSupplier,
  newIngCategory,
  setNewIngCategory,
  newIngPrice,
  setNewIngPrice,
  newIngQty,
  setNewIngQty,
  newIngUnit,
  setNewIngUnit,
  handleAddIngredient,
  handleDeleteIngredient,
  editingId,
  setEditingId,
  editPriceVal,
  setEditPriceVal,
  handleUpdatePrice,
  isAddingNewCat,
  setIsAddingNewCat,
  customCatName,
  setCustomCatName,
  handleCreateCategory,
  isNewIngCategoryOpen,
  setIsNewIngCategoryOpen,
  isNewIngUnitOpen,
  setIsNewIngUnitOpen
}: IngredientsViewProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className={`${bgCard} p-4 rounded-3xl border flex flex-col gap-3 transition-colors`}>
        <div>
          <h2 className={`text-sm font-bold ${textMain} flex items-center gap-2`}>
            <Package className="w-4 h-4 text-[#8843F2]" /> Inventario de Insumos
          </h2>
          <p className={`text-[11px] ${textSub}`}>Control de marcas, presentaciones y costos.</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-[#8843F2] hover:bg-[#7733dc] text-white text-xs font-bold py-3.5 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#8843F2]/30 w-full"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Insumo
        </button>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
            <button
              type="button"
              onClick={() => setSelectedFilterCategory('Todas')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${selectedFilterCategory === 'Todas' ? 'bg-[#8843F2] text-white shadow-md shadow-[#8843F2]/30 scale-105' : `${bgCard} ${textSub} border`}`}
            >
              <Layers className="w-3.5 h-3.5" /> Todas ({ingredients.length})
            </button>
            {categories.map(cat => {
              const count = ingredients.filter(i => (i.category || 'General') === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilterCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${selectedFilterCategory === cat ? 'bg-[#8843F2] text-white shadow-md shadow-[#8843F2]/30 scale-105' : `${bgCard} ${textSub} border`}`}
                >
                  <Tag className="w-3.5 h-3.5" /> {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`p-3 rounded-2xl border ${bgCard} ${textMain} hover:border-[#8843F2] transition cursor-pointer flex items-center justify-center shrink-0 shadow-sm`}
              title="Filtrar categoría"
            >
              <Filter className="w-4 h-4 text-[#8843F2]" />
            </button>

            {isCategoryDropdownOpen && (
              <div className={`absolute right-0 top-full mt-2 w-56 ${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl z-50 p-1.5 space-y-1 animate-fadeIn`}>
                <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${textSub} border-b ${isDark ? 'border-[#341d6b]' : 'border-slate-100'}`}>
                  Filtrar por categoría
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedFilterCategory('Todas'); setIsCategoryDropdownOpen(false); }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-medium transition cursor-pointer flex justify-between items-center ${selectedFilterCategory === 'Todas' ? 'bg-[#8843F2]/10 text-[#8843F2] font-bold' : `${textSub} ${textMain}`}`}
                >
                  <span>Todas</span>
                  <span className="text-[10px] font-bold">{ingredients.length}</span>
                </button>
                {categories.map(cat => {
                  const count = ingredients.filter(i => (i.category || 'General') === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setSelectedFilterCategory(cat); setIsCategoryDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-medium transition cursor-pointer flex justify-between items-center ${selectedFilterCategory === cat ? 'bg-[#8843F2]/10 text-[#8843F2] font-bold' : `${textSub} ${textMain}`}`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className="text-[10px] font-bold">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto animate-fadeIn p-4 flex items-center justify-center">
          <div className={`${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-white border-slate-200'} border rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 my-auto animate-fadeIn`}>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8843F2] flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Registrar Insumo ({currencySymbol})
              </h3>
              <button onClick={() => { setShowAddModal(false); setIsAddingNewCat(false); setIsNewIngCategoryOpen(false); }} className={`${textSub} p-1.5 cursor-pointer`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddIngredient} className="space-y-3.5 text-xs">
              <div>
                <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Nombre / Marca del Insumo</label>
                <input 
                  type="text" 
                  placeholder="Ej. Harina Robin Hood" 
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  className={`w-full p-3.5 ${bgInner} border rounded-2xl ${textMain} focus:outline-[#8843F2] shadow-inner`}
                  required
                />
              </div>

              <div>
                <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Proveedor / Local de Compra</label>
                <input 
                  type="text" 
                  placeholder="Ej. Mayorista del Centro" 
                  value={newIngSupplier}
                  onChange={(e) => setNewIngSupplier(e.target.value)}
                  className={`w-full p-3.5 ${bgInner} border rounded-2xl ${textMain} focus:outline-[#8843F2] shadow-inner`}
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-[10px] font-bold uppercase ${textSub}`}>Categoría</label>
                  {!isAddingNewCat && (
                    <button type="button" onClick={() => setIsAddingNewCat(true)} className="text-[10px] text-[#8843F2] font-bold cursor-pointer">
                      + Nueva categoría
                    </button>
                  )}
                </div>

                {isAddingNewCat ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nombre categoría..." 
                      value={customCatName}
                      onChange={(e) => setCustomCatName(e.target.value)}
                      className={`flex-1 p-3.5 ${bgInner} border border-[#8843F2] rounded-2xl ${textMain}`}
                      autoFocus
                    />
                    <button type="button" onClick={handleCreateCategory} className="bg-[#8843F2] text-white px-4 py-3.5 rounded-2xl font-bold">Añadir</button>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsNewIngCategoryOpen(!isNewIngCategoryOpen)}
                      className={`w-full flex items-center justify-between p-3.5 ${bgInner} border rounded-2xl text-xs font-semibold ${textMain} cursor-pointer shadow-inner`}
                    >
                      <span className="truncate flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#8843F2]" />
                        {newIngCategory}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#8843F2] transition-transform duration-200 ${isNewIngCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isNewIngCategoryOpen && (
                      <div className={`absolute top-full left-0 right-0 mt-1.5 ${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 max-h-48 overflow-y-auto animate-fadeIn`}>
                        {categories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => { setNewIngCategory(cat); setIsNewIngCategoryOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-xs font-medium transition flex items-center justify-between cursor-pointer ${newIngCategory === cat ? 'bg-[#8843F2]/10 text-[#8843F2] font-bold' : `${textSub} ${textMain}`}`}
                          >
                            <span>{cat}</span>
                            {newIngCategory === cat && <Check className="w-4 h-4 text-[#8843F2]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Precio ({currencySymbol})</label>
                  <input 
                    type="number" 
                    inputMode="decimal"
                    step="0.01" 
                    placeholder="1.50" 
                    value={newIngPrice}
                    onChange={(e) => setNewIngPrice(e.target.value)}
                    className={`w-full p-3.5 ${bgInner} border rounded-2xl ${textMain} focus:outline-[#8843F2] shadow-inner`}
                    required
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Cant. Presentación</label>
                  <input 
                    type="number" 
                    inputMode="numeric"
                    step="any" 
                    placeholder="1000" 
                    value={newIngQty}
                    onChange={(e) => setNewIngQty(e.target.value)}
                    className={`w-full p-3.5 ${bgInner} border rounded-2xl ${textMain} focus:outline-[#8843F2] shadow-inner`}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Unidad de Medida Comercial</label>
                <button
                  type="button"
                  onClick={() => setIsNewIngUnitOpen(!isNewIngUnitOpen)}
                  className={`w-full flex items-center justify-between p-3.5 ${bgInner} border rounded-2xl text-xs font-semibold ${textMain} cursor-pointer shadow-inner`}
                >
                  <span className="truncate flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#8843F2]" />
                    {newIngUnit === 'g' && 'g (Gramos)'}
                    {newIngUnit === 'kg' && 'kg (Kilos)'}
                    {newIngUnit === 'ml' && 'ml (Mililitros)'}
                    {newIngUnit === 'l' && 'l (Litros)'}
                    {newIngUnit === 'unidad' && 'unidad'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#8843F2] transition-transform duration-200 ${isNewIngUnitOpen ? 'rotate-180' : ''}`} />
                </button>

                {isNewIngUnitOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-1.5 ${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-fadeIn`}>
                    {[
                      { val: 'g', label: 'g (Gramos)' },
                      { val: 'kg', label: 'kg (Kilos)' },
                      { val: 'ml', label: 'ml (Mililitros)' },
                      { val: 'l', label: 'l (Litros)' },
                      { val: 'unidad', label: 'unidad' }
                    ].map(u => (
                      <button
                        key={u.val}
                        type="button"
                        onClick={() => { setNewIngUnit(u.val as any); setIsNewIngUnitOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-xs font-medium transition flex items-center justify-between cursor-pointer ${newIngUnit === u.val ? 'bg-[#8843F2]/10 text-[#8843F2] font-bold' : `${textSub} ${textMain}`}`}
                      >
                        <span>{u.label}</span>
                        {newIngUnit === u.val && <Check className="w-4 h-4 text-[#8843F2]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#8843F2] shrink-0 mt-0.5" />
                <p className={`text-[10px] ${textSub} leading-snug`}>
                  Indica lo que trae la presentación comprada (ej. 1 kg de azúcar = <strong className="text-[#8843F2]">1000 g</strong>).
                </p>
              </div>

              <button type="submit" className="w-full bg-[#8843F2] hover:bg-[#7733dc] text-white font-bold p-4 rounded-2xl transition active:scale-98 cursor-pointer uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mt-2">
                <Check className="w-4 h-4" /> Guardar Insumo Definitivo
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {ingredients
          .filter(ing => selectedFilterCategory === 'Todas' || (ing.category || 'General') === selectedFilterCategory)
          .map((ing) => {
            const convertedPurchasePrice = ing.purchasePrice * currencyMultiplier;
            const unitCost = ing.purchaseQuantity > 0 ? convertedPurchasePrice / ing.purchaseQuantity : 0;
            const isEditing = editingId === ing.id;

            return (
              <div key={ing.id} className={`${bgCard} p-4 rounded-3xl border flex flex-col gap-3 transition-transform duration-200 hover:scale-[1.01]`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-xs sm:text-sm ${textMain} tracking-tight flex items-center gap-2`}>
                      <Package className="w-4 h-4 text-[#8843F2]" /> {ing.name}
                    </h4>
                    {ing.supplier && (
                      <span className={`text-[10px] font-medium ${textSub} ${bgInner} px-2.5 py-1 rounded-full border`}>
                        {ing.supplier}
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] ${textSub}`}>Presentación: {currencySymbol} {convertedPurchasePrice.toFixed(2)} / {ing.purchaseQuantity} {ing.unit}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  {isEditing ? (
                    <div className={`flex items-center gap-1.5 ${bgInner} p-1.5 rounded-2xl border animate-fadeIn`}>
                      <input 
                        type="number" 
                        inputMode="decimal"
                        step="0.01" 
                        value={editPriceVal}
                        onChange={(e) => setEditPriceVal(e.target.value)}
                        className={`w-20 p-2 bg-white border border-[#8843F2] rounded-xl text-slate-900 font-bold text-xs text-center shadow-inner`}
                        autoFocus
                      />
                      <button onClick={() => handleUpdatePrice(ing.id)} className="bg-emerald-600 text-white p-2 rounded-xl transition active:scale-90"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingId(null)} className="bg-slate-700 text-white p-2 rounded-xl transition active:scale-90"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div>
                      <span className={`text-[9px] uppercase font-bold ${textSub} block`}>Costo Unitario</span>
                      <div className="text-sm font-black text-[#8843F2]">{currencySymbol} {unitCost.toFixed(4)} / {ing.unit}</div>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingId(ing.id); setEditPriceVal(convertedPurchasePrice.toFixed(2)); }} className={`${textSub} hover:${textMain} p-2.5 cursor-pointer transition active:scale-90`}>
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteIngredient(ing.id)} className="text-slate-400 hover:text-red-500 p-2.5 cursor-pointer transition active:scale-90">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}