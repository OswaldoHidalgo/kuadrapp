import { Sun, Moon } from 'lucide-react';
import { KuadrappLogo } from './KuadrappLogo';

interface HeaderProps {
  isDark: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  currencyMode: 'USD' | 'VES';
  setCurrencyMode: (mode: 'USD' | 'VES') => void;
  bgHeader: string;
  textMain: string;
  textSub: string;
}

export function Header({ isDark, setTheme, currencyMode, setCurrencyMode, bgHeader, textMain, textSub }: HeaderProps) {
  return (
    <header className={`${bgHeader} backdrop-blur-md border-b sticky top-0 z-40 transition-colors print:hidden`}>
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 aspect-square flex items-center justify-center shrink-0">
            <KuadrappLogo className="w-full h-full object-contain" />
          </div>
          <h1 className={`font-black text-base tracking-tight ${textMain}`}>
            Kuadrapp
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-3 rounded-2xl border transition-all duration-200 active:scale-90 cursor-pointer ${isDark ? 'bg-[#221345] border-[#341d6b] text-[#F9D371] hover:bg-[#150d27]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
            title="Cambiar Tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className={`${isDark ? 'bg-[#221345] border-[#341d6b]' : 'bg-slate-100 border-slate-200'} p-1 rounded-2xl border flex items-center text-xs font-semibold shadow-inner`}>
            <button
              type="button"
              onClick={() => setCurrencyMode('USD')}
              className={`px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer ${currencyMode === 'USD' ? 'bg-[#8843F2] text-white shadow-md font-bold scale-105' : `${textSub}`}`}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrencyMode('VES')}
              className={`px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer ${currencyMode === 'VES' ? 'bg-[#8843F2] text-white shadow-md font-bold scale-105' : `${textSub}`}`}
            >
              VES
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}