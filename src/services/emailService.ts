export interface InquiryEmailPayload {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
}

export const emailService = {
  /**
   * Send Gmail SMTP Admin Email Notification for a new website inquiry.
   */
  async sendAdminInquiryNotification(
    payload: InquiryEmailPayload
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const response = await fetch('/api/send-inquiry-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return { success: true, error: null }
      }

      return {
        success: false,
        error: new Error(result.error || 'Failed to dispatch email notification.'),
      }
    } catch (err: any) {
      console.warn('Email dispatch network warning/error:', err)
      return {
        success: false,
        error: err instanceof Error ? err : new Error('Network error sending email notification.'),
      }
    }
  },
}
