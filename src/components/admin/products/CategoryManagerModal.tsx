import { useState } from 'react'
import { X, Plus, Trash2, Layers } from 'lucide-react'

interface CategoryManagerModalProps {
  isOpen: boolean
  categories: string[]
  onClose: () => void
  onSaveCategories: (updatedCategories: string[]) => void
}

export function CategoryManagerModal({
  isOpen,
  categories,
  onClose,
  onSaveCategories,
}: CategoryManagerModalProps) {
  const [categoryList, setCategoryList] = useState<string[]>(categories)
  const [newCatName, setNewCatName] = useState('')

  if (!isOpen) return null

  const handleAddCategory = () => {
    if (newCatName.trim() && !categoryList.includes(newCatName.trim())) {
      const updated = [...categoryList, newCatName.trim()]
      setCategoryList(updated)
      onSaveCategories(updated)
      setNewCatName('')
    }
  }

  const handleDeleteCategory = (cat: string) => {
    if (cat === 'All Products') return
    const updated = categoryList.filter((c) => c !== cat)
    setCategoryList(updated)
    onSaveCategories(updated)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-white text-base">
                Product Categories Manager
              </h3>
              <p className="text-slate-400 text-xs">Manage category pills for product catalogue filters.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#0B1220]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Category Form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Add new category (e.g. Ingress Protection Chambers)"
            className="flex-1 p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white font-bold rounded-xl flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* List of Categories */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categoryList.map((cat) => (
            <div key={cat} className="flex items-center justify-between p-3 bg-[#0B1220] rounded-xl border border-[#2A3649] text-white">
              <span className="font-medium">{cat}</span>
              {cat !== 'All Products' && (
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat)}
                  className="p-1 text-slate-400 hover:text-rose-400"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2F80ED] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
