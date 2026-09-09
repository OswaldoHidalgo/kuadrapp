import { supabase } from './supabase';
import type { User } from '../context/AuthContext';
import type { Recipe, BusinessConfig } from '../types';

export interface TenantData {
  config: BusinessConfig;
  ingredients: any[];
  recipes: Recipe[];
  categories: string[];
}

export const Database = {
  async getTenantData(userEmail: string): Promise<TenantData> {
    const cleanEmail = userEmail.toLowerCase();
    
    try {
      // 1. Obtener configuración del tenant desde Supabase
      const { data: configData } = await supabase
        .from('tenant_configs')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      // 2. Obtener insumos del tenant con aislamiento RLS
      const { data: ingData } = await supabase
        .from('ingredients')
        .select('*')
        .eq('tenant_email', cleanEmail);

      // 3. Obtener recetas del tenant
      const { data: recData } = await supabase
        .from('recipes')
        .select('*')
        .eq('tenant_email', cleanEmail);

      if (configData) {
        return {
          config: configData.config_json,
          categories: ['Harinas y Secos', 'Azúcares y Papelón', 'Lácteos y Grasas', 'Líquidos y Esencias', 'Empaques y Deco'],
          ingredients: ingData || [],
          recipes: recData || []
        };
      }
    } catch (e) {
      console.warn('Aviso: Cargando modo seguro local por defecto', e);
    }

    // Configuración inicial virgen para nuevos inquilinos
    return {
      config: {
        hourlyLaborRate: 3.50,
        electricityGasCostPerHour: 1.00,
        wastePercentage: 7,
        paymentGatewayFee: 1.5,
        bcvRate: 36.50,
        currencyMode: 'USD',
        businessName: 'Mi Negocio',
        rifCedula: 'V-00.000.000',
        phone: '+58 412-0000000',
        documentType: 'Nota de Entrega / Presupuesto',
        bankName: 'Banesco (0134)',
        bankAccount: '0134-XXXX-XX-XXXXXXXXXX',
        pagoMovilPhone: '0412-0000000 / V-00.000.000',
        zelleEmail: 'pagos@inegocio.com',
      },
      categories: ['Harinas y Secos', 'Azúcares y Papelón', 'Lácteos y Grasas', 'Líquidos y Esencias', 'Empaques y Deco'],
      ingredients: [], // Sistema virgen sin insumos de prueba por defecto
      recipes: []      // Sistema virgen sin recetas de prueba por defecto
    };
  },

  async saveTenantData(userEmail: string, data: TenantData) {
    const cleanEmail = userEmail.toLowerCase();
    
    try {
      // Sincronizar configuraciones
      await supabase.from('tenant_configs').upsert({
        email: cleanEmail,
        config_json: data.config,
        updated_at: new Date()
      }, { onConflict: 'email' });

      // Sincronizar Insumos de forma aislada
      await supabase.from('ingredients').delete().eq('tenant_email', cleanEmail);
      if (data.ingredients.length > 0) {
        const ingredientsToInsert = data.ingredients.map(ing => ({
          id: ing.id,
          tenant_email: cleanEmail,
          name: ing.name,
          purchase_price: ing.purchasePrice,
          purchase_quantity: ing.purchaseQuantity,
          unit: ing.unit,
          category: ing.category || 'General',
          supplier: ing.supplier || 'Proveedor Local'
        }));
        await supabase.from('ingredients').insert(ingredientsToInsert);
      }

      // Sincronizar Recetas de forma aislada
      await supabase.from('recipes').delete().eq('tenant_email', cleanEmail);
      if (data.recipes.length > 0) {
        const recipesToInsert = data.recipes.map(rec => ({
          id: rec.id,
          tenant_email: cleanEmail,
          name: rec.name,
          yield: rec.yield,
          items: rec.items,
          packaging_items: rec.packagingItems || [],
          prep_time_minutes: rec.prepTimeMinutes,
          oven_time_minutes: rec.ovenTimeMinutes,
          desired_profit_margin: rec.desiredProfitMargin
        }));
        await supabase.from('recipes').insert(recipesToInsert);
      }
    } catch (e) {
      console.error('Error al sincronizar con la base de datos cloud:', e);
    }
  },

  getUsers(): User[] {
    const saved = localStorage.getItem('kuadrapp_users_db_v8');
    return saved ? JSON.parse(saved) : [];
  },

  saveUsers(users: User[]) {
    localStorage.setItem('kuadrapp_users_db_v8', JSON.stringify(users));
  }
};