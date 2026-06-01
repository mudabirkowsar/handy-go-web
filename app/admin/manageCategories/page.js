'use client'

import React, { useState, useEffect } from 'react';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../service/AdminAPI'; // Adjust path based on your folder structure
import {
  Wrench, Plus, Edit2, Trash2, Search, RefreshCcw,
  AlertTriangle, X, Check, Layers, FileText, CheckCircle2
} from 'lucide-react';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null means "Create Mode"

  // Form Input State
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchAllCategories();
      // Checking structure array fallbacks based on common API setups
      setCategories(res.data || res || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("Failed to pull down fresh category matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Category Name is required.");

    try {
      if (editingCategory) {
        // Execute Update Pipeline
        await updateCategory(editingCategory._id, formData);
        alert("Category payload modified successfully.");
      } else {
        // Execute Create Pipeline
        await createCategory(formData);
        alert("New category vector operationalized successfully.");
      }
      loadCategories();
      handleCloseModal();
    } catch (error) {
      alert("Execution failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to delete "${name}"? This will dissolve related service mappings.`)) {
      try {
        await deleteCategory(id);
        alert("Category dissolved from record index.");
        loadCategories();
      } catch (error) {
        alert("Delete pipeline aborted: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // Filter array algorithm matching search keyword locally
  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-sans antialiased text-[#111827]">

      {/* Header Area */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Wrench className="w-8 h-8 text-[#08B36A]" /> Service Categories
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">Structure, edit, and orchestrate top-level taxonomy clusters for provider listings.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-[#08B36A] hover:bg-[#069658] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {/* Filter Control Section */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E7EB] shadow-sm mb-6 flex gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 text-[#6B7280] w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#08B36A]/20 focus:border-[#08B36A] transition"
          />
        </div>
        <button
          onClick={loadCategories}
          className="p-2 bg-[#F8FAFC] hover:bg-[#E5E7EB] border border-[#E5E7EB] rounded-xl transition"
          title="Refresh List"
        >
          <RefreshCcw className={`w-4 h-4 text-[#6B7280] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Content Workspace Layout */}
      {loading ? (
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-20 text-center">
          <RefreshCcw className="w-8 h-8 animate-spin text-[#08B36A] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#6B7280]">Syncing ecosystem taxonomy registry...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-16 text-center max-w-xl mx-auto mt-6">
          <Layers className="w-12 h-12 text-[#6B7280]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No Taxonomy Clusters Formed</h3>
          <p className="text-xs text-[#6B7280] mt-1 mb-4">You have zero registered groups configured or matching filters in this system instance.</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 bg-[#08B36A] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#069658] transition"
          >
            <Plus className="w-3.5 h-3.5" /> Configure First Node
          </button>
        </div>
      ) : (
        /* Grid Directory System */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="bg-emerald-50 text-[#08B36A] p-2.5 rounded-xl shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-50 text-[#6B7280] border border-[#E5E7EB]">
                    ID Node
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0F172A] tracking-tight truncate">
                  {category.name}
                </h3>
                <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-3 leading-relaxed">
                  {category.description || 'No specialized description provided for this specific sector node.'}
                </p>
              </div>

              {/* Panel Actions Integration footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] font-medium font-mono">
                  Updated: {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}
                </span>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-2 text-[#6B7280] hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E5E7EB] rounded-xl transition"
                    title="Modify Configuration"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id, category.name)}
                    className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition"
                    title="Dissolve Node"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Edit/Create Management Modal Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[#E5E7EB] animate-in fade-in-50 zoom-in-95 duration-150">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">
                  {editingCategory ? 'Update Class Metrics' : 'Initialize New Branch Node'}
                </h2>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Define core schema metrics to populate client interfaces.</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-[#6B7280] hover:text-[#0F172A] p-1.5 hover:bg-[#E5E7EB] rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Input Form Area */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                  Category Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Electrician, Plumbing, Beauty"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08B36A]/20 focus:border-[#08B36A] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                  Sector Description Summary
                </label>
                <textarea
                  rows="4"
                  placeholder="Provide concise operational context regarding structural duties inside this parameter loop..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08B36A]/20 focus:border-[#08B36A] transition resize-none"
                />
              </div>

              {/* Execution Buttons container footer */}
              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-xs font-bold text-[#6B7280] hover:bg-[#F8FAFC] rounded-xl transition"
                >
                  Abort Entry
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#08B36A] hover:bg-[#069658] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-98"
                >
                  {editingCategory ? 'Commit Mutation' : 'Authorize Branch'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}