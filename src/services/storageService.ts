import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const storageService = {
  /**
   * Upload an image file to Supabase Storage ('cms-media' bucket).
   * Falls back to Base64 data URL if Supabase Storage is not yet configured or fails.
   */
  async uploadImage(file: File, folder = 'products'): Promise<{ url: string | null; error: Error | null }> {
    if (!file.type.startsWith('image/')) {
      return { url: null, error: new Error('Please select a valid image file (JPG, PNG, WEBP).') }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: new Error('Image size must be smaller than 5MB.') }
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${folder}/${Date.now()}_${sanitizedName}`

    if (isSupabaseConfigured) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('cms-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          })

        if (!uploadError) {
          const { data } = supabase.storage.from('cms-media').getPublicUrl(filePath)
          if (data?.publicUrl) {
            return { url: data.publicUrl, error: null }
          }
        }
      } catch (err) {
        console.warn('Supabase storage exception, falling back to FileReader:', err)
      }
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Url = e.target?.result as string
        resolve({ url: base64Url, error: null })
      }
      reader.onerror = () => {
        resolve({ url: null, error: new Error('Failed to read image file.') })
      }
      reader.readAsDataURL(file)
    })
  },

  /**
   * Upload a general document file (PDF, etc.) to Supabase Storage ('cms-media' bucket).
   */
  async uploadPdf(file: File, folder = 'brochures'): Promise<{ url: string | null; error: Error | null }> {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return { url: null, error: new Error('Please select a valid PDF file (.pdf).') }
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${folder}/${Date.now()}_${sanitizedName}`

    if (isSupabaseConfigured) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('cms-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          })

        if (!uploadError) {
          const { data } = supabase.storage.from('cms-media').getPublicUrl(filePath)
          if (data?.publicUrl) {
            return { url: data.publicUrl, error: null }
          }
        }
      } catch (err) {
        console.warn('Supabase storage pdf upload exception, falling back to FileReader:', err)
      }
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Url = e.target?.result as string
        resolve({ url: base64Url, error: null })
      }
      reader.onerror = () => {
        resolve({ url: null, error: new Error('Failed to read PDF file.') })
      }
      reader.readAsDataURL(file)
    })
  },
}
