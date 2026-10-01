import { useEffect } from 'react'
import { X, Download, FileText, ExternalLink } from 'lucide-react'
import type { ProductBrochureItem } from '@/types/products'

interface PdfViewerModalProps {
  isOpen: boolean
  brochure: ProductBrochureItem | null
  onClose: () => void
}

export function PdfViewerModal({ isOpen, brochure, onClose }: PdfViewerModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !brochure) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Modal Window Container */}
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-5xl h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#0B1220] border-b border-[#2A3649] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-[#2F80ED]/20 text-[#2F80ED] border border-[#2F80ED]/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#2F80ED]/20 text-[#2F80ED] border border-[#2F80ED]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {brochure.badge || 'PDF Brochure'}
                </span>
                {brochure.fileSize && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {brochure.fileSize}
                  </span>
                )}
              </div>
              <h3 className="font-['Manrope'] font-bold text-white text-base sm:text-lg truncate pt-0.5">
                {brochure.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Download PDF Button */}
            <a
              href={brochure.pdfUrl}
              download
              className="px-3.5 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            {/* Direct Open in New Tab fallback if needed */}
            <a
              href={brochure.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#1A2433] border border-transparent hover:border-[#2A3649] transition-colors"
              title="Open raw PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-rose-950/40 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors"
              aria-label="Close Brochure Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Interactive PDF Frame */}
        <div className="flex-1 bg-[#0B1220] relative overflow-hidden">
          <object
            data={`${brochure.pdfUrl}#toolbar=1&navpanes=0`}
            type="application/pdf"
            className="w-full h-full border-0"
          >
            <iframe
              src={`${brochure.pdfUrl}#toolbar=1&navpanes=0`}
              title={brochure.title}
              className="w-full h-full border-0"
            >
              <div className="py-20 text-center text-slate-300 space-y-4">
                <p>Your browser doesn't support embedded PDFs directly.</p>
                <a
                  href={brochure.pdfUrl}
                  download
                  className="px-5 py-2.5 bg-[#2F80ED] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {brochure.title}</span>
                </a>
              </div>
            </iframe>
          </object>
        </div>

      </div>
    </div>
  )
}
