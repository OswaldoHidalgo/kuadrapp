import { useState, useEffect, useRef } from 'react';
import type { Recipe } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Database } from './database/db';
import type { TenantData } from './database/db';

// Componentes modulares
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';

// Vistas modulares
import { CalculatorView } from './views/CalculatorView';
import { IngredientsView } from './views/IngredientsView';
import { RecipesView } from './views/RecipesView';
import { SettingsView } from './views/SettingsView';
import { QuotationPreviewView } from './views/QuotationPreviewView';
import { LoginView } from './views/LoginView';
import { SuperAdminView } from './views/SuperAdminView';

function MainApp() {
  const { currentUser, updatePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'calculator' | 'ingredients' | 'recipes' | 'settings' | 'quotation-preview'>('calculator');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('kuadrapp_theme_v8');
    return saved ? JSON.parse(saved) : 'light';
  });

  useEffect(() => {
    localStorage.setItem('kuadrapp_theme_v8', JSON.stringify(theme));
  }, [theme]);

  // CORREGIDO: Evita usar 'guest' para prevenir consultas erróneas a Supabase
  const userEmail = currentUser?.email || '';

  const [config, setConfig] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  const [tempConfig, setTempConfig] = useState<any>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      setIsLoadingDB(false);
      return;
    }
    let isMounted = true;
    setIsLoadingDB(true);
    Database.getTenantData(userEmail).then((data: TenantData) => {
      if (isMounted) {
        setConfig(data.config);
        setTempConfig(data.config);
        setCategories(data.categories);
        setIngredients(data.ingredients);
        setRecipes(data.recipes);
        setIsLoadingDB(false);
      }
    });
    return () => { isMounted = false; };
  }, [userEmail]);

  useEffect(() => {
    if (currentUser && currentUser.email && config) {
      Database.saveTenantData(currentUser.email, {
        config,
        categories,
        ingredients,
        recipes
      });
    }
  }, [config, categories, ingredients, recipes, currentUser]);

  const handleSaveConfig = () => {
    setIsSavingConfig(true);
    setTimeout(() => {
      setConfig(tempConfig);
      setIsSavingConfig(false);
      showToast('☁️ ¡Configuración guardada en la nube!');
    }, 500);
  };

  const handleFetchLiveBCV = () => {
    const simulatedLiveRate = 36.85;
    setTempConfig({ ...tempConfig, bcvRate: simulatedLiveRate });
    showToast(`📈 ¡Tasa BCV sincronizada a Bs. ${simulatedLiveRate}!`);
  };

  const currencyMultiplier = config?.currencyMode === 'VES' ? config.bcvRate : 1;
  const currencySymbol = config?.currencyMode === 'VES' ? 'Bs.' : '$';

  const [newIngName, setNewIngName] = useState('');
  const [newIngPrice, setNewIngPrice] = useState('');
  const [newIngQty, setNewIngQty] = useState('');
  const [newIngUnit, setNewIngUnit] = useState<'g' | 'ml' | 'kg' | 'l' | 'unidad'>('g');
  const [newIngCategory, setNewIngCategory] = useState<string>('General');
  const [newIngSupplier, setNewIngSupplier] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [isNewIngCategoryOpen, setIsNewIngCategoryOpen] = useState(false);
  const [isNewIngUnitOpen, setIsNewIngUnitOpen] = useState(false);

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('Todas');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [customCatName, setCustomCatName] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState('');

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [desiredYield, setDesiredYield] = useState<number>(10);

  useEffect(() => {
    if (recipes.length > 0 && !selectedRecipeId) {
      setSelectedRecipeId(recipes[0].id);
      setDesiredYield(recipes[0].yield || 10);
    }
  }, [recipes]);

  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeYield, setNewRecipeYield] = useState('10');
  const [newRecipePrep, setNewRecipePrep] = useState('30');
  const [newRecipeOven, setNewRecipeOven] = useState('30');
  const [newRecipeMargin, setNewRecipeMargin] = useState('60');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [recipeItems, setRecipeItems] = useState<{ ingredientId: string; quantityUsed: number }[]>([]);
  const [selectedIngToAdd, setSelectedIngToAdd] = useState('');
  const [qtyToAdd, setQtyToAdd] = useState('');
  const [isRecipeIngOpen, setIsRecipeIngOpen] = useState(false);
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];
  const selectedIngObj = ingredients.find(i => i.id === selectedIngToAdd);

  const filteredIngredientsForRecipe = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(ingredientSearchQuery.toLowerCase()) ||
    (ing.category && ing.category.toLowerCase().includes(ingredientSearchQuery.toLowerCase()))
  );

  const handleCreateCategory = () => {
    const trimmed = customCatName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    const updatedCats = [...categories, trimmed];
    setCategories(updatedCats);
    setNewIngCategory(trimmed);
    setCustomCatName('');
    setIsAddingNewCat(false);
    setIsNewIngCategoryOpen(false);
  };

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName || !newIngPrice || !newIngQty) return;
    const rawPrice = config.currencyMode === 'VES' ? parseFloat(newIngPrice) / config.bcvRate : parseFloat(newIngPrice);
    const newItem = {
      id: Date.now().toString(),
      name: newIngName,
      purchasePrice: rawPrice,
      purchaseQuantity: parseFloat(newIngQty),
      unit: newIngUnit,
      category: newIngCategory || categories[0] || 'General',
      supplier: newIngSupplier.trim() || 'Proveedor Local',
    };
    setIngredients([...ingredients, newItem]);
    setNewIngName('');
    setNewIngPrice('');
    setNewIngQty('');
    setNewIngSupplier('');
    setShowAddModal(false);
    showToast('✨ ¡Insumo registrado en la nube!');
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
    showToast('🗑️ Insumo eliminado.');
  };

  const handleUpdatePrice = (id: string) => {
    const parsed = parseFloat(editPriceVal);
    if (isNaN(parsed) || parsed <= 0) return;
    const rawPrice = config.currencyMode === 'VES' ? parsed / config.bcvRate : parsed;
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, purchasePrice: rawPrice } : ing));
    setEditingId(null);
    setEditPriceVal('');
    showToast('⚡ ¡Precio actualizado!');
  };

  const handleAddIngredientToRecipe = () => {
    if (!selectedIngToAdd || !qtyToAdd) return;
    setRecipeItems([...recipeItems, { ingredientId: selectedIngToAdd, quantityUsed: parseFloat(qtyToAdd) }]);
    setSelectedIngToAdd('');
    setQtyToAdd('');
    setIngredientSearchQuery('');
  };

  const handleRemoveItemFromRecipe = (index: number) => {
    setRecipeItems(recipeItems.filter((_, idx) => idx !== index));
  };

  const handleOpenCreateModal = () => {
    setEditingRecipeId(null);
    setNewRecipeName('');
    setNewRecipeYield('10');
    setNewRecipePrep('30');
    setNewRecipeOven('30');
    setNewRecipeMargin('60');
    setRecipeItems([]);
    setSelectedIngToAdd('');
    setQtyToAdd('');
    setShowAdvancedSettings(false);
    setShowRecipeModal(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id);
    setNewRecipeName(recipe.name);
    setNewRecipeYield(recipe.yield.toString());
    setNewRecipePrep(recipe.prepTimeMinutes.toString());
    setNewRecipeOven(recipe.ovenTimeMinutes.toString());
    setNewRecipeMargin(recipe.desiredProfitMargin.toString());
    setRecipeItems(recipe.items || []);
    setSelectedIngToAdd('');
    setQtyToAdd('');
    setShowAdvancedSettings(false);
    setShowRecipeModal(true);
  };

  const handleSaveNewRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeName || recipeItems.length === 0) return;

    const recipePayload: Recipe = {
      id: editingRecipeId || Date.now().toString(),
      name: newRecipeName,
      yield: parseInt(newRecipeYield) || 1,
      items: recipeItems,
      packagingItems: [],
      prepTimeMinutes: parseInt(newRecipePrep) || 30,
      ovenTimeMinutes: parseInt(newRecipeOven) || 30,
      desiredProfitMargin: parseFloat(newRecipeMargin) || 60,
    };

    let updatedRecipes: Recipe[];
    if (editingRecipeId) {
      updatedRecipes = recipes.map(r => r.id === editingRecipeId ? recipePayload : r);
      showToast('✨ ¡Receta actualizada con éxito!');
    } else {
      updatedRecipes = [...recipes, recipePayload];
      showToast('🎉 ¡Receta guardada en la nube!');
    }

    setRecipes(updatedRecipes);
    setSelectedRecipeId(recipePayload.id);
    setShowRecipeModal(false);
    setEditingRecipeId(null);
    setNewRecipeName('');
    setRecipeItems([]);
  };

  const handleDeleteRecipe = (id: string) => {
    const updated = recipes.filter(r => r.id !== id);
    setRecipes(updated);
    if (selectedRecipeId === id && updated.length > 0) {
      setSelectedRecipeId(updated[0].id);
    }
    showToast('🗑️ Receta eliminada.');
  };

  const handleAuditRecipe = (recId: string) => {
    setSelectedRecipeId(recId);
    setActiveTab('calculator');
    showToast('🔍 ¡Receta cargada!');
  };

  const calculateRecipe = (recipe: Recipe, targetYield: number) => {
    if (!recipe || recipe.yield <= 0 || !config) return null;
    const multiplier = targetYield / recipe.yield;
    const ingredientsMap = new Map(ingredients.map(i => [i.id, i]));

    let rawIngredientsCost = 0;
    for (const item of recipe.items) {
      const ing = ingredientsMap.get(item.ingredientId);
      if (ing && ing.purchaseQuantity > 0) {
        const unitCost = ing.purchasePrice / ing.purchaseQuantity;
        rawIngredientsCost += unitCost * (item.quantityUsed * multiplier);
      }
    }
    const ingredientsCostWithWaste = rawIngredientsCost * (1 + config.wastePercentage / 100);

    let packagingCost = 0;
    for (const item of (recipe.packagingItems || [])) {
      const pkg = ingredientsMap.get(item.ingredientId);
      if (pkg && pkg.purchaseQuantity > 0) {
        const unitCost = pkg.purchasePrice / pkg.purchaseQuantity;
        packagingCost += unitCost * (item.quantityUsed * multiplier);
      }
    }

    const laborCost = ((recipe.prepTimeMinutes * multiplier) / 60) * config.hourlyLaborRate;
    const operationalCost = ((recipe.ovenTimeMinutes * multiplier) / 60) * config.electricityGasCostPerHour;

    const totalProductionCost = ingredientsCostWithWaste + packagingCost + laborCost + operationalCost;
    const priceBeforeFees = totalProductionCost * (1 + recipe.desiredProfitMargin / 100);
    const feeFactor = 1 - (config.paymentGatewayFee / 100);
    const finalSellingPrice = feeFactor > 0 ? priceBeforeFees / feeFactor : priceBeforeFees;

    const totalYield = Math.max(1, Math.round(targetYield));
    const pricePerUnit = totalYield > 0 ? finalSellingPrice / totalYield : finalSellingPrice;

    return {
      ingredientsCost: ingredientsCostWithWaste * currencyMultiplier,
      packagingCost: packagingCost * currencyMultiplier,
      laborCost: laborCost * currencyMultiplier,
      operationalCost: operationalCost * currencyMultiplier,
      totalProductionCost: totalProductionCost * currencyMultiplier,
      finalSellingPrice: finalSellingPrice * currencyMultiplier,
      pricePerUnit: pricePerUnit * currencyMultiplier,
      netProfit: (finalSellingPrice - totalProductionCost) * currencyMultiplier,
      totalYield,
      currencySymbol
    };
  };

  const results = selectedRecipe ? calculateRecipe(selectedRecipe, desiredYield) : null;

  const getShareText = () => {
    if (!results || !selectedRecipe || !config) return '';
    return `📋 *${config.documentType.toUpperCase()}* - *${config.businessName}*\n` +
           `📅 Fecha: ${new Date().toLocaleDateString()}\n\n` +
           `🍰 *Producto:* ${selectedRecipe.name}\n` +
           `📦 *Cantidad:* ${results.totalYield} Unidades\n` +
           `💵 *Valor Unitario:* ${results.currencySymbol} ${results.pricePerUnit.toFixed(2)}\n` +
           `✨ *TOTAL A PAGAR:* *${results.currencySymbol} ${results.finalSellingPrice.toFixed(2)}*\n\n` +
           `🏦 *Métodos de Pago:*\n` +
           `• Pago Móvil: ${config.pagoMovilPhone}\n` +
           `• Zelle: ${config.zelleEmail}\n` +
           `• Banco: ${config.bankName}\n\n` +
           `📌 *Condiciones:*\n` +
           `1. Validez de cotización: 7 días.\n` +
           `2. Se requiere 50% de abono para procesar el pedido.\n` +
           `3. Pagos en Bs regidos por tasa BCV oficial (Bs. ${config.bcvRate}/$).\n\n` +
           `📞 Contacto: ${config.phone}\n` +
           `_Calculado con Kuadrapp_`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${config.documentType} - ${config.businessName}`,
          text: getShareText(),
        });
        showToast('📤 ¡Cotización compartida!');
      } catch (error) {}
    } else {
      handleShareWhatsApp();
    }
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#150d27] text-slate-100' : 'bg-[#f8fafc] text-slate-900';
  const bgHeader = isDark ? 'bg-[#221345]/95 border-[#341d6b]' : 'bg-white/90 border-slate-200/80 shadow-sm';
  const bgCard = isDark ? 'bg-[#221345]/80 border-[#341d6b] shadow-xl shadow-black/40' : 'bg-white border-slate-200/80 shadow-xl shadow-slate-200/60';
  const bgInner = isDark ? 'bg-[#150d27] border-[#341d6b]' : 'bg-slate-50 border-slate-200/80';
  const textSub = isDark ? 'text-slate-300' : 'text-slate-500';
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const activeTabColor = isDark 
    ? 'text-[#F9D371] bg-[#F47340]/20 border border-[#F47340]/30 scale-105 shadow-sm' 
    : 'text-[#8843F2] bg-[#8843F2]/10 border border-[#8843F2]/25 scale-105 shadow-sm font-bold';

  if (!currentUser) {
    return <LoginView showToast={showToast} />;
  }

  if (currentUser.plan === 'superadmin') {
    return <SuperAdminView showToast={showToast} />;
  }

  if (isLoadingDB || !config) {
    return (
      <div className="min-h-screen bg-[#150d27] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-[#8843F2] flex items-center justify-center font-black">K</div>
          <span className="text-xs font-bold text-slate-300">Conectando con Kuadrapp Cloud...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgMain} flex flex-col font-['Inter',sans-serif] selection:bg-[#EF2A82] selection:text-white transition-colors duration-300 relative`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif !important; }
      `}</style>

      <Toast message={toastMessage} />

      <Header 
        isDark={isDark} 
        setTheme={setTheme} 
        currencyMode={config.currencyMode} 
        setCurrencyMode={(mode) => setConfig({...config, currencyMode: mode})} 
        bgHeader={bgHeader} 
        textMain={textMain} 
        textSub={textSub} 
      />

      <main className="flex-1 max-w-md w-full mx-auto p-4 pt-3 pb-32 flex flex-col gap-4 animate-fadeIn">
        {activeTab === 'calculator' && (
          <CalculatorView 
            selectedRecipe={selectedRecipe}
            recipes={recipes}
            selectedRecipeId={selectedRecipeId}
            setSelectedRecipeId={setSelectedRecipeId}
            desiredYield={desiredYield}
            setDesiredYield={setDesiredYield}
            results={results}
            config={config}
            isDark={isDark}
            bgCard={bgCard}
            bgInner={bgInner}
            textMain={textMain}
            textSub={textSub}
            setActiveTab={setActiveTab}
            dropdownRef={dropdownRef}
            isSelectOpen={isSelectOpen}
            setIsSelectOpen={setIsSelectOpen}
            showToast={showToast}
          />
        )}

        {activeTab === 'ingredients' && (
          <IngredientsView 
            ingredients={ingredients}
            categories={categories}
            selectedFilterCategory={selectedFilterCategory}
            setSelectedFilterCategory={setSelectedFilterCategory}
            isCategoryDropdownOpen={isCategoryDropdownOpen}
            setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            currencySymbol={currencySymbol}
            currencyMultiplier={currencyMultiplier}
            isDark={isDark}
            bgCard={bgCard}
            bgInner={bgInner}
            textMain={textMain}
            textSub={textSub}
            newIngName={newIngName}
            setNewIngName={setNewIngName}
            newIngSupplier={newIngSupplier}
            setNewIngSupplier={setNewIngSupplier}
            newIngCategory={newIngCategory}
            setNewIngCategory={setNewIngCategory}
            newIngPrice={newIngPrice}
            setNewIngPrice={setNewIngPrice}
            newIngQty={newIngQty}
            setNewIngQty={setNewIngQty}
            newIngUnit={newIngUnit}
            setNewIngUnit={setNewIngUnit}
            handleAddIngredient={handleAddIngredient}
            handleDeleteIngredient={handleDeleteIngredient}
            editingId={editingId}
            setEditingId={setEditingId}
            editPriceVal={editPriceVal}
            setEditPriceVal={setEditPriceVal}
            handleUpdatePrice={handleUpdatePrice}
            isAddingNewCat={isAddingNewCat}
            setIsAddingNewCat={setIsAddingNewCat}
            customCatName={customCatName}
            setCustomCatName={setCustomCatName}
            handleCreateCategory={handleCreateCategory}
            isNewIngCategoryOpen={isNewIngCategoryOpen}
            setIsNewIngCategoryOpen={setIsNewIngCategoryOpen}
            isNewIngUnitOpen={isNewIngUnitOpen}
            setIsNewIngUnitOpen={setIsNewIngUnitOpen}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView 
            recipes={recipes}
            showRecipeModal={showRecipeModal}
            setShowRecipeModal={(show) => {
              if (show) handleOpenCreateModal();
              else setShowRecipeModal(false);
            }}
            newRecipeName={newRecipeName}
            setNewRecipeName={setNewRecipeName}
            newRecipeYield={newRecipeYield}
            setNewRecipeYield={setNewRecipeYield}
            newRecipePrep={newRecipePrep}
            setNewRecipePrep={setNewRecipePrep}
            newRecipeOven={newRecipeOven}
            setNewRecipeOven={setNewRecipeOven}
            newRecipeMargin={newRecipeMargin}
            setNewRecipeMargin={setNewRecipeMargin}
            showAdvancedSettings={showAdvancedSettings}
            setShowAdvancedSettings={setShowAdvancedSettings}
            recipeItems={recipeItems}
            selectedIngToAdd={selectedIngToAdd}
            setSelectedIngToAdd={setSelectedIngToAdd}
            qtyToAdd={qtyToAdd}
            setQtyToAdd={setQtyToAdd}
            handleAddIngredientToRecipe={handleAddIngredientToRecipe}
            handleRemoveItemFromRecipe={handleRemoveItemFromRecipe}
            handleSaveNewRecipe={handleSaveNewRecipe}
            handleEditRecipe={handleEditRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
            handleAuditRecipe={handleAuditRecipe}
            ingredients={ingredients}
            ingredientSearchQuery={ingredientSearchQuery}
            setIngredientSearchQuery={setIngredientSearchQuery}
            isRecipeIngOpen={isRecipeIngOpen}
            setIsRecipeIngOpen={setIsRecipeIngOpen}
            filteredIngredientsForRecipe={filteredIngredientsForRecipe}
            selectedIngObj={selectedIngObj}
            calculateRecipe={calculateRecipe}
            isDark={isDark}
            bgCard={bgCard}
            bgInner={bgInner}
            textMain={textMain}
            textSub={textSub}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            showToast={showToast}
            currentUser={currentUser}
            updatePassword={updatePassword}
            logout={logout}
            tempConfig={tempConfig}
            setTempConfig={setTempConfig}
            isSavingConfig={isSavingConfig}
            handleSaveConfig={handleSaveConfig}
            handleFetchLiveBCV={handleFetchLiveBCV}
            isDark={isDark}
            bgCard={bgCard}
            bgInner={bgInner}
            textMain={textMain}
            textSub={textSub}
          />
        )}

        {activeTab === 'quotation-preview' && results && selectedRecipe && (
          <QuotationPreviewView 
            results={results}
            selectedRecipe={selectedRecipe}
            config={config}
            setActiveTab={setActiveTab}
            handleShareWhatsApp={handleShareWhatsApp}
            handleNativeShare={handleNativeShare}
          />
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        bgHeader={bgHeader} 
        textSub={textSub} 
        activeTabColor={activeTabColor} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}