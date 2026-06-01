"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  MoreVertical,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

// Import your Admin API functions
import { 
  fetchAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../service/AdminAPI'; // Adjust path based on your folder structure

const COLORS = {
  primary: "#08B36A",
  danger: "#EF4444",
};

export default function ManageCategoriesPage() {
  // --- States ---
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [iconFile, setIconFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // --- Initial Load ---
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllCategories();
      // Adjust based on your API response structure { success: true, data: [] }
      setCategories(response.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', isActive: true });
    }
    setIconFile(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Use FormData for file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('isActive', formData.isActive);
    if (iconFile) data.append('icon', iconFile);
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, data);
      } else {
        await createCategory(data);
      }
      await loadCategories();
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will remove the category permanently.")) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(c => c._id !== id));
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-[#F8FAFC]">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Categories</h1>
          <p className="text-slate-500 text-sm">Define and manage top-level services available in the system.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-[#08B36A] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100"
        >
          <Plus size={20} />
          Create Category
        </button>
      </div>

      {/* 2. Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#08B36A]/20 focus:border-[#08B36A] outline-none transition-all text-black"
          />
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-center gap-3">
            <LayoutGrid className="text-[#08B36A]" size={20} />
            <span className="text-sm font-bold text-slate-700">{categories.length} Total</span>
        </div>
      </div>

      {/* 3. Categories Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <Loader2 className="animate-spin text-[#08B36A] mb-4" size={40} />
          <p className="text-slate-500 font-medium">Loading catalog...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              {/* Category Image Header */}
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40}/></div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => handleOpenModal(category)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-slate-700 hover:text-[#08B36A] shadow-sm cursor-pointer transition-colors"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(category._id)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-slate-700 hover:text-red-500 shadow-sm cursor-pointer transition-colors"><Trash2 size={14}/></button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden">
                    {category.icon ? <img src={category.icon} className="w-6 h-6 object-contain" /> : <LayoutGrid size={18} className="text-[#08B36A]"/>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${category.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {category.isActive ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{category.name}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 h-8">{category.description || "No description provided."}</p>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredCategories.length === 0 && !isLoading && (
            <div className="col-span-full py-20 text-center">
                <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No Categories Found</h3>
                <p className="text-slate-500">Try adjusting your search or create a new one.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory ? "Update Category" : "New Service Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Text Fields */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category Name *</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#08B36A] transition-all text-black"
                  placeholder="e.g. Home Cleaning, Plumbing"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Short Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#08B36A] transition-all resize-none text-black"
                  placeholder="What is this category about?"
                />
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Icon (SVG/PNG)</label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus size={16} className={iconFile ? 'text-[#08B36A]' : 'text-slate-400'}/>
                      <p className="text-[10px] text-slate-500 mt-1">{iconFile ? iconFile.name : 'Upload Icon'}</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setIconFile(e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Cover Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon size={16} className={imageFile ? 'text-[#08B36A]' : 'text-slate-400'}/>
                      <p className="text-[10px] text-slate-500 mt-1">{imageFile ? imageFile.name : 'Upload Image'}</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                  </label>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                    <h4 className="text-sm font-bold text-slate-900">Active Status</h4>
                    <p className="text-[11px] text-slate-500">Enable or disable this category globally.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`transition-colors duration-300 ${formData.isActive ? 'text-[#08B36A]' : 'text-slate-300'}`}
                >
                  {formData.isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-[#08B36A] hover:bg-emerald-600 shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {editingCategory ? "Update Category" : "Create Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}