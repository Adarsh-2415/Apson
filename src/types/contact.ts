import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Invalid phone number format'),
  address: z.string().min(3, 'Address / Location is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  captchaAnswer: z.string().min(1, 'Please solve the captcha verification'),
})

export type ContactFormInputs = z.infer<typeof contactFormSchema>
