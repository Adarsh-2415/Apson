import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react'
import type { InquiryRecord, InquiryStatus } from '@/types/inquiry'
import { inquiryService } from '@/services/inquiryService'
import { InquiryDetailModal } from '@/components/admin/inquiries/InquiryDetailModal'

export function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | InquiryStatus>('all')

  // Selected Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const loadInquiries = useCallback(async () => {
    setIsLoading(true)
    const { data } = await inquiryService.getInquiries()
    setInquiries(data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadInquiries()
  }, [loadInquiries])

  // Computed Statistics
  const stats = useMemo(() => {
    const total = inquiries.length
    const unread = inquiries.filter((i) => i.status === 'new').length
    const read = inquiries.filter((i) => i.status === 'read').length
    const archived = inquiries.filter((i) => i.status === 'archived').length
    return { total, unread, read, archived }
  }, [inquiries])

  // Filtered List
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus

      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesStatus

      const matchesName = item.name.toLowerCase().includes(query)
      const matchesEmail = item.email.toLowerCase().includes(query)
      const matchesPhone = item.phone.toLowerCase().includes(query)
      const matchesAddress = item.address.toLowerCase().includes(query)
      const matchesMsg = item.message.toLowerCase().includes(query)

      return matchesStatus && (matchesName || matchesEmail || matchesPhone || matchesAddress || matchesMsg)
    })
  }, [inquiries, selectedStatus, searchQuery])

  // Handlers
  const handleUpdateStatus = async (id: string, newStatus: InquiryStatus) => {
    const res = await inquiryService.updateInquiryStatus(id, newStatus)
    if (res.data) {
      setInquiries(inquiries.map((i) => (i.id === id ? res.data! : i)))
      setToastMessage({ type: 'success', text: `Inquiry status updated to ${newStatus}.` })
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    const res = await inquiryService.deleteInquiry(id)
    if (!res.error) {
      setInquiries(inquiries.filter((i) => i.id !== id))
      setToastMessage({ type: 'success', text: 'Inquiry deleted successfully.' })
    } else {
      setToastMessage({ type: 'error', text: 'Failed to delete inquiry.' })
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950 border-rose-500/50 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1A2433] p-6 sm:p-8 rounded-2xl border border-[#2A3649] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2F80ED] uppercase tracking-wider mb-1">
            <Inbox className="w-3.5 h-3.5" />
            <span>INQUIRY MANAGEMENT</span>
          </div>
          <h1 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Contact Inquiries Panel
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Monitor and respond to customer technical inquiries submitted via the website contact form.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadInquiries}
            disabled={isLoading}
            className="p-2.5 bg-[#0B1220] hover:bg-[#2F80ED] text-slate-300 hover:text-white rounded-xl border border-[#2A3649] transition-colors disabled:opacity-50"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A2433] p-5 rounded-2xl border border-[#2A3649] space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
            Total Inquiries
          </span>
          <div className="flex items-center justify-between">
            <span className="font-['Manrope'] text-3xl font-extrabold text-white">
              {stats.total}
            </span>
            <Inbox className="w-6 h-6 text-[#2F80ED]" />
          </div>
        </div>

        <div className="bg-[#1A2433] p-5 rounded-2xl border border-rose-500/30 space-y-2">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">
            New / Unread
          </span>
          <div className="flex items-center justify-between">
            <span className="font-['Manrope'] text-3xl font-extrabold text-rose-400">
              {stats.unread}
            </span>
            <Clock className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        <div className="bg-[#1A2433] p-5 rounded-2xl border border-emerald-500/30 space-y-2">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
            Read / Responded
          </span>
          <div className="flex items-center justify-between">
            <span className="font-['Manrope'] text-3xl font-extrabold text-emerald-400">
              {stats.read}
            </span>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#1A2433] p-5 rounded-2xl border border-[#2A3649] space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
            Archived Queries
          </span>
          <div className="flex items-center justify-between">
            <span className="font-['Manrope'] text-3xl font-extrabold text-slate-400">
              {stats.archived}
            </span>
            <Filter className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="bg-[#1A2433] p-5 rounded-2xl border border-[#2A3649] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, location, message..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium focus:outline-none focus:border-[#2F80ED]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'read', 'archived'] as const).map((tabStatus) => (
            <button
              key={tabStatus}
              onClick={() => setSelectedStatus(tabStatus)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatus === tabStatus
                  ? 'bg-[#2F80ED] text-white shadow-md'
                  : 'bg-[#0B1220] text-slate-400 hover:text-white border border-[#2A3649]'
              }`}
            >
              {tabStatus === 'all' ? `All (${stats.total})` : tabStatus === 'new' ? `New (${stats.unread})` : tabStatus === 'read' ? `Read (${stats.read})` : `Archived (${stats.archived})`}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#1A2433] rounded-2xl border border-[#2A3649] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#2A3649] flex items-center justify-between">
          <h2 className="font-['Manrope'] font-bold text-base text-white">
            Customer Inquiries Directory
          </h2>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-[#0B1220] px-3 py-1 rounded-md border border-[#2A3649]">
            Showing {filteredInquiries.length} Inquiries
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-[#2F80ED] animate-spin mx-auto" />
            <p className="text-slate-400 text-xs font-mono">Loading inquiries...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B1220]/60 border-b border-[#2A3649] text-[11px] font-mono uppercase tracking-widest text-slate-400">
                  <th scope="col" className="py-4 px-6 font-bold">
                    Status
                  </th>
                  <th scope="col" className="py-4 px-6 font-bold">
                    Customer Info
                  </th>
                  <th scope="col" className="py-4 px-6 font-bold">
                    Message Preview
                  </th>
                  <th scope="col" className="py-4 px-6 font-bold">
                    Date Received
                  </th>
                  <th scope="col" className="py-4 px-6 font-bold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3649]/60 text-xs">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#0B1220]/40 transition-colors group">
                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            inq.status === 'new'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : inq.status === 'read'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inq.status === 'new' ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                            }`}
                          />
                          <span>{inq.status}</span>
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-6 font-['Manrope']">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white text-sm group-hover:text-[#2F80ED] transition-colors">
                            {inq.name}
                          </p>
                          <div className="text-slate-400 text-[11px] space-y-0.5 font-sans">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#2F80ED]" />
                              {inq.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {inq.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Message Preview */}
                      <td className="py-4 px-6 text-slate-300 max-w-xs">
                        <p className="line-clamp-2 leading-relaxed">
                          {inq.message}
                        </p>
                        <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{inq.address}</span>
                        </div>
                      </td>

                      {/* Date Received */}
                      <td className="py-4 px-6 font-mono text-slate-400 text-[11px]">
                        {new Date(inq.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInquiry(inq)
                            setIsDetailModalOpen(true)
                          }}
                          className="p-2 rounded-lg bg-[#2F80ED]/15 text-[#2F80ED] hover:bg-[#2F80ED] hover:text-white border border-[#2F80ED]/30 transition-colors inline-flex items-center gap-1 font-bold"
                          title="View Inquiry Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-2 rounded-lg bg-[#0B1220] text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-[#2A3649] transition-colors"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-mono text-xs">
                      No inquiries match the selected status or search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Drawer Modal */}
      <InquiryDetailModal
        isOpen={isDetailModalOpen}
        inquiry={selectedInquiry}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteInquiry}
      />
    </div>
  )
}
