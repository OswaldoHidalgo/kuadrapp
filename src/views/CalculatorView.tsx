import { Calculator, ChefHat, ChevronDown, SlidersHorizontal, Sparkles, Percent, Store, Layers, Package, Tag, Clock, Flame, DollarSign, FileCheck, AlertTriangle } from 'lucide-react';
import type { Recipe } from '../types';

interface CalculatorViewProps {
  selectedRecipe: Recipe;
  recipes: Recipe[];
  selectedRecipeId: string;
  setSelectedRecipeId: (id: string) => void;
  desiredYield: number;
  setDesiredYield: (y: number) => void;
  results: any;
  config: any;
  isDark: boolean;
  bgCard: string;
  bgInner: string;
  textMain: string;
  textSub: string;
  setActiveTab: (tab: any) => void;
  dropdownRef: any;
  isSelectOpen: boolean;
  setIsSelectOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
}

export function CalculatorView({
  selectedRecipe,
  recipes,
  selectedRecipeId,
  setSelectedRecipeId,
  desiredYield,
  setDesiredYield,
  results,
  config,
  isDark,
  bgCard,
  bgInner,
  textMain,
  textSub,
  setActiveTab,
  dropdownRef,
  isSelectOpen,
  setIsSelectOpen,
  showToast
}: CalculatorViewProps) {
  // Cálculo exacto del costo por unidad de producción (Feedback Audio 3)
  const unitProductionCost = results && desiredYield > 0 ? results.totalProductionCost / desiredYield : 0;
  const unitSellingPrice = results && desiredYield > 0 ? results.finalSellingPrice / desiredYield : 0;
  
  // Alerta de viabilidad: si el costo de producción por unidad supera el 70% del precio sugerido o el margen es muy bajo
  const isLowMargin = selectedRecipe && selectedRecipe.desiredProfitMargin < 20;

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className={`${bgCard} p-4.5 rounded-3xl border flex flex-col gap-3 relative z-30 transition-all`}>
        <div>
          <h2 className={`text-sm font-bold ${textMain} flex items-center gap-2`}>
            <Calculator className="w-4 h-4 text-[#8843F2] animate-bounce" /> Receta Activa y Lotes
          </h2>
          <p className={`text-[11px] ${textSub}`}>Auditoría financiera de producción en {config.currencyMode}.</p>
        </div>

        <div className="relative w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className={`w-full flex items-center justify-between p-3.5 ${bgInner} border rounded-2xl text-xs font-semibold ${textMain} active:scale-98 transition-all cursor-pointer shadow-sm`}
          >
            <span className="truncate flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#8843F2]" />
              {selectedRecipe ? `${selectedRecipe.name} (${selectedRecipe.yield} base)` : 'Seleccionar receta...'}
            </span>
            <ChevronDown className={`w-4 h-4 text-[#8843F2] transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSelectOpen && (
            <div className={`absolute top-full left-0 right-0 mt-1.5 ${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-fadeIn max-h-60 overflow-y-auto`}>
              {recipes.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setSelectedRecipeId(r.id); setIsSelectOpen(false); setDesiredYield(r.yield); showToast(`✨ Seleccionado: ${r.name}`); }}
                  className={`w-full text-left px-4 py-3 text-xs font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${selectedRecipeId === r.id ? 'bg-[#8843F2]/10 text-[#8843F2] font-bold' : `${textSub} hover:${isDark ? 'bg-[#150d27]' : 'bg-slate-50'} ${textMain}`}`}
                >
                  <span className="truncate">{r.name}</span>
                  <span className="text-[10px] text-[#8843F2] bg-[#8843F2]/10 px-2 py-0.5 rounded-full font-bold">{r.yield} unids</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {results && selectedRecipe && (
        <div className="space-y-4 animate-fadeIn">
          <div className={`${bgCard} p-4.5 rounded-3xl border space-y-4 transition-colors`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8843F2]" />
                  <h3 className={`text-xs font-black uppercase tracking-wider ${textMain}`}>Cantidad a Producir (Lote)</h3>
                </div>
                <div className={`flex items-center gap-2 ${bgInner} px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm`}>
                  <input 
                    type="number" 
                    inputMode="numeric"
                    min="1" 
                    step="1"
                    value={desiredYield}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) setDesiredYield(val);
                    }}
                    className={`w-14 bg-transparent text-center text-sm font-black ${textMain} focus:outline-none`}
                  />
                  <span className="text-[11px] font-bold text-[#8843F2] uppercase tracking-wide border-l pl-2 border-slate-200">unids</span>
                </div>
              </div>
              <p className={`text-[11px] ${textSub}`}>
                Receta base rinde <strong className="text-[#8843F2]">{selectedRecipe.yield} unids</strong>. Ajusta el lote según los insumos disponibles.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <input 
                type="range" 
                min="1" 
                max={selectedRecipe.yield * 10} 
                step="1"
                value={desiredYield}
                onChange={(e) => setDesiredYield(parseInt(e.target.value))}
                className="w-full accent-[#8843F2] cursor-pointer h-2.5 bg-slate-200 rounded-lg transition-all"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                <span>1</span>
                <span className="text-[#8843F2] font-extrabold">{selectedRecipe.yield} (Base)</span>
                <span>{selectedRecipe.yield * 5}</span>
                <span>{selectedRecipe.yield * 10}</span>
              </div>
            </div>
          </div>

          {/* Alerta de Viabilidad Financiera (Feedback Audio 3) */}
          {isLowMargin && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-3xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-amber-300 uppercase">Alerta de Margen Reducido</h4>
                <p className="text-[11px] text-amber-200/90 mt-0.5 leading-snug">
                  Tu margen de ganancia configurado es menor al 20%. Asegúrate de revisar el costo de tus materiales y el rendimiento del lote para que la producción sea rentable.
                </p>
              </div>
            </div>
          )}

          <div className="bg-linear-to-br from-[#8843F2] to-[#EF2A82] text-white p-5 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <div className="absolute -right-2.5 -bottom-2.5 opacity-10 pointer-events-none">
              <Sparkles className="w-32 h-32 animate-spin duration-1000" />
            </div>
            <div className="flex flex-col gap-3.5 relative z-10">
              <div>
                <span className="text-[#F9D371] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" /> Precio Sugerido Total ({desiredYield} unids)
                </span>
                <div className="text-4xl font-black tracking-tight animate-pulse text-white">{results.currencySymbol === 'Bs.' ? 'Bs. ' : '$'}{results.finalSellingPrice.toFixed(2)}</div>
                <p className="text-slate-100 text-[11px] mt-1 font-medium flex items-center gap-2">
                  <Percent className="w-3 h-3 text-[#F9D371]" /> Margen: {selectedRecipe.desiredProfitMargin}% 
                  <span>•</span> 
                  <Store className="w-3 h-3 text-white" /> BCV: Bs. {config.bcvRate}
                </p>
              </div>

              <div className="bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/10 grid grid-cols-2 gap-3 shadow-inner">
                <div>
                  <span className="text-[#F9D371] text-[9px] uppercase font-bold tracking-wider block">Costo x Unidad</span>
                  <div className="text-sm font-extrabold">{results.currencySymbol === 'Bs.' ? 'Bs. ' : '$'}{unitProductionCost.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-[#F9D371] text-[9px] uppercase font-bold tracking-wider block">Venta x Unidad</span>
                  <div className="text-sm font-extrabold">{results.currencySymbol === 'Bs.' ? 'Bs. ' : '$'}{unitSellingPrice.toFixed(2)}</div>
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('quotation-preview')}
                  className="bg-white text-[#8843F2] hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer flex items-center gap-1.5 shadow-md w-full justify-center"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Generar Cotización PDF del Lote
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            <div className={`${bgCard} p-4 rounded-3xl border space-y-2.5 transition-colors`}>
              <h3 className={`text-[11px] font-bold uppercase ${textSub} tracking-wider flex items-center gap-1.5`}>
                <Layers className="w-4 h-4 text-[#8843F2]" /> Desglose Operativo del Lote (COGS)
              </h3>
              <div className="space-y-2 text-xs">
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#341d6b]' : 'border-slate-100'}`}>
                  <span className={`${textSub} flex items-center gap-1.5`}><Package className="w-3.5 h-3.5 text-[#8843F2]" /> Materia Prima (+{config.wastePercentage}%)</span>
                  <span className={`font-semibold ${textMain}`}>{results.currencySymbol} {results.ingredientsCost.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#341d6b]' : 'border-slate-100'}`}>
                  <span className={`${textSub} flex items-center gap-1.5`}><Tag className="w-3.5 h-3.5 text-[#8843F2]" /> Empaques</span>
                  <span className={`font-semibold ${textMain}`}>{results.currencySymbol} {results.packagingCost.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between py-1.5 border-b ${isDark ? 'border-[#341d6b]' : 'border-slate-100'}`}>
                  <span className={`${textSub} flex items-center gap-1.5`}><Clock className="w-3.5 h-3.5 text-[#8843F2]" /> Mano de Obra</span>
                  <span className={`font-semibold ${textMain}`}>{results.currencySymbol} {results.laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className={`${textSub} flex items-center gap-1.5`}><Flame className="w-3.5 h-3.5 text-[#8843F2]" /> Gas / Servicios</span>
                  <span className={`font-semibold ${textMain}`}>{results.currencySymbol} {results.operationalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className={`${bgCard} p-4 rounded-3xl border space-y-3 transition-colors`}>
              <h3 className={`text-[11px] font-bold uppercase ${textSub} tracking-wider flex items-center gap-1.5`}>
                <DollarSign className="w-4 h-4 text-[#8843F2]" /> Métricas Financieras Globales
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className={`${bgInner} p-3 rounded-2xl border`}>
                  <span className={`text-[10px] font-bold uppercase ${textSub} block`}>Costo Total del Lote</span>
                  <div className={`text-sm font-bold ${textMain} mt-0.5`}>{results.currencySymbol} {results.totalProductionCost.toFixed(2)}</div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-emerald-700 text-[10px] font-bold uppercase block">Ganancia Neta Lote</span>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">{results.currencySymbol} {results.netProfit.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}