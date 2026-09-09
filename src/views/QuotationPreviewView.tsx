import { ArrowLeft, ChefHat, CreditCard, ShieldCheck, MessageCircle, Share2, Printer } from 'lucide-react';
import type { Recipe } from '../types';

interface QuotationPreviewViewProps {
  results: any;
  selectedRecipe: Recipe;
  config: any;
  setActiveTab: (tab: any) => void;
  handleShareWhatsApp: () => void;
  handleNativeShare: () => void;
}

export function QuotationPreviewView({
  results,
  selectedRecipe,
  config,
  setActiveTab,
  handleShareWhatsApp,
  handleNativeShare
}: QuotationPreviewViewProps) {
  return (
    <div className="space-y-4 animate-fadeIn bg-white text-slate-900 p-6 rounded-3xl border border-slate-200 shadow-2xl print:shadow-none print:border-0 print:rounded-none print:w-full print:p-6 print:bg-white">
      <div className="flex items-center justify-between pb-2 print:hidden border-b border-slate-100">
        <button 
          type="button"
          onClick={() => setActiveTab('calculator')} 
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <span className="text-[10px] uppercase font-extrabold bg-[#EF2A82]/10 text-[#EF2A82] px-3 py-1 rounded-full border border-[#EF2A82]/20 tracking-wider">
          {config.documentType}
        </span>
      </div>

      <div className="flex justify-between items-start pt-1">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-[#8843F2]" /> {config.businessName}
          </h2>
          <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
            <p>RIF / Cédula: <strong className="text-slate-700">{config.rifCedula}</strong></p>
            <p>Teléfono: <strong className="text-slate-700">{config.phone}</strong></p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Fecha</span>
          <span className="text-xs font-extrabold text-slate-800">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <hr className="border-slate-100 my-2" />

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Concepto / Producto</span>
            <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedRecipe.name}</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cantidad</span>
            <span className="text-sm font-black text-[#EF2A82]">{results.totalYield} Unids</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Valor Unitario por Pieza</span>
          <span className="font-bold text-slate-900">{results.currencySymbol} {results.pricePerUnit.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-linear-to-r from-[#8843F2] to-[#EF2A82] text-white p-4.5 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#F9D371] block">Total a Pagar</span>
          <div className="text-2xl font-black tracking-tight">{results.currencySymbol} {results.finalSellingPrice.toFixed(2)}</div>
        </div>
        <div className="text-right text-[10px] font-medium text-slate-100">
          <span>Tasa BCV: Bs. {config.bcvRate}</span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
        <div className="font-bold text-[#8843F2] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" /> Métodos y Datos de Pago
        </div>
        <div className="space-y-1 text-slate-600 text-[11px]">
          <p><strong>Pago Móvil:</strong> {config.pagoMovilPhone}</p>
          <p><strong>Zelle:</strong> {config.zelleEmail}</p>
          <p><strong>Banco:</strong> {config.bankName} - Cuenta: {config.bankAccount}</p>
        </div>
      </div>

      <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-1.5 text-[11px] text-amber-900">
        <div className="font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5 text-amber-700">
          <ShieldCheck className="w-3.5 h-3.5" /> Términos y Condiciones
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-800">
          <li>Validez de la cotización: <strong>7 días</strong> a partir de la emisión.</li>
          <li>Se requiere un <strong>abono mínimo del 50%</strong> para confirmar y procesar el pedido.</li>
          <li>Los pagos en bolívares se calculan a la <strong>tasa oficial BCV del día</strong> en que se efectúe el pago.</li>
        </ul>
      </div>

      <div className="pt-2 print:hidden flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md text-xs"
          >
            <MessageCircle className="w-4 h-4" /> Enviar WhatsApp
          </button>
          <button
            type="button"
            onClick={handleNativeShare}
            className="bg-[#221345] hover:bg-[#150d27] text-white font-bold py-3 px-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md text-xs"
          >
            <Share2 className="w-4 h-4" /> Compartir...
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full bg-[#EF2A82] hover:bg-[#d81d70] text-white font-bold py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#EF2A82]/30 text-xs"
        >
          <Printer className="w-4 h-4" /> Imprimir / Guardar como PDF
        </button>
      </div>
    </div>
  );
}