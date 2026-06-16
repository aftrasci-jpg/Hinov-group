import React, { useState, useEffect } from 'react';
import { 
  Settings, LayoutDashboard, Briefcase, Image as ImageIcon, FileText, 
  ShoppingBag, ShieldAlert, LogOut, Plus, Trash2, Edit3, 
  CheckCircle, FileDown, TrendingUp, Users, ShoppingCart, RefreshCw, X, Sparkles, Send, Database, ClipboardList 
} from 'lucide-react';
import { Product, RealisationItem, BlogArticle, DevisRequest, SiteStats } from '../types';
import { 
  getSessionUser, signUpOrInMock, logoutSessionUser,
  getProducts, addProduct, updateProduct, deleteProduct,
  getRealisations, addRealisation, deleteRealisation, updateRealisation,
  getBlogArticles, addBlogArticle, updateBlogArticle, deleteBlogArticle,
  getDevisRequests, updateDevisRequestStatus, deleteDevisRequest,
  getStats
} from '../firebase';
import { getCloudinaryConfig, uploadToCloudinary } from '../utils/cloudinary';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  onNotify: (msg: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function AdminDashboard({ onNotify, setCurrentTab }: AdminDashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('admin@hinov.com');
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'catalogue' | 'galerie' | 'blog' | 'demandes'>('dashboard');

  // Core Db state
  const [products, setProducts] = useState<Product[]>([]);
  const [realisations, setRealisations] = useState<RealisationItem[]>([]);
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([]);
  const [devisRequests, setDevisRequests] = useState<DevisRequest[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);

  // Modal / Form state fields
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Matériel Informatique', description: '', price: 'Sur devis', imageUrl: '', isPopular: false
  });

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingRealisation, setEditingRealisation] = useState<RealisationItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '', category: 'Réseaux & Informatique', imageUrl: ''
  });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '', category: 'Informatique', excerpt: '', content: '', imageUrl: '', author: 'Direction HINOV'
  });

  const [pdfInvoice, setPdfInvoice] = useState<DevisRequest | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOverProduct, setDragOverProduct] = useState(false);
  const [dragOverGallery, setDragOverGallery] = useState(false);

  const handleProductFileEvent = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onNotify("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP...)");
      return;
    }
    setIsUploading(true);
    try {
      const { isConfigured } = getCloudinaryConfig();
      if (isConfigured) {
        onNotify("📤 Téléversement de l'image vers Cloudinary...");
        const cloudinaryUrl = await uploadToCloudinary(file);
        setProductForm(prev => ({ ...prev, imageUrl: cloudinaryUrl }));
        onNotify("✓ Image de produit téléversée sur Cloudinary !");
      } else {
        const base64 = await compressAndGetBase64(file);
        setProductForm(prev => ({ ...prev, imageUrl: base64 }));
        onNotify("✓ Image enregistrée en local (Base64). Configurez Cloudinary pour le stockage cloud permanent.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur de téléversement";
      onNotify(`Erreur : ${errorMsg}`);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryFileEvent = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onNotify("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP...)");
      return;
    }
    setIsUploading(true);
    try {
      const { isConfigured } = getCloudinaryConfig();
      if (isConfigured) {
        onNotify("📤 Téléversement de l'image vers Cloudinary...");
        const cloudinaryUrl = await uploadToCloudinary(file);
        setGalleryForm(prev => ({ ...prev, imageUrl: cloudinaryUrl }));
        onNotify("✓ Image de réalisation téléversée sur Cloudinary !");
      } else {
        const base64 = await compressAndGetBase64(file);
        setGalleryForm(prev => ({ ...prev, imageUrl: base64 }));
        onNotify("✓ Image enregistrée en local (Base64). Configurez Cloudinary pour le stockage cloud permanent.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur de téléversement";
      onNotify(`Erreur : ${errorMsg}`);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // High performance light-weight image downscale optimizer
  const compressAndGetBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 800; // Optimal HD dimensions
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // high compression ratio for long-term storage
            resolve(dataUrl);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => {
          resolve(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Sync session and data
  useEffect(() => {
    const activeSession = getSessionUser();
    if (activeSession) {
      setUser(activeSession);
      loadAllMockDb();
    }
  }, []);

  const loadAllMockDb = async () => {
    try {
      const [prods, reals, articles, requests, s] = await Promise.all([
        getProducts(),
        getRealisations(),
        getBlogArticles(),
        getDevisRequests(),
        getStats()
      ]);
      setProducts(prods);
      setRealisations(reals);
      setBlogArticles(articles);
      setDevisRequests(requests);
      setStats(s);
    } catch (e) {
      console.error("Failed to load dashboard logs", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const session = signUpOrInMock(username);
    setUser(session);
    loadAllMockDb();
    onNotify("Connexion établie à la console d'administration HINOV !");
  };

  const handleLogout = () => {
    logoutSessionUser();
    setUser(null);
    onNotify("Déconnexion de l'espace Administrateur.");
  };

  // PRODUCTS OPERATIONS
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Matériel Informatique', description: '', price: 'Sur devis', imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600', isPopular: false });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, category: p.category, description: p.description, price: p.price || 'Sur devis', imageUrl: p.imageUrl, isPopular: !!p.isPopular });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        onNotify(`Le produit "${productForm.name}" a été modifié avec succès !`);
      } else {
        await addProduct(productForm);
        onNotify(`Le produit "${productForm.name}" a été ajouté au catalogue !`);
      }
      setIsProductModalOpen(false);
      loadAllMockDb();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductDelete = async (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer "${name}" du catalogue ?`)) {
      await deleteProduct(id);
      onNotify("Produit retiré.");
      loadAllMockDb();
    }
  };

  // Portfolio items operations
  const openAddRealisation = () => {
    setEditingRealisation(null);
    setGalleryForm({ title: '', category: 'Réseaux & Informatique', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600' });
    setIsGalleryModalOpen(true);
  };

  const openEditRealisation = (item: RealisationItem) => {
    setEditingRealisation(item);
    setGalleryForm({ title: item.title, category: item.category, imageUrl: item.imageUrl });
    setIsGalleryModalOpen(true);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRealisation) {
        await updateRealisation(editingRealisation.id, galleryForm);
        onNotify(`La réalisation "${galleryForm.title}" a été modifiée avec succès !`);
      } else {
        await addRealisation(galleryForm);
        onNotify(`Nouvelle réalisation "${galleryForm.title}" ajoutée avec succès !`);
      }
      setIsGalleryModalOpen(false);
      setGalleryForm({ title: '', category: 'Réseaux & Informatique', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600' });
      setEditingRealisation(null);
      loadAllMockDb();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    if (confirm("Supprimer cette photo de la galerie de réalisations ?")) {
      await deleteRealisation(id);
      onNotify("Réalisation retirée de la galerie.");
      loadAllMockDb();
    }
  };

  // BLOG Operations
  const openAddArticle = () => {
    setEditingArticle(null);
    setBlogForm({ title: '', category: 'Informatique', excerpt: '', content: '', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600', author: 'Direction HINOV' });
    setIsBlogModalOpen(true);
  };

  const openEditArticle = (a: BlogArticle) => {
    setEditingArticle(a);
    setBlogForm({ title: a.title, category: a.category, excerpt: a.excerpt, content: a.content, imageUrl: a.imageUrl, author: a.author });
    setIsBlogModalOpen(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await updateBlogArticle(editingArticle.id, blogForm);
        onNotify("Article de blog mis à jour.");
      } else {
        await addBlogArticle({
          ...blogForm,
          date: new Date().toISOString().split('T')[0]
        });
        onNotify("Nouvel article de blog publié !");
      }
      setIsBlogModalOpen(false);
      loadAllMockDb();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (confirm("Voulez-vous supprimer cet article de blog ?")) {
      await deleteBlogArticle(id);
      onNotify("Article de blog supprimé.");
      loadAllMockDb();
    }
  };

  // Devis Operations
  const handleStatusChange = async (id: string, status: DevisRequest['status']) => {
    await updateDevisRequestStatus(id, status);
    onNotify(`Statut de la demande modifié pour : ${status}`);
    loadAllMockDb();
  };

  const handleDevisRequestDelete = async (id: string) => {
    if (confirm("Supprimer définitivement cette demande de devis client ?")) {
      await deleteDevisRequest(id);
      onNotify("Demande archivée et supprimée.");
      loadAllMockDb();
    }
  };

  // PDF Quote Generation Simulator
  const handlePrintQuote = (req: DevisRequest) => {
    setPdfInvoice(req);
  };

  // If not logged in, show elegant login block
  if (!user) {
    return (
      <div id="hinov-admin-login-view" className="bg-slate-900 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl relative overflow-hidden text-white space-y-6">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#F29A1A]/10 rounded-full filter blur-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4A93D1]/10 rounded-full filter blur-xl" />

          {/* Icon Brand geometry */}
          <div className="flex flex-col items-center space-y-3 relative z-10 text-center">
            <motion.img 
              src="https://res.cloudinary.com/dzthrix45/image/upload/q_auto/f_auto/v1781601015/IMG-20260612-WA0002_2_gg2vtq.jpg" 
              alt="Logo HINOV Group" 
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-slate-800 shadow-lg cursor-pointer"
              animate={{ 
                scale: [1, 1.35, 1, 1],
                rotate: [0, 180, 360, 360],
              }}
              transition={{ 
                duration: 5, 
                ease: "easeInOut",
                times: [0, 0.3, 0.6, 1],
                repeat: Infinity
              }}
              whileHover={{ 
                scale: [1, 1.35, 1.35, 1],
                rotate: [0, 180, 360, 360],
                transition: { 
                  duration: 2.4, 
                  ease: "easeInOut",
                  times: [0, 0.35, 0.75, 1]
                } 
              }}
              whileTap={{ scale: 0.9 }}
            />
            <div>
              <h2 className="font-extrabold text-2xl tracking-tight text-white leading-none">Console HINOV</h2>
              <span className="text-[10px] text-[#F29A1A] font-mono tracking-widest uppercase mt-1 block">ACCÈS ADMINISTRATEUR</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs text-gray-400">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-light">
              Cette console permet de gérer le catalogue de fournitures, les articles de presse HINOV, les réalisations et d’éditer les devis clients.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Identifiant Professionnel</label>
              <input 
                type="email" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@hinov.com" 
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#4A93D1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Mot de Passe Administrateur</label>
              <input 
                type="password" 
                required
                defaultValue="••••••••" 
                placeholder="Entrez vos coordonnées" 
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#4A93D1]"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl py-3.5 text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Établir la Connexion Administrateur
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setCurrentTab('accueil')}
              className="text-[10px] text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Retourner au site public
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loaded administrative workspace
  return (
    <div id="hinov-admin-dashboard" className="bg-slate-50 min-h-screen">
      
      {/* Header Profile controls */}
      <div className="bg-slate-950 text-white border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#F29A1A]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#F29A1A] uppercase tracking-widest block font-mono">WORKSPACE SÉCURISÉ</span>
              <h3 className="text-sm font-extrabold text-white leading-none mt-0.5">Console Admin - {user.displayName}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
              ⚡ Statut : <strong className="text-emerald-400">Dual-Suite (LocalStorage permanent)</strong>
            </span>
            {getCloudinaryConfig().isConfigured ? (
              <span className="text-xs text-gray-400 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloudinary : <strong className="text-emerald-400 font-bold">Actif</strong></span>
              </span>
            ) : (
              <span className="text-xs text-gray-400 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center space-x-1.5" title="Configurez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans vos secrets.">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Cloudinary : <strong className="text-[#F29A1A] font-bold">Local (Base64)</strong></span>
              </span>
            )}
            <button 
              onClick={handleLogout}
              className="cursor-pointer bg-red-600/25 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/10 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Quitter</span>
            </button>
          </div>

        </div>
      </div>

      {/* Internal Navigation & Content layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel - Tab buttons list */}
          <div className="lg:col-span-3 flex flex-col space-y-2">
            {[
              { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
              { id: 'catalogue', label: 'Gestion Catalogue', icon: ShoppingBag },
              { id: 'galerie', label: 'Gestion Galerie', icon: ImageIcon },
              { id: 'blog', label: 'Gestion Blog', icon: FileText },
              { id: 'demandes', label: 'Demandes de Devis Client', icon: ClipboardList }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-3.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-md shadow-black/15'
                      : 'bg-white text-gray-600 border border-gray-100 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="w-5 h-5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-6 border-t mt-4 text-center">
              <button 
                onClick={() => setCurrentTab('accueil')}
                className="w-full text-xs font-bold text-[#4A93D1] border border-dashed border-[#4A93D1]/30 hover:bg-[#4A93D1]/5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Retourner sur le site public
              </button>
            </div>
          </div>

          {/* Right panel - Tab visual Content panes */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. TABLEAU DE BORD VIEW */}
            {activeSubTab === 'dashboard' && stats && (
              <div className="space-y-6">
                
                {/* Visual statistics metric tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4A93D1]/10 flex items-center justify-center text-[#4A93D1] shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">VISITEURS SITE</span>
                      <strong className="text-xl font-bold text-slate-900">{stats.visitorsCount}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F29A1A]/10 flex items-center justify-center text-[#F29A1A] shrink-0">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">DEVIS REÇUS</span>
                      <strong className="text-xl font-bold text-slate-900">{devisRequests.length}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4CD37E]/10 flex items-center justify-center text-[#4CD37E] shrink-0">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">RAYONS ACTIFS</span>
                      <strong className="text-xl font-bold text-slate-900">6</strong>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C83AB3]/10 flex items-center justify-center text-[#C83AB3] shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">RÉACTIONS</span>
                      <strong className="text-xl font-bold text-slate-900">98%</strong>
                    </div>
                  </div>
                </div>

                {/* Popular products clicks analysis and generic bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Popular Clicks list representation */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h4 className="font-extrabold text-sm text-slate-900">Popularité des Matériels & Objets</h4>
                      <div className="text-[10px] opacity-75 font-bold uppercase text-[#4A93D1]">Dernières 24h</div>
                    </div>
                    <div className="space-y-4">
                      {stats.popularProducts && stats.popularProducts.map((p, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-gray-700">{p.name} [{p.category}]</span>
                            <span className="font-bold text-slate-900 text-xs">{p.clicks} clics</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-[#4A93D1] to-[#F29A1A] h-full" style={{ width: `${Math.min(p.clicks, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Site Category performance charts (made elegantly of vectors) */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h4 className="font-extrabold text-sm text-slate-900">Analyse de conversion devis</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">Rapport d'activité</span>
                    </div>

                    <div className="flex justify-center py-4">
                      {/* Responsive Styled SVG Area chart */}
                      <svg viewBox="0 0 240 100" className="w-full h-32">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4A93D1" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#4A93D1" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="10" y1="10" x2="230" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="10" y1="40" x2="230" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="10" y1="70" x2="230" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                        
                        {/* Area */}
                        <path d="M 10 90 L 40 60 L 80 75 L 120 40 L 160 55 L 200 20 L 230 10 L 230 90 Z" fill="url(#chartGrad)" />
                        
                        {/* Line */}
                        <path d="M 10 90 L 40 60 L 80 75 L 120 40 L 160 55 L 200 20 L 230 10" stroke="#4A93D1" strokeWidth="2.5" fill="none" />
                        
                        {/* Interactive dots */}
                        <circle cx="120" cy="40" r="4.5" fill="#F29A1A" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx="200" cy="20" r="4.5" fill="#4CD37E" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="text-[10px] text-gray-400 font-light flex justify-between">
                      <span>Lundi</span>
                      <span>Mercredi</span>
                      <span>Vendredi</span>
                      <span className="font-semibold text-[#F29A1A]">Aujourd'hui</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 2. GESTION CATALOGUE VIEW */}
            {activeSubTab === 'catalogue' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-none">Matériels, Outils & Fournitures</h3>
                    <p className="text-xs text-gray-400 mt-1">Nombre total de produits : {products.length}</p>
                  </div>
                  <button 
                    onClick={openAddProduct}
                    className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter Produit</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-500">
                      <thead className="text-[10px] text-gray-400 uppercase bg-slate-50 border-b">
                        <tr>
                          <th className="px-6 py-4">Produit</th>
                          <th className="px-6 py-4">Catégorie</th>
                          <th className="px-6 py-4">Prix</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                              <img src={p.imageUrl} className="w-10 h-8 object-cover rounded border" />
                              <span className="line-clamp-1">{p.name}</span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-500">{p.category}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{p.price || "Sur devis"}</td>
                            <td className="px-6 py-4">
                              {p.isPopular ? (
                                <span className="text-[9px] bg-amber-500/10 text-amber-600 font-bold px-2 py-1 rounded">Populaire</span>
                              ) : (
                                <span className="text-[9px] bg-gray-100 text-gray-400 tracking-tight px-2 py-1 rounded">Standard</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button 
                                onClick={() => openEditProduct(p)}
                                className="p-1 px-1.5 text-blue-600 bg-blue-100/30 hover:bg-blue-100 rounded cursor-pointer"
                              >
                                <Edit3 className="w-4.5 h-4.5" />
                              </button>
                              <button 
                                onClick={() => handleProductDelete(p.id, p.name)}
                                className="p-1 px-1.5 text-red-600 bg-red-100/30 hover:bg-red-100 rounded cursor-pointer"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. GESTION GALERIE VIEW */}
            {activeSubTab === 'galerie' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-none">Galerie des Réalisations</h3>
                    <p className="text-xs text-gray-400 mt-1">Photos réelles des chantiers ou habillages : {realisations.length}</p>
                  </div>
                  <button 
                    onClick={openAddRealisation}
                    className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter Réalisation</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {realisations.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center p-4 gap-4">
                      <img src={item.imageUrl} className="w-24 h-18 object-cover rounded border shrink-0" />
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] uppercase font-mono font-bold text-[#F29A1A]">{item.category}</span>
                        <h4 className="font-bold text-slate-900 text-xs truncate leading-tight mt-0.5">{item.title}</h4>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button 
                          onClick={() => openEditRealisation(item)}
                          className="text-blue-500 bg-blue-50/50 hover:bg-blue-100/50 p-2 rounded-xl transition-colors shrink-0 cursor-pointer"
                          title="Modifier la réalisation"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleGalleryDelete(item.id)}
                          className="text-red-500 bg-red-50/50 hover:bg-red-100/50 p-2 rounded-xl transition-colors shrink-0 cursor-pointer"
                          title="Supprimer la réalisation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GESTION BLOG VIEW */}
            {activeSubTab === 'blog' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-none">Magasin d'Articles & Actualités</h3>
                    <p className="text-xs text-gray-400 mt-1">Publications informatives en ligne : {blogArticles.length}</p>
                  </div>
                  <button 
                    onClick={openAddArticle}
                    className="cursor-pointer bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Rédiger Article</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {blogArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img src={article.imageUrl} className="w-16 h-12 object-cover rounded border shrink-0" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-[#4A93D1]">{article.category}</span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5">{article.title}</h4>
                          <p className="text-[10px] text-gray-400 leading-none mt-1">Par {article.author} | Publié : {article.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openEditArticle(article)}
                          className="px-3 py-1.5 text-blue-600 bg-blue-50/50 hover:bg-blue-50 text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Éditer
                        </button>
                        <button 
                          onClick={() => handleBlogDelete(article.id)}
                          className="px-3 py-1.5 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. GESTION DEMANDES DE DEVIS */}
            {activeSubTab === 'demandes' && (
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-extrabold text-sm text-slate-900 leading-none">Demandes de Devis Reçues</h3>
                  <p className="text-xs text-gray-400 mt-1">Suivez les interventions et dressez des offres de facturation directes.</p>
                </div>

                <div className="space-y-5">
                  {devisRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                      
                      {/* Name / phone / email info header */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3.5">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{req.name}</h4>
                          <p className="text-xs text-gray-400 leading-none mt-1">
                            📞 {req.phone} | ✉️ {req.email}
                          </p>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-gray-400">Statut:</span>
                          <select 
                            value={req.status}
                            onChange={(e) => handleStatusChange(req.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg focus:outline-none cursor-pointer"
                          >
                            <option value="En attente">En attente</option>
                            <option value="Accepté">Accepté</option>
                            <option value="Refusé">Refusé</option>
                            <option value="Traité">Traité</option>
                          </select>
                        </div>
                      </div>

                      {/* Content of message */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 font-bold flex flex-wrap gap-2">
                          <span className="bg-[#4A93D1]/10 text-[#4A93D1] px-2 py-0.5 rounded text-[10px]">
                            {req.subject}
                          </span>
                          {req.productName && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] italic">
                              Produit ciblé : {req.productName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-normal leading-relaxed bg-slate-50 p-4 rounded-xl">
                          "{req.message}"
                        </p>
                      </div>

                      {/* Print and Delete segment */}
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium">Reçu le : {new Date(req.createdAt).toLocaleString()}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handlePrintQuote(req)}
                            className="cursor-pointer font-bold inline-flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Facturation PDF</span>
                          </button>
                          
                          <button
                            onClick={() => handleDevisRequestDelete(req.id)}
                            className="cursor-pointer font-bold inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Archiver</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
          <form onSubmit={handleProductSubmit} className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border">
            <div className="bg-slate-950 text-white px-6 py-4 flex justify-between items-center">
              <span className="font-extrabold text-sm">{editingProduct ? "Modifier le matériel" : "Ajouter un matériel informatique/fourniture"}</span>
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Désignation *</label>
                <input 
                  type="text" required value={productForm.name} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Ex: Écran plat Samsung 27 pouces" 
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Rayon / Catégorie *</label>
                  <select 
                    value={productForm.category} 
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Matériel Informatique">Matériel Informatique</option>
                    <option value="Fournitures de Bureau">Fournitures de Bureau</option>
                    <option value="Fournitures Scolaires">Fournitures Scolaires</option>
                    <option value="Objets Publicitaires">Objets Publicitaires</option>
                    <option value="Textile Personnalisé">Textile Personnalisé</option>
                    <option value="Supports de Communication">Supports de Communication</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Prix indicatif *</label>
                  <input 
                    type="text" required value={productForm.price} 
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="Ex: Sur devis / 12 000 FCFA" 
                    className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Image du produit *</label>
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverProduct(true);
                  }}
                  onDragLeave={() => setDragOverProduct(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverProduct(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleProductFileEvent(file);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center cursor-pointer relative ${
                    dragOverProduct 
                      ? 'border-[#4A93D1] bg-blue-50/40' 
                      : 'border-slate-200 hover:border-[#4A93D1]/60 hover:bg-slate-50/50'
                  }`}
                  onClick={() => document.getElementById('product-file-input')?.click()}
                >
                  <input 
                    id="product-file-input"
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProductFileEvent(file);
                    }}
                    className="hidden" 
                  />
                  
                  {productForm.imageUrl ? (
                    <div className="space-y-2">
                      <img 
                        src={productForm.imageUrl} 
                        alt="Aperçu produit" 
                        className="h-28 w-auto object-contain rounded-lg mx-auto shadow-sm border bg-slate-50"
                      />
                      <span className="text-[10px] text-emerald-600 font-bold block">✓ Image sélectionnée</span>
                    </div>
                  ) : (
                    <div className="py-2 space-y-1">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">Faites glisser une image ou cliquez pour parcourir</p>
                      <p className="text-[10px] text-gray-400">Recommandé : PNG, JPG compressé</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
                      <RefreshCw className="w-6 h-6 text-[#4A93D1] animate-spin" />
                    </div>
                  )}
                </div>

                {/* Plain text Fallback */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block text-right">Ou spécifier une URL directe de rechange :</span>
                  <input 
                    type="url" required value={productForm.imageUrl} 
                    onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-1.5 border border-slate-200 rounded-xl text-[11px] focus:outline-none focus:border-[#4A93D1]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description / Spécifications *</label>
                <textarea 
                  rows={3} required value={productForm.description} 
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Capacités, marques recommandées ou formats d'impression..."
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2.5 pt-2">
                <input 
                  type="checkbox" checked={productForm.isPopular} 
                  onChange={(e) => setProductForm({...productForm, isPopular: e.target.checked})}
                  className="rounded border-gray-300 text-[#F29A1A]"
                  id="chk-prod-popular"
                />
                <label htmlFor="chk-prod-popular" className="text-xs text-gray-600 font-bold cursor-pointer select-none">🔥 Marquer comme Produit Populaire (Mis en avant)</label>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-2.5">
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-slate-900 border rounded-xl">Annuler</button>
              <button type="submit" className="bg-[#4A93D1] hover:bg-[#4A93D1]/90 text-white px-5 py-2 rounded-xl text-xs font-bold">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD PORTFOLIO REALISATION */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
          <form onSubmit={handleGallerySubmit} className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border">
            <div className="bg-slate-950 text-white px-6 py-4 flex justify-between items-center">
              <span className="font-extrabold text-sm">{editingRealisation ? "Modifier la Réalisation" : "Ajouter une Réalisation de communication"}</span>
              <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Titre abrégé du projet *</label>
                <input 
                  type="text" required value={galleryForm.title} 
                  onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                  placeholder="Ex: Déploiement Wifi 6 au Campus CIE" 
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Secteur technique associé *</label>
                <select 
                  value={galleryForm.category} 
                  onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Réseaux & Informatique">Réseaux & Informatique</option>
                  <option value="Création Web">Création Web</option>
                  <option value="Imprimerie">Imprimerie</option>
                  <option value="Branding Véhicules">Branding Véhicules</option>
                  <option value="Textile Personnalisé">Textile Personnalisé</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Image de couverture *</label>
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverGallery(true);
                  }}
                  onDragLeave={() => setDragOverGallery(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverGallery(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleGalleryFileEvent(file);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center cursor-pointer relative ${
                    dragOverGallery 
                      ? 'border-[#4A93D1] bg-blue-50/40' 
                      : 'border-slate-200 hover:border-[#4A93D1]/60 hover:bg-slate-50/50'
                  }`}
                  onClick={() => document.getElementById('gallery-file-input')?.click()}
                >
                  <input 
                    id="gallery-file-input"
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleGalleryFileEvent(file);
                    }}
                    className="hidden" 
                  />
                  
                  {galleryForm.imageUrl ? (
                    <div className="space-y-2">
                      <img 
                        src={galleryForm.imageUrl} 
                        alt="Aperçu réalisation" 
                        className="h-28 w-auto object-contain rounded-lg mx-auto shadow-sm border bg-slate-50"
                      />
                      <span className="text-[10px] text-emerald-600 font-bold block">✓ Image sélectionnée</span>
                    </div>
                  ) : (
                    <div className="py-2 space-y-1">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">Faites glisser une image ou cliquez pour parcourir</p>
                      <p className="text-[10px] text-gray-400">Recommandé : PNG, JPG compressé</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
                      <RefreshCw className="w-6 h-6 text-[#4A93D1] animate-spin" />
                    </div>
                  )}
                </div>

                {/* Plain text Fallback */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block text-right">Ou spécifier une URL directe de rechange :</span>
                  <input 
                    type="url" required value={galleryForm.imageUrl} 
                    onChange={(e) => setGalleryForm({...galleryForm, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-1.5 border border-slate-200 rounded-xl text-[11px] focus:outline-none focus:border-[#4A93D1]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-2.5">
              <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500 border rounded-xl">Fermer</button>
              <button type="submit" className="bg-[#4A93D1] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#4A93D1]/90">
                {editingRealisation ? "Enregistrer" : "Publier"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT BLOG ARTICLE */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
          <form onSubmit={handleBlogSubmit} className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative border">
            <div className="bg-slate-950 text-white px-6 py-4 flex justify-between items-center">
              <span className="font-extrabold text-sm">{editingArticle ? "Modifier l'article de presse" : "Rédiger un article HINOV"}</span>
              <button type="button" onClick={() => setIsBlogModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Titre de l'Actualité ou Conseil *</label>
                <input 
                  type="text" required value={blogForm.title} 
                  onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                  placeholder="Ex: Conseils de câblage pour de grandes entreprises" 
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Rubrique *</label>
                  <select 
                    value={blogForm.category} 
                    onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Informatique">Informatique</option>
                    <option value="Marketing Digital">Marketing Digital</option>
                    <option value="Imprimerie">Imprimerie</option>
                    <option value="Branding">Branding</option>
                    <option value="Fournitures">Fournitures</option>
                    <option value="Réalisations HINOV">Réalisations HINOV</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Auteur de l'avis *</label>
                  <input 
                    type="text" required value={blogForm.author} 
                    onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Image Cover URL *</label>
                <input 
                  type="url" required value={blogForm.imageUrl} 
                  onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Résumé court d'introduction (Excerpt) *</label>
                <input 
                  type="text" required value={blogForm.excerpt} 
                  onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                  placeholder="Résumé pour captiver le lecteur en une phrase..."
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Corp de l'Article (Markdown ou Texte enrichi) *</label>
                <textarea 
                  rows={5} required value={blogForm.content} 
                  onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                  placeholder="Contenu complet..."
                  className="w-full px-4 py-2 border rounded-xl text-xs focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-2.5">
              <button type="button" onClick={() => setIsBlogModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500 border rounded-xl">Fermer</button>
              <button type="submit" className="bg-[#4A93D1] text-white px-5 py-2 rounded-xl text-xs font-bold">Publier</button>
            </div>
          </form>
        </div>
      )}

      {/* DYNAMIC INVOICE / QUOTATION MODAL SHEETS FOR PRINTING */}
      {pdfInvoice && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[250] p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl w-full max-w-2xl text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Nav controls */}
            <button 
              onClick={() => setPdfInvoice(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Print Header template */}
            <div className="flex justify-between items-start border-b pb-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <motion.img 
                    src="https://res.cloudinary.com/dzthrix45/image/upload/q_auto/f_auto/v1781601015/IMG-20260612-WA0002_2_gg2vtq.jpg" 
                    alt="Logo HINOV Group" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-200 p-0.5 shadow-sm cursor-pointer"
                    animate={{ 
                      scale: [1, 1.35, 1, 1],
                      rotate: [0, 180, 360, 360],
                    }}
                    transition={{ 
                      duration: 5, 
                      ease: "easeInOut",
                      times: [0, 0.3, 0.6, 1],
                      repeat: Infinity
                    }}
                    whileHover={{ 
                      scale: [1, 1.35, 1.35, 1],
                      rotate: [0, 180, 360, 360],
                      transition: { 
                        duration: 2.4, 
                        ease: "easeInOut",
                        times: [0, 0.35, 0.75, 1]
                      } 
                    }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">HINOV <span className="text-[#4A93D1]">Group</span></span>
                </div>
                <p className="text-[10px] text-gray-400">📍 Abidjan Yopougon cité CIE rue S 259 - Côte d'Ivoire</p>
                <p className="text-[10px] text-gray-400">📞 +(225) 27 23 227 992 / 07 59 81 35 11 | ✉️ hinovgroup@hinovgroup.com</p>
              </div>

              <div className="text-right space-y-1">
                <span className="bg-[#F29A1A]/10 text-[#F29A1A] font-bold text-[9px] uppercase px-2.5 py-1 rounded-full">COMMANDE PROVISOIRE</span>
                <h4 className="font-bold text-xs text-slate-500 mt-2">DEVIS N° HN-{pdfInvoice.id.slice(-6).toUpperCase()}</h4>
                <p className="text-[10px] text-gray-400">Date d'édition : {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Customer coordinates box */}
            <div className="bg-slate-50 rounded-2xl p-4.5 grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">DESTINATAIRE</span>
                <strong className="text-slate-900 font-bold block">{pdfInvoice.name}</strong>
                <span className="block">{pdfInvoice.email}</span>
                <span className="block font-medium">{pdfInvoice.phone}</span>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[9px] font-bold text-gray-400 block uppercase">DÉTAILS INTERVENTION</span>
                <span className="block font-semibold text-[#4A93D1]">{pdfInvoice.subject}</span>
                <span className="block text-[10px] text-gray-500">Statut actuel : {pdfInvoice.status}</span>
              </div>
            </div>

            {/* Bill of materials logs */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description analytique des fournitures & prestations</span>
              
              <div className="border rounded-2xl overflow-hidden block">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-[#111111] text-white font-bold text-[10px] uppercase">
                    <tr>
                      <th className="px-5 py-3">Réf / Articles</th>
                      <th className="px-5 py-3 text-center">Quantités</th>
                      <th className="px-5 py-3 text-right">Unitaire</th>
                      <th className="px-5 py-3 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    <tr>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 block">{pdfInvoice.productName || pdfInvoice.subject}</span>
                        <span className="text-[10px] text-gray-400 block leading-tight mt-0.5 mt-1">Conforme cahier des charges soumis sur le site HINOV Group.</span>
                      </td>
                      <td className="px-5 py-4 text-center text-xs">1 Prestation</td>
                      <td className="px-5 py-4 text-right">Sur Devis</td>
                      <td className="px-5 py-4 text-right">Sur Devis</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Remarks */}
              <div className="bg-slate-50 border p-4.5 rounded-2xl text-xs text-gray-500 font-light leading-relaxed">
                <strong className="text-slate-800 font-bold block mb-1">Message client associé :</strong>
                "{pdfInvoice.message}"
              </div>
            </div>

            {/* Bottom printed invoice actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t gap-4">
              <span className="text-xs text-slate-400 font-light">Document généré automatiquement par la console HINOV.</span>
              <div className="space-x-2">
                <button 
                  onClick={() => window.print()}
                  className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Imprimer ce document (PDF)
                </button>
                <button 
                  onClick={() => setPdfInvoice(null)}
                  className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Fermer l'aperçu
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
