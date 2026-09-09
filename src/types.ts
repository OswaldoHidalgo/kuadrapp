export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise' | 'superadmin' | 'business';
  isActive?: boolean;
  mustChangePassword?: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  purchasePrice: number;    // Precio del paquete de compra (ej. $2.50)
  purchaseQuantity: number; // Cantidad total del paquete (ej. 1000)
  unit: 'g' | 'ml' | 'kg' | 'l' | 'unidad';
  category?: string;
  supplier?: string;
}

export interface RecipeItem {
  ingredientId: string;
  quantityUsed: number;     // Cantidad usada en la receta
}

export interface Recipe {
  id: string;
  name: string;
  yield: number;            // Cuántas porciones o unidades rinde
  items: RecipeItem[];
  packagingItems?: RecipeItem[];
  prepTimeMinutes: number;
  ovenTimeMinutes: number;
  desiredProfitMargin: number; // Porcentaje de ganancia (ej. 50, 100)
}

export interface BusinessConfig {
  hourlyLaborRate: number;     // Valor de la hora de trabajo
  electricityGasCostPerHour: number; // Costo operativo por hora de horno/cocina
  wastePercentage: number;     // Porcentaje de merma o desperdicio
  paymentGatewayFee: number;   // Comisión de pasarela de pago o tarjeta (%)
  bcvRate: number;
  currencyMode: 'USD' | 'VES';
  businessName: string;
  rifCedula: string;
  phone: string;
  documentType: 'Nota de Entrega / Presupuesto' | 'Factura Comercial';
  bankName: string;
  bankAccount: string;
  pagoMovilPhone: string;
  zelleEmail: string;
}