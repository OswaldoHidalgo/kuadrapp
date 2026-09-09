import { UtensilsCrossed, Plus, ChefHat, SlidersHorizontal, Check, X, Search, Calculator, Trash2, Package, Edit3 } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipesViewProps {
  recipes: Recipe[];
  showRecipeModal: boolean;
  setShowRecipeModal: (show: boolean) => void;
  newRecipeName: string;
  setNewRecipeName: (name: string) => void;
  newRecipeYield: string;
  setNewRecipeYield: (y: string) => void;
  newRecipePrep: string;
  setNewRecipePrep: (p: string) => void;
  newRecipeOven: string;
  setNewRecipeOven: (o: string) => void;
  newRecipeMargin: string;
  setNewRecipeMargin: (m: string) => void;
  showAdvancedSettings: boolean;
  setShowAdvancedSettings: (show: boolean) => void;
  recipeItems: any[];
  selectedIngToAdd: string;
  setSelectedIngToAdd: (id: string) => void;
  qtyToAdd: string;
  setQtyToAdd: (q: string) => void;
  handleAddIngredientToRecipe: () => void;
  handleRemoveItemFromRecipe: (idx: number) => void;
  handleSaveNewRecipe: (e: React.FormEvent) => void;
  handleEditRecipe?: (recipe: Recipe) => void;
  handleDeleteRecipe: (id: string) => void;
  handleAuditRecipe: (id: string) => void;
  ingredients: any[];
  ingredientSearchQuery: string;
  setIngredientSearchQuery: (q: string) => void;
  isRecipeIngOpen: boolean;
  setIsRecipeIngOpen: (open: boolean) => void;
  filteredIngredientsForRecipe: any[];
  selectedIngObj: any;
  calculateRecipe: (recipe: Recipe, yieldVal: number) => any;
  isDark: boolean;
  bgCard: string;
  bgInner: string;
  textMain: string;
  textSub: string;
}

