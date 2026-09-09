import { Calculator, Package, UtensilsCrossed, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  bgHeader: string;
  textSub: string;
  activeTabColor: string;
}

export function BottomNav({ activeTab, setActiveTab, bgHeader, textSub, activeTabColor }: BottomNavProps) {
  return (
    <nav className={`${bgHeader} backdrop-blur-md border-t fixed bottom-0 left-0 right-0 z-40 shadow-2xl transition-colors print:hidden`}>
      <div className="max-w-md mx-auto px-2 h-18 flex items-center justify-around">
        <button 
          onClick={() => setActiveTab('calculator')} 
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all duration-300 active:scale-90 cursor-pointer py-2 px-3 rounded-2xl ${activeTab === 'calculator' ? activeTabColor : `${textSub}`}`}
        >
          <Calculator className="w-5 h-5 transition-transform duration-300" />
          <span>Calculadora</span>
        </button>
        <button 
          onClick={() => setActiveTab('ingredients')} 
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all duration-300 active:scale-90 cursor-pointer py-2 px-3 rounded-2xl ${activeTab === 'ingredients' ? activeTabColor : `${textSub}`}`}
        >
          <Package className="w-5 h-5 transition-transform duration-300" />
          <span>Inventario</span>
        </button>
        <button 
          onClick={() => setActiveTab('recipes')} 
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all duration-300 active:scale-90 cursor-pointer py-2 px-3 rounded-2xl ${activeTab === 'recipes' ? activeTabColor : `${textSub}`}`}
        >
          <UtensilsCrossed className="w-5 h-5 transition-transform duration-300" />
          <span>Recetas</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all duration-300 active:scale-90 cursor-pointer py-2 px-3 rounded-2xl ${activeTab === 'settings' ? activeTabColor : `${textSub}`}`}
        >
          <Settings className="w-5 h-5 transition-transform duration-300" />
          <span>Ajustes</span>
        </button>
      </div>
    </nav>
  );
}