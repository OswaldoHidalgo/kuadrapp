export function KuadrappLogo({ className = "w-full h-full" }: { className?: string }) {
  return (
    <img 
      src="/logo_kuadrapp.png" 
      alt="Kuadrapp Logo" 
      className={`${className} object-contain`} 
    />
  );
}