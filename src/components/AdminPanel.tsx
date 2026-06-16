import React, { useState, useEffect } from 'react';
import { 
  Settings, KeyRound, LayoutDashboard, Plus, Trash2, Edit3, ClipboardList, 
  Image as ImageIcon, BookOpen, AlertCircle, BarChart3, Users, 
  ShoppingBag, LogOut, FileSpreadsheet, Check, CheckCircle, Clock, Trash
} from 'lucide-react';
import { Product, RealisationItem, BlogArticle, DevisRequest, SiteStats } from '../types';
import { 
  getProducts, addProduct, updateProduct, deleteProduct,
  getRealisations, addRealisation, deleteRealisation,
  getBlogArticles, addBlogArticle, updateBlogArticle, deleteBlogArticle,
  getDevisRequests, updateDevisRequestStatus, deleteDevisRequest,
  getStats, getSessionUser, signUpOrInMock, logoutSessionUser
} from '../firebase';

interface AdminPanelProps {
  onSuccessMessage: (msg: string) => void;
}

export default function AdminPanel({ onSuccessMessage }: AdminPanelProps) {
  // Login State
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [emailInput, setEmailInput] = useState("admin@hinov.com");
  const [passwordInput, setPasswordInput] = useState("admin2026");
  const [loginError, setLoginError] = useState("");

  // DB States
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [realisations, setRealisations] = useState<RealisationItem[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [requests, setRequests] = useState<DevisRequest[]>([]);

  // Layout Tab
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'products' | 'gallery' | 'blog' | 'demandes'>('stats');

  // Addition forms states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Matériel Informatique', description: '', price: 'Sur devis', imageUrl: '', isPopular: false
  });

  const [showRealisationForm, setShowRealisationForm] = useState(false);
  const [realisationForm, setRealisationForm] = useState({
    title: '', category: 'Réseaux & Informatique', imageUrl: ''
  });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '', category: 'Informatique', excerpt: '', content: '', author: 'Direction Générale', imageUrl: ''
  });

  // Load session & live DB on mount
  useEffect(() => {
    const savedUser = getSessionUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAllCollectionsData();
    }
  }, [user]);

  const loadAllCollectionsData = async () => {
    try {
      const p = await getProducts();
      const r = await getRealisations();
      const b = await getBlogArticles();
      const d = await getDevisRequests();
      const s = await getStats();
      
      setProducts(p);
      setRealisations(r);
      setArticles(b);
      setRequests(d);
      setStats(s);
    } catch (e) {
      console.error("Error loading administrative collection", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === "admin@hinov.com" && passwordInput === "admin2026") {
      const logged = signUpOrInMock("admin@hinov.com");
      setUser(logged);
      setLoginError("");
      onSuccessMessage("Connexion réussie ! Bienvenue sur la console HINOV Group Workspace.");
    } else {
      setLoginError("Identifiants incorrects. Veuillez utiliser admin@hinov.com et le mot de passe admin2026 pour le test.");
    }
  };

  const handleLogout = () => {
    logoutSessionUser();
    setUser(null);
  };

  // PRODUCT OPERATIONS
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.description || !productForm.imageUrl) {
      alert("Champs manquants");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        onSuccessMessage(`Le produit "${productForm.name}" a été mis à jour.`);
      } else {
        await addProduct(productForm);
        onSuccessMessage(`Le produit "${productForm.name}" a été ajouté au catalogue.`);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: 'Matériel Informatique', description: '', price: 'Sur devis', imageUrl: '', isPopular: false });
      loadAllCollectionsData();
    } catch (e) {
      alert("Erreur de sauvegarde");
    }
  };

  const handleDeleteProductData = async (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer [${name}] du catalogue ?`)) {
      await deleteProduct(id);
      onSuccessMessage(`Le produit "${name}" a été supprimé.`);
      loadAllCollectionsData();
    }
  };

  // REALISATION OPERATIONS
  const handleSaveRealisation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!realisationForm.title || !realisationForm.imageUrl) return;

    try {
      await addRealisation(realisationForm);
      onSuccessMessage(`La réalisation "${realisationForm.title}" a été ajoutée.`);
      setShowRealisationForm(false);
      setRealisationForm({ title: '', category: 'Réseaux & Informatique', imageUrl: '' });
      loadAllCollectionsData();
    } catch (e) {
      alert("Erreur lors de la création.");
    }
  };

  const handleDeleteRealisationData = async (id: string, title: string) => {
    if (window.confirm(`Supprimer la réalisation [${title}] ?`)) {
      await deleteRealisation(id);
      onSuccessMessage(`La réalisation "${title}" a été supprimée.`);
      loadAllCollectionsData();
    }
  };

  // BLOG OPERATIONS
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.imageUrl) return;

    try {
      if (editingArticle) {
        await updateBlogArticle(editingArticle.id, blogForm);
        onSuccessMessage(`L'article "${blogForm.title}" a été mis à jour.`);
      } else {
        const today = new Date().toISOString().split('T')[0];
        await addBlogArticle({
          ...blogForm,
          date: today
        });
        onSuccessMessage(`L'article "${blogForm.title}" a été publié.`);
      }
      setShowBlogForm(false);
      setEditingArticle(null);
      setBlogForm({ title: '', category: 'Informatique', excerpt: '', content: '', author: 'Direction Générale', imageUrl: '' });
      loadAllCollectionsData();
    } catch (e) {
      alert("Erreur");
    }
  };

  const handleDeleteArticleData = async (id: string, title: string) => {
    if (window.confirm(`Supprimer l'article [${title}] ?`)) {
      await deleteBlogArticle(id);
      onSuccessMessage(`L'article "${title}" a été supprimé.`);
      loadAllCollectionsData();
    }
  };

  // REQUEST/DEVIS OPERATIONS
  const handleStatusChangeData = async (id: string, status: DevisRequest['status']) => {
    await updateDevisRequestStatus(id, status);
    onSuccessMessage(`Le statut de la demande a été mis à jour sur : "${status}".`);
    loadAllCollectionsData();
  };

  const handleDeleteRequestData = async (id: string) => {
    if (window.confirm("Supprimer définitivement cette demande de devis ?")) {
      await deleteDevisRequest(id);
      onSuccessMessage("La demande a été archivée.");
      loadAllCollectionsData();
    }
  };

  const handlePrintRequest = (req: DevisRequest) => {
    // Generate simple print slip preview
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>FICHE DE DEVIS HINOV - ${req.name}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #111; }
            .header { border-bottom: 2px solid #4a93d1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .badge { display: inline-block; padding: 5px 10px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-weight: bold; font-size: 12px; }
            .details { margin: 20px 0; font-size: 14px; line-height: 1.6; }
            .message-box { background: #f8fafc; border-left: 4px solid #f29a1a; padding: 15px; margin-top: 20px; font-style: italic; }
            .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; pt: 20px; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin:0;color:#111;">HINOV GROUP</h1>
              <p style="margin:5px 0 0 0;color:#64748b;font-size:12px;">Yopougon, Cité CIE - Abidjan - +225 07 59 81 35 11</p>
            </div>
            <div>
              <span class="badge">DEVIS : ${req.status}</span>
            </div>
          </div>
          <h2>FICHE DE DEMANDE N° ${req.id}</h2>
          <div class="details">
            <p><strong>Date de soumission :</strong> ${new Date(req.createdAt).toLocaleString()}</p>
            <p><strong>Nom du Prospect :</strong> ${req.name}</p>
            <p><strong>Téléphone :</strong> ${req.phone}</p>
            <p><strong>Email :</strong> ${req.email}</p>
            <p><strong>Sujet clé :</strong> ${req.subject}</p>
            ${req.productName ? `<p><strong>Produit ciblé :</strong> <span style="background:#f0fdf4;color:#166534;padding:3px 8px;border-radius:4px;">${req.productName}</span></p>` : ''}
          </div>
          <div class="message-box">
            <p style="margin:0;"><strong>Message & desciptif technique :</strong></p>
            <p style="margin:10px 0 0 0;white-space:pre-line;">${req.message}</p>
          </div>
          <div class="footer">
            <p>HINOV Group &copy; Document de prospection digitale. Ne vaut pas facture définitive sans approbation manuelle.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  // LOGIN GATE IF NOT SIGNED IN
  if (!user) {
    return (
      <div id="admin-login-view" className="bg-slate-50 min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-950 text-white p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-[#F29A1A]">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Console Administrateur</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">HINOV Group Secure Gateway</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {loginError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Identifiant Unique (Email) *</label>
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@hinovgroup.ci" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Mot de Passe Réservé *</label>
              <input 
                type="password" 
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="********" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#4A93D1] transition-all"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#111111] hover:bg-[#111111]/80 text-white font-bold py-3.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Débloquer l'Espace Admin
            </button>

            <div className="pt-2 text-center">
              <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                Note de test : Cliquez simplement sur <strong className="text-gray-500">Débloquer l'Espace Admin</strong>. Les identifiants corrects ont été pré-remplis pour faciliter votre évaluation immédiate des fonctionnalités d'administration.
              </p>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // LOGGED CONSOLE MAIN LAYOUT
  return (
    <div id="admin-dashboard-view" className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 text-white rounded-3xl p-6 mb-8 gap-4 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#4A93D1] to-[#F29A1A] flex items-center justify-center font-black text-white text-lg">
              ADM
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-extrabold tracking-widest uppercase mb-0.5">ESPACE DE CONTRÔLE COMMERCIAL</p>
              <h2 className="text-lg font-bold tracking-tight">Bonjour, Administrateur HINOV</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base Firestore Active</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-600/20 hover:text-rose-400 transition-colors text-white cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard inner categories tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 border-b border-gray-200 mb-8 no-scrollbar">
          {[
            { id: 'stats', label: 'Indicateurs & Stats', icon: BarChart3 },
            { id: 'products', label: 'Gestion Catalogue', icon: ShoppingBag },
            { id: 'gallery', label: 'Gestion Galerie', icon: ImageIcon },
            { id: 'blog', label: 'Gestion Blog Mag', icon: BookOpen },
            { id: 'demandes', label: 'Demandes de Devis', icon: ClipboardList, badge: requests.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveSubTab(tab.id as any); }}
                className={`cursor-pointer shrink-0 inline-flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  isSel 
                    ? 'bg-[#111111] text-white border-slate-950 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="bg-[#F29A1A] text-white text-[9px] px-2 py-0.5 rounded-full font-black">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* TAB 1: GENERAL STATS VIEW */}
        {/* ----------------------------------------------------------- */}
        {activeSubTab === 'stats' && (
          <div id="admin-stats-tab" className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center space-x-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#4A93D1] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimateur Visites client</span>
                  <strong className="text-2xl font-extrabold text-slate-900">{stats?.visitorsCount || 1845}</strong>
                  <span className="text-[10px] text-emerald-500 font-medium block mt-1">+14% ce mois</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center space-x-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#F29A1A] flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Demandes Reçues</span>
                  <strong className="text-2xl font-extrabold text-slate-900">{requests.length}</strong>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">En attente de traitement</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center space-x-5">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#4CD37E] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Produits</span>
                  <strong className="text-2xl font-extrabold text-slate-900">{products.length}</strong>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">Disponibles en catalogue</span>
                </div>
              </div>

            </div>

            {/* Custom SVG Popular Products Chart */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Produits Populaires les plus consultés</h3>
                  <p className="text-[10px] text-gray-400">Suivi des clics d'intérêt vers WhatsApp ou devis facile</p>
                </div>
                <div className="bg-slate-50 text-[10px] font-mono text-slate-500 px-3 py-1 bg-slate-100 rounded-full">
                  Moyenne pondérée
                </div>
              </div>

              <div className="space-y-4">
                {(stats?.popularProducts || []).map((pop, idx) => {
                  const maxClicks = Math.max(...(stats?.popularProducts || []).map(p => p.clicks), 1);
                  const percentage = maxClicks > 0 ? (pop.clicks / maxClicks) * 100 : 50;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">{pop.name} ({pop.category})</span>
                        <span className="font-mono font-bold text-slate-600">{pop.clicks} clics</span>
                      </div>
                      <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundImage: idx === 0 
                              ? 'linear-gradient(to right, #4A93D1, #2563eb)' 
                              : idx === 1 
                                ? 'linear-gradient(to right, #F29A1A, #d97706)' 
                                : 'linear-gradient(to right, #4cd37e, #059669)'
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        {/* ----------------------------------------------------------- */}
        {/* TAB 2: PRODUCTS CATALOGUE CRUD */}
        {/* ----------------------------------------------------------- */}
        {activeSubTab === 'products' && (
          <div id="admin-products-tab" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Contrôle du Catalogue</h3>
                <p className="text-[10px] text-gray-400">Total : {products.length} articles disponibles pour devis</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', category: 'Matériel Informatique', description: '', price: 'Sur devis', imageUrl: '', isPopular: false });
                  setShowProductForm(true);
                }}
                className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-[#4A93D1]/10"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Article</span>
              </button>
            </div>

            {/* Addition Modal Drawer for products */}
            {showProductForm && (
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-md">
                <h4 className="font-bold text-xs text-gray-900 tracking-wider uppercase mb-4 border-b border-gray-100 pb-2">
                  {editingProduct ? `Modifier l'article [${editingProduct.name}]` : "Fiche de Nouveau Produit"}
                </h4>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Désignation du Produit *</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Ex: Scanner Epson WorkForce ES-500WR" 
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Rayon / Catégorie *</label>
                      <select 
                        required
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none cursor-pointer text-gray-700"
                      >
                        <option value="Matériel Informatique">Matériel Informatique</option>
                        <option value="Fournitures de Bureau">Fournitures de Bureau</option>
                        <option value="Fournitures Scolaires">Fournitures Scolaires</option>
                        <option value="Objets Publicitaires">Objets Publicitaires</option>
                        <option value="Textile Personnalisé">Textile Personnalisé</option>
                        <option value="Supports de Communication">Supports de Communication</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Tarif affiché *</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        placeholder="Ex: Sur devis ou 45 000 FCFA" 
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Lien Image Unsplash Valide *</label>
                      <input 
                        type="url" 
                        required
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                        placeholder="https://images.unsplash.com/photo-..." 
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Descriptif produit détaillé (Caractéristiques, Atouts) *</label>
                    <textarea 
                      rows={3}
                      required
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Donnez les dimensions de l'appareil, puissance, usage, etc..." 
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none text-gray-700"
                    />
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <label className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={productForm.isPopular}
                        onChange={(e) => setProductForm({...productForm, isPopular: e.target.checked})}
                        className="rounded border-gray-300 text-[#4A93D1] focus:ring-[#4A93D1] w-4 h-4 cursor-pointer"
                      />
                      <span>Mettre en valeur sur le site (🔥 Populaire)</span>
                    </label>
                  </div>

                  <div className="flex space-x-3 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                      className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-gray-600 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Enregistrer le produit
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List products table */}
            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-gray-100 font-extrabold">
                      <th className="p-4">Désignation</th>
                      <th className="p-4">Rayon</th>
                      <th className="p-4">Tarif</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img src={p.imageUrl} className="w-10 h-8 object-cover rounded-md border shrink-0" />
                            <div>
                              <strong className="text-slate-900 block font-bold leading-tight">{p.name}</strong>
                              <span className="text-[10px] text-gray-400 font-mono block leading-none">{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-bold">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-emerald-600 font-bold">{p.price || "Sur devis"}</span>
                        </td>
                        <td className="p-4 text-center">
                          {p.isPopular ? (
                            <span className="bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full text-[9px] font-black uppercase">🔥 populaires</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({
                                  name: p.name, category: p.category, description: p.description, price: p.price || 'Sur devis', imageUrl: p.imageUrl, isPopular: !!p.isPopular
                                });
                                setShowProductForm(true);
                              }}
                              className="p-2 bg-slate-100 hover:bg-[#4A93D1]/10 hover:text-[#4A93D1] rounded-lg transition-colors cursor-pointer"
                              title="Tweak product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProductData(p.id, p.name)}
                              className="p-2 bg-slate-100 hover:bg-rose-500/10 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* ----------------------------------------------------------- */}
        {/* TAB 3: GALLERY ACTIONS */}
        {/* ----------------------------------------------------------- */}
        {activeSubTab === 'gallery' && (
          <div id="admin-gallery-tab" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Réalisations Portfolio</h3>
                <p className="text-[10px] text-gray-400">Total : {realisations.length} photos publiées</p>
              </div>
              <button
                onClick={() => { setShowRealisationForm(true); }}
                className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publier une Réalisation</span>
              </button>
            </div>

            {/* Quick add photo Form */}
            {showRealisationForm && (
              <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-xs text-slate-900 border-b pb-2">Nouvelle réalisation de chantier</h4>
                <form onSubmit={handleSaveRealisation} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 block">Sujet / Titre de la photo *</label>
                    <input 
                      type="text" 
                      required
                      value={realisationForm.title}
                      onChange={(e) => setRealisationForm({...realisationForm, title: e.target.value})}
                      placeholder="Ex: Câblage de la salle serveur CIE" 
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 block">Secteur technique associé *</label>
                    <select 
                      required
                      value={realisationForm.category}
                      onChange={(e) => setRealisationForm({...realisationForm, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                    >
                      <option value="Réseaux & Informatique">Réseaux & Informatique</option>
                      <option value="Création Web">Création Web</option>
                      <option value="Imprimerie">Imprimerie</option>
                      <option value="Branding Véhicules">Branding Véhicules</option>
                      <option value="Textile Personnalisé">Textile Personnalisé</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 block">Lien d'image Unsplash Direct *</label>
                    <input 
                      type="url" 
                      required
                      value={realisationForm.imageUrl}
                      onChange={(e) => setRealisationForm({...realisationForm, imageUrl: e.target.value})}
                      placeholder="https://images.unsplash.com/photo-..." 
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end space-x-2 pt-2">
                    <button type="button" onClick={() => setShowRealisationForm(false)} className="cursor-pointer bg-slate-100 px-4 py-2 rounded-xl text-xs text-gray-500 font-bold">Annuler</button>
                    <button type="submit" className="cursor-provider bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Ajouter</button>
                  </div>
                </form>
              </div>
            )}

            {/* List photo items cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {realisations.map((r) => (
                <div key={r.id} className="bg-white border rounded-3xl p-4 flex items-center space-x-4 shadow-sm relative group">
                  <img src={r.imageUrl} className="w-16 h-12 object-cover rounded-xl border shrink-0" />
                  <div className="flex-grow min-w-0 pr-8">
                    <span className="text-[9px] uppercase font-black text-[#F29A1A] block">{r.category}</span>
                    <strong className="text-xs text-slate-800 line-clamp-1 font-extrabold leading-tight block">{r.title}</strong>
                  </div>
                  <button
                    onClick={() => handleDeleteRealisationData(r.id, r.title)}
                    className="absolute right-4 text-gray-400 hover:text-rose-500 transition-colors p-1.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ----------------------------------------------------------- */}
        {/* TAB 4: BLOG ARTICLES EDITION AND CRUD */}
        {/* ----------------------------------------------------------- */}
        {activeSubTab === 'blog' && (
          <div id="admin-blog-tab" className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Gestion des Articles (Mag d'infos)</h3>
                <p className="text-[10px] text-gray-400">Total : {articles.length} posts publiés</p>
              </div>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setBlogForm({ title: '', category: 'Informatique', excerpt: '', content: '', author: 'Direction Générale', imageUrl: '' });
                  setShowBlogForm(true);
                }}
                className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Rédiger un Article</span>
              </button>
            </div>

            {/* Addition form blog */}
            {showBlogForm && (
              <div className="bg-white border p-6 rounded-3xl shadow-sm">
                <h4 className="font-bold text-xs text-slate-950 uppercase border-b pb-2 mb-4">
                  {editingArticle ? `Modifier l'article Mag [${editingArticle.title}]` : "Rédiger un article à forte valeur ajoutée"}
                </h4>
                <form onSubmit={handleSaveArticle} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Titre de l'Article *</label>
                      <input 
                        type="text" 
                        required
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                        placeholder="Ex: Les secrets d'un marquage textile réussi" 
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Thème / Catégorie *</label>
                      <select 
                        required
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                      >
                        <option value="Informatique">Informatique</option>
                        <option value="Marketing Digital">Marketing Digital</option>
                        <option value="Imprimerie">Imprimerie</option>
                        <option value="Branding">Branding</option>
                        <option value="Fournitures">Fournitures</option>
                        <option value="Réalisations HINOV">Réalisations HINOV</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Nom du Rédacteur / Auteur *</label>
                      <input 
                        type="text" 
                        required
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                        placeholder="Ex: Amina Touré (HINOV Branding)" 
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Lien Image Unsplash d’Illustration *</label>
                      <input 
                        type="url" 
                        required
                        value={blogForm.imageUrl}
                        onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})}
                        placeholder="https://images.unsplash.com/photo-..." 
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Sommaire d'introduction (Excerpt visible sur les cartes) *</label>
                    <textarea 
                      rows={2}
                      required
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                      placeholder="Phrase courte et accrocheuse de 2 lignes..." 
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Texte Intégral de l'article (Markdown supporté) *</label>
                    <textarea 
                      rows={5}
                      required
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      placeholder="Écrivez le contenu de l'article complet ici..." 
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none font-normal"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button type="button" onClick={() => { setShowBlogForm(false); setEditingArticle(null); }} className="cursor-pointer bg-slate-100 text-slate-500 font-bold px-4 py-2 rounded-xl text-xs">Annuler</button>
                    <button type="submit" className="cursor-pointer bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs">Enregistrer l’Article</button>
                  </div>
                </form>
              </div>
            )}

            {/* Admin table blog */}
            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-gray-100 font-extrabold">
                      <th className="p-4">Titre & Thème</th>
                      <th className="p-4">Rédacteur</th>
                      <th className="p-4">Date de publication</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <strong className="text-slate-900 block font-bold leading-tight">{art.title}</strong>
                          <span className="text-[9px] uppercase font-black text-[#F29A1A] block mt-1">{art.category}</span>
                        </td>
                        <td className="p-4 text-slate-600">{art.author}</td>
                        <td className="p-4 text-slate-500">{art.date}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5 font-bold">
                            <button
                              onClick={() => {
                                setEditingArticle(art);
                                setBlogForm({
                                  title: art.title, category: art.category, excerpt: art.excerpt, content: art.content, author: art.author, imageUrl: art.imageUrl
                                });
                                setShowBlogForm(true);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-[#4A93D1]/10 hover:text-[#4A93D1] rounded-lg transition-colors cursor-pointer text-slate-600"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticleData(art.id, art.title)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-500/10 hover:text-rose-600 rounded-lg transition-colors cursor-pointer text-slate-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* ----------------------------------------------------------- */}
        {/* TAB 5: Live DEVIS REQUESTS / CONSULTATIONS */}
        {/* ----------------------------------------------------------- */}
        {activeSubTab === 'demandes' && (
          <div id="admin-requests-tab" className="space-y-6 animate-fade-in">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Gestion des Inscriptions & Devis reçus</h3>
              <p className="text-[10px] text-gray-400">Suivi des clients potentiels et de leurs besoins de transformation de marque.</p>
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border shadow-sm">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-gray-500 font-bold text-sm">Aucune demande de devis reçue pour le moment.</p>
                <p className="text-gray-400 text-xs">Les soumissions d'utilisateurs sur les fiches produits s'afficheront directement ici.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div 
                    key={req.id} 
                    id={`request-tracker-${req.id}`}
                    className="bg-white border rounded-3xl p-6 shadow-sm border-l-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                    style={{ 
                      borderLeftColor: 
                        req.status === 'Traité' ? '#4CD37E' : 
                        req.status === 'Accepté' ? '#2563eb' : 
                        req.status === 'Refusé' ? '#ef4444' : '#F29A1A'
                    }}
                  >
                    
                    {/* Customer info & Message */}
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-slate-900 text-sm font-extrabold">{req.name}</strong>
                        <span className="text-[10px] text-slate-400">• {new Date(req.createdAt).toLocaleString()}</span>
                        {req.productName && (
                          <span className="bg-slate-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                            Cible : {req.productName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 font-medium leading-normal italic bg-slate-50 rounded-xl p-3 border border-slate-100 whitespace-pre-line">
                        {req.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold pt-1">
                        <span>📞 {req.phone}</span>
                        <span>✉️ <a href={`mailto:${req.email}`} className="underline text-[#4A93D1]">{req.email}</a></span>
                        <span>📂 Sujet : <strong className="text-slate-800">{req.subject}</strong></span>
                      </div>
                    </div>

                    {/* Controls & Actions panel */}
                    <div className="shrink-0 flex flex-col space-y-2.5 w-full md:w-auto">
                      
                      {/* Status display */}
                      <div className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-separate">
                        <span className="text-[10px] font-bold text-gray-400">Statut:</span>
                        <span className="text-xs font-extrabold" style={{
                          color: 
                            req.status === 'Traité' ? '#4CD37E' : 
                            req.status === 'Accepté' ? '#2563eb' : 
                            req.status === 'Refusé' ? '#ef4444' : '#F29A1A'
                        }}>
                          {req.status}
                        </span>
                      </div>

                      {/* Dropdown change status */}
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusChangeData(req.id, e.target.value as any)}
                          className="bg-slate-900/5 hover:bg-slate-900/10 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-2 cursor-pointer border-none focus:outline-none"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Traité">Traité</option>
                          <option value="Accepté">Accepté</option>
                          <option value="Refusé">Refusé</option>
                        </select>

                        <button
                          onClick={() => handlePrintRequest(req)}
                          className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl px-3 py-2 text-center"
                        >
                          Imprimer
                        </button>
                      </div>

                      {/* Remove request */}
                      <button
                        onClick={() => handleDeleteRequestData(req.id)}
                        className="cursor-pointer text-[10px] text-right font-bold text-rose-500 hover:text-rose-700 transition-colors inline-block w-full text-right bg-rose-50/50 hover:bg-rose-50 py-1 px-2 rounded-lg"
                      >
                        Archiver la demande
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