export function RecipesView({
  recipes,
  showRecipeModal,
  setShowRecipeModal,
  newRecipeName,
  setNewRecipeName,
  newRecipeYield,
  setNewRecipeYield,
  newRecipePrep,
  setNewRecipePrep,
  newRecipeOven,
  setNewRecipeOven,
  newRecipeMargin,
  setNewRecipeMargin,
  showAdvancedSettings,
  setShowAdvancedSettings,
  recipeItems,
  selectedIngToAdd,
  setSelectedIngToAdd,
  qtyToAdd,
  setQtyToAdd,
  handleAddIngredientToRecipe,
  handleRemoveItemFromRecipe,
  handleSaveNewRecipe,
  handleEditRecipe,
  handleDeleteRecipe,
  handleAuditRecipe,
  ingredients,
  ingredientSearchQuery,
  setIngredientSearchQuery,
  isRecipeIngOpen,
  setIsRecipeIngOpen,
  filteredIngredientsForRecipe,
  selectedIngObj,
  calculateRecipe,
  isDark,
  bgCard,
  bgInner,
  textMain,
  textSub
}: RecipesViewProps) {
  return (
    <div className="space-y-4 animate-fadeIn pb-24">
      <div className={`${bgCard} p-4 rounded-3xl border flex flex-col gap-3 transition-colors`}>
        <div>
          <h2 className={`text-sm font-bold ${textMain} flex items-center gap-2`}>
            <UtensilsCrossed className="w-4 h-4 text-[#8843F2]" /> Gestión de Recetas / Productos
          </h2>
          <p className={`text-[11px] ${textSub}`}>Constructor pro con control de insumos y empaques.</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowRecipeModal(true)}
          className="bg-[#8843F2] hover:bg-[#7733dc] text-white text-xs font-bold py-3.5 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#8843F2]/30 w-full"
        >
          <Plus className="w-4 h-4" /> Crear Nueva Receta
        </button>
      </div>

      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto animate-fadeIn p-4 flex items-center justify-center">
          <div className={`${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-white border-slate-200'} border rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 my-auto animate-fadeIn`}>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8843F2] flex items-center gap-1.5">
                <ChefHat className="w-4 h-4" /> Constructor de Receta Pro
              </h3>
              <button onClick={() => setShowRecipeModal(false)} className={`${textSub} p-1.5 cursor-pointer`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRecipe} className="space-y-3.5 text-xs">
              <div>
                <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Nombre del Producto / Receta</label>
                <input 
                  type="text" 
                  placeholder="Ej. Torta Completa con Caja" 
                  value={newRecipeName} 
                  onChange={(e) => setNewRecipeName(e.target.value)} 
                  className={`w-full p-3.5 ${bgInner} border rounded-2xl ${textMain} focus:outline-[#8843F2] shadow-inner`} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Rendimiento Base</label>
                  <input 
                    type="number" 
                    inputMode="numeric"
                    value={newRecipeYield} 
                    onChange={(e) => setNewRecipeYield(e.target.value)} 
                    className={`w-full p-3.5 ${bgInner} border rounded-2xl ${textMain} focus:outline-[#8843F2] shadow-inner`} 
                    required 
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Margen Ganancia (%)</label>
                  <input 
                    type="number" 
                    inputMode="decimal"
                    value={newRecipeMargin} 
                    onChange={(e) => setNewRecipeMargin(e.target.value)} 
                    className={`w-full p-3.5 ${bgInner} border rounded-2xl ${textMain} focus:outline-[#8843F2] shadow-inner`} 
                    required 
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="text-[#8843F2] hover:text-[#7733dc] font-bold text-xs flex items-center gap-1.5 py-1 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showAdvancedSettings ? 'Ocultar tiempos de cocina' : '⚙️ Ajustar tiempos de horno y mano de obra'}</span>
                </button>

                {showAdvancedSettings && (
                  <div className={`grid grid-cols-2 gap-2.5 mt-2 p-3 ${bgInner} rounded-2xl border shadow-inner animate-fadeIn`}>
                    <div>
                      <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Prep (Min)</label>
                      <input type="number" inputMode="numeric" value={newRecipePrep} onChange={(e) => setNewRecipePrep(e.target.value)} className={`w-full p-3 ${bgInner} border rounded-xl text-xs ${textMain}`} />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase ${textSub} mb-1 block`}>Horno (Min)</label>
                      <input type="number" inputMode="numeric" value={newRecipeOven} onChange={(e) => setNewRecipeOven(e.target.value)} className={`w-full p-3 ${bgInner} border rounded-xl text-xs ${textMain}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8843F2]">Ingredientes y Empaques</span>
                  <span className="text-[10px] text-[#8843F2] bg-[#8843F2]/10 px-2.5 py-0.5 rounded-full font-bold">{recipeItems.length} añadidos</span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRecipeIngOpen(!isRecipeIngOpen)}
                    className={`w-full flex items-center justify-between p-3.5 ${bgInner} border rounded-2xl text-xs font-semibold ${textMain} shadow-inner cursor-pointer`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#8843F2]" />
                      {selectedIngObj ? `${selectedIngObj.name} (${selectedIngObj.unit})` : 'Buscar insumo o empaque...'}
                    </span>
                  </button>

                  {isRecipeIngOpen && (
                    <div className={`absolute top-full left-0 right-0 mt-1.5 ${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl z-50 p-2.5 space-y-2 animate-fadeIn`}>
                      <input 
                        type="text" 
                        placeholder="Filtrar insumo..." 
                        value={ingredientSearchQuery}
                        onChange={(e) => setIngredientSearchQuery(e.target.value)}
                        className={`w-full p-3 ${bgInner} border rounded-xl text-xs ${textMain} shadow-inner`}
                        autoFocus
                      />
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {filteredIngredientsForRecipe.map(ing => (
                          <button
                            key={ing.id}
                            type="button"
                            onClick={() => { setSelectedIngToAdd(ing.id); setIsRecipeIngOpen(false); setIngredientSearchQuery(''); }}
                            className={`w-full text-left px-4 py-3 text-xs rounded-xl transition cursor-pointer flex justify-between items-center ${selectedIngToAdd === ing.id ? 'bg-[#8843F2]/10 text-[#8843F2] font-bold' : `${textSub} ${textMain}`}`}
                          >
                            <span>{ing.name} ({ing.unit})</span>
                            {selectedIngToAdd === ing.id && <Check className="w-4 h-4 text-[#8843F2]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="number" 
                    inputMode="decimal"
                    placeholder="Cantidad..." 
                    value={qtyToAdd} 
                    onChange={(e) => setQtyToAdd(e.target.value)} 
                    className={`flex-1 p-3.5 ${bgInner} border rounded-2xl text-xs ${textMain} shadow-inner`} 
                  />
                  <button type="button" onClick={handleAddIngredientToRecipe} className="bg-slate-900 text-white dark:bg-[#150d27] px-4 py-3.5 rounded-2xl text-xs font-bold cursor-pointer transition active:scale-95 border border-slate-200">
                    + Añadir
                  </button>
                </div>

                {recipeItems.length > 0 ? (
                  <ul className={`${bgInner} p-3 rounded-2xl border space-y-2 max-h-36 overflow-y-auto shadow-inner`}>
                    {recipeItems.map((item, idx) => {
                      const ing = ingredients.find(i => i.id === item.ingredientId);
                      return (
                        <li key={idx} className="flex justify-between items-center text-xs border-b border-slate-200 pb-2 last:border-0">
                          <span className="truncate pr-2 text-slate-700 font-medium">{ing?.name}</span>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-bold text-[#8843F2] bg-[#8843F2]/10 px-2.5 py-1 rounded-xl">{item.quantityUsed} {ing?.unit}</span>
                            <button type="button" onClick={() => handleRemoveItemFromRecipe(idx)} className="text-red-500 cursor-pointer p-1 transition active:scale-90"><X className="w-4 h-4" /></button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className={`p-4 text-center border border-dashed rounded-2xl border-slate-300 text-slate-400 text-xs space-y-1`}>
                    <Package className="w-5 h-5 mx-auto opacity-40 text-[#8843F2] animate-bounce" />
                    <p>Aún no has agregado ingredientes o empaques.</p>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-[#8843F2] hover:bg-[#7733dc] text-white font-extrabold p-4 rounded-2xl transition active:scale-98 cursor-pointer uppercase tracking-wider shadow-md mt-2 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Guardar Receta Definitiva
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {recipes.map(rec => {
          const tempRes = calculateRecipe(rec, rec.yield);
          return (
            <div key={rec.id} className={`${bgCard} p-4 rounded-3xl border flex flex-col gap-3 transition-transform duration-200 hover:scale-[1.01]`}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-xs sm:text-sm ${textMain} flex items-center gap-2`}>
                    <ChefHat className="w-4 h-4 text-[#8843F2]" /> {rec.name}
                  </h3>
                  <span className="text-[10px] font-medium bg-[#8843F2]/10 text-[#8843F2] px-2.5 py-1 rounded-full border border-[#8843F2]/20">
                    {rec.desiredProfitMargin}% Margen
                  </span>
                </div>
                <p className={`text-[11px] ${textSub}`}>
                  Rendimiento base: <strong className={textMain}>{rec.yield} unids</strong> • {rec.prepTimeMinutes + rec.ovenTimeMinutes} min total
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                {tempRes && (
                  <div>
                    <span className={`text-[9px] uppercase font-bold ${textSub} block`}>Sugerido Venta</span>
                    <div className="text-sm font-black text-[#8843F2]">{tempRes.currencySymbol} {tempRes.finalSellingPrice.toFixed(2)}</div>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleAuditRecipe(rec.id)} 
                    className={`text-xs ${bgInner} ${textMain} px-3 py-2 rounded-xl cursor-pointer font-bold transition active:scale-90 border shadow-2xs flex items-center gap-1`}
                    title="Auditar costos"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#8843F2]" /> Auditar
                  </button>

                  {handleEditRecipe && (
                    <button 
                      onClick={() => handleEditRecipe(rec)} 
                      className={`text-xs ${bgInner} ${textMain} p-2 rounded-xl cursor-pointer font-bold transition active:scale-90 border shadow-2xs`}
                      title="Editar receta"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#8843F2]" />
                    </button>
                  )}

                  <button 
                    onClick={() => handleDeleteRecipe(rec.id)} 
                    className="text-slate-400 hover:text-red-500 p-2 rounded-xl cursor-pointer transition active:scale-90 border border-transparent hover:border-red-500/20"
                    title="Eliminar receta"
                  >
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