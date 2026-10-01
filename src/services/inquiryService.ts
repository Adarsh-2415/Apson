import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { InquiryRecord, InquiryStatus } from '@/types/inquiry'
import { emailService } from '@/services/emailService'

const MOCK_INQUIRIES_KEY = 'apson_cms_mock_inquiries'

function getLocalInquiries(): InquiryRecord[] {
  const stored = localStorage.getItem(MOCK_INQUIRIES_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      // Fallback
    }
  }
  return []
}

function setLocalInquiries(items: InquiryRecord[]) {
  localStorage.setItem(MOCK_INQUIRIES_KEY, JSON.stringify(items))
}

export const inquiryService = {
  // Submit new inquiry (Public Contact Form)
  async createInquiry(input: {
    name: string
    email: string
    phone: string
    address: string
    message: string
  }): Promise<{ data: InquiryRecord | null; error: Error | null }> {
    // 1. Dispatch Gmail SMTP Email Notification asynchronously
    emailService
      .sendAdminInquiryNotification({
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.address,
        subject: `New Inquiry from ${input.name}`,
        message: input.message,
      })
      .catch((err) => {
        console.warn('Asynchronous email dispatch notification log:', err)
      })

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .insert({
            name: input.name,
            email: input.email,
            phone: input.phone,
            address: input.address,
            message: input.message,
            status: 'new',
          })
          .select()
          .single()

        if (!error && data) {
          return { data, error: null }
        }
      } catch {
        // Fallback
      }
    }

    const newInquiry: InquiryRecord = {
      id: `inq-${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      message: input.message,
      status: 'new',
      created_at: new Date().toISOString(),
    }

    const items = getLocalInquiries()
    items.unshift(newInquiry)
    setLocalInquiries(items)
    return { data: newInquiry, error: null }
  },

  // Fetch all inquiries (Admin Panel)
  async getInquiries(): Promise<{ data: InquiryRecord[]; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          return { data, error: null }
        }
      } catch {
        // Fallback
      }
    }

    return { data: getLocalInquiries(), error: null }
  },

  // Update inquiry status
  async updateInquiryStatus(
    id: string,
    status: InquiryStatus
  ): Promise<{ data: InquiryRecord | null; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .update({ status })
          .eq('id', id)
          .select()
          .single()

        if (!error && data) {
          return { data, error: null }
        }
      } catch {
        // Fallback
      }
    }

    const items = getLocalInquiries()
    const idx = items.findIndex((i) => i.id === id)
    if (idx !== -1) {
      items[idx] = { ...items[idx], status }
      setLocalInquiries(items)
      return { data: items[idx], error: null }
    }

    return { data: null, error: new Error('Inquiry not found') }
  },

  // Delete inquiry
  async deleteInquiry(id: string): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('inquiries').delete().eq('id', id)
        if (!error) return { error: null }
      } catch {
        // Fallback
      }
    }

    const items = getLocalInquiries().filter((i) => i.id !== id)
    setLocalInquiries(items)
    return { error: null }
  },
}
