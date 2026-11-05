import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { Category, Skill } from '../../types';
import { Plus, Trash2, FolderTree, Sparkles, AlertCircle } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => DataStore.getCategories());
  const [skills, setSkills] = useState<Skill[]>(() => DataStore.getSkills());

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    DataStore.createCategory({
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim() || undefined,
    });

    setCategories(DataStore.getCategories());
    setNewCatName('');
    setNewCatDesc('');
    showNotice(`Category "${newCatName}" created.`);
  };

  const handleDeleteCategory = (cat: Category) => {
    try {
      if (confirm(`Delete category "${cat.name}"?`)) {
        DataStore.deleteCategory(cat.id);
        setCategories(DataStore.getCategories());
        showNotice(`Category "${cat.name}" deleted.`);
      }
    } catch (err: any) {
      alert(err.message || 'Cannot delete category that is assigned to existing jobs.');
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    DataStore.createSkill(newSkillName.trim());
    setSkills(DataStore.getSkills());
    setNewSkillName('');
    showNotice(`Skill "${newSkillName}" added to taxonomy.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
          Taxonomies & Classification
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
          Categories & Skills Management
        </h1>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-neutral-900">
              Role Categories ({categories.length})
            </h3>

            <div className="divide-y divide-neutral-100 text-xs">
              {categories.map((cat) => (
                <div key={cat.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-semibold text-neutral-900 block">{cat.name}</span>
                    <span className="text-neutral-500 text-[11px] line-clamp-1">{cat.description}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 rounded text-neutral-600">
                      {cat.job_count || 0} Jobs
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="pt-4 border-t border-neutral-100 space-y-3 text-xs">
              <h4 className="font-semibold text-neutral-800">Add New Category</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g. Design Systems & Tokens)"
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                />
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short Description for public directory"
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#121212] text-white rounded font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Skills Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-neutral-900">
              Verified Skills ({skills.length})
            </h3>

            <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto p-2 bg-neutral-50 rounded-lg border border-neutral-200">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 bg-white border border-neutral-300 rounded text-xs font-mono text-neutral-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="pt-4 border-t border-neutral-100 space-y-3 text-xs">
              <h4 className="font-semibold text-neutral-800">Add Skill Tag</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. GSAP, Webflow, Drizzle ORM"
                  className="flex-1 p-2 bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#121212] text-white rounded font-semibold hover:bg-neutral-800 transition-colors shrink-0"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
