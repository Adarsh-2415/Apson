import { X, Mail, Phone, MapPin, Calendar, CheckCircle2, Archive, Trash2, ExternalLink } from 'lucide-react'
import type { InquiryRecord, InquiryStatus } from '@/types/inquiry'

interface InquiryDetailModalProps {
  isOpen: boolean
  inquiry: InquiryRecord | null
  onClose: () => void
  onUpdateStatus: (id: string, newStatus: InquiryStatus) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function InquiryDetailModal({
  isOpen,
  inquiry,
  onClose,
  onUpdateStatus,
  onDelete,
}: InquiryDetailModalProps) {
  if (!isOpen || !inquiry) return null

  const formattedDate = new Date(inquiry.created_at).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2A3649] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  inquiry.status === 'new'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : inquiry.status === 'read'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {inquiry.status === 'new' ? 'New Inquiry' : inquiry.status === 'read' ? 'Read / Responded' : 'Archived'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#2F80ED]" />
                {formattedDate}
              </span>
            </div>
            <h2 className="font-['Manrope'] font-extrabold text-white text-xl">
              {inquiry.name}
            </h2>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#0B1220]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#0B1220] rounded-xl border border-[#2A3649]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                Email Address
              </span>
              <a
                href={`mailto:${inquiry.email}?subject=RE: APSON Industries Inquiry`}
                className="font-semibold text-[#2F80ED] hover:underline flex items-center gap-1.5 truncate"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{inquiry.email}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                Phone Number
              </span>
              <a href={`tel:${inquiry.phone}`} className="font-semibold text-slate-200 hover:text-white flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{inquiry.phone}</span>
              </a>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-[#2A3649]/60 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                Location / Address
              </span>
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{inquiry.address}</span>
              </div>
            </div>
          </div>

          {/* Technical Query Message */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Technical Inquiry / Requirements
            </label>
            <div className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {inquiry.message}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-[#0B1220]/60 border-t border-[#2A3649] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {inquiry.status !== 'read' && (
              <button
                type="button"
                onClick={async () => {
                  await onUpdateStatus(inquiry.id, 'read')
                  onClose()
                }}
                className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-xl border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Read</span>
              </button>
            )}

            {inquiry.status !== 'archived' && (
              <button
                type="button"
                onClick={async () => {
                  await onUpdateStatus(inquiry.id, 'archived')
                  onClose()
                }}
                className="px-3.5 py-2 bg-[#1A2433] hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-[#2A3649] text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                await onDelete(inquiry.id)
                onClose()
              }}
              className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
