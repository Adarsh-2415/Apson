import { AlertTriangle, Loader2 } from 'lucide-react'

interface ProductDeleteDialogProps {
  isOpen: boolean
  productName: string
  onClose: () => void
  onConfirm: () => Promise<void>
  isDeleting: boolean
}

export function ProductDeleteDialog({
  isOpen,
  productName,
  onClose,
  onConfirm,
  isDeleting,
}: ProductDeleteDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-rose-950/80 border border-rose-600/50 text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-['Manrope'] font-bold text-white text-lg">
              Delete Product
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <div className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] text-xs text-slate-300 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
            Target Product
          </span>
          <p className="font-['Manrope'] font-bold text-white text-sm">{productName}</p>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed">
          Are you sure you want to permanently remove this product from your catalogue and database?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2A3649]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-[#0B1220] text-slate-300 hover:text-white rounded-xl border border-[#2A3649] text-xs font-bold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Delete Product</span>
          </button>
        </div>
      </div>
    </div>
  )
}
