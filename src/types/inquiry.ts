export type InquiryStatus = 'new' | 'read' | 'archived'

export interface InquiryRecord {
  id: string
  name: string
  email: string
  phone: string
  address: string
  message: string
  status: InquiryStatus
  created_at: string
}
