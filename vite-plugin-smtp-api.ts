import type { Plugin, ViteDevServer } from 'vite'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'

export function smtpApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-smtp-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/send-inquiry-email', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        // Read .env.local
        const envPath = path.resolve(process.cwd(), '.env.local')
        let envConfig: Record<string, string> = {}
        if (fs.existsSync(envPath)) {
          const parsed = dotenv.parse(fs.readFileSync(envPath))
          envConfig = parsed
        }

        const host = process.env.EMAIL_HOST || envConfig.EMAIL_HOST || 'smtp.gmail.com'
        const port = Number(process.env.EMAIL_PORT || envConfig.EMAIL_PORT || 587)
        const user = process.env.EMAIL_USER || envConfig.EMAIL_USER || ''
        const pass = process.env.EMAIL_PASS || envConfig.EMAIL_PASS || ''
        const from = process.env.EMAIL_FROM || envConfig.EMAIL_FROM || '"APSON INDUSTRIES" <apsonindustries.rke@gmail.com>'
        const recipientsStr =
          process.env.CONTACT_ALERT_EMAILS ||
          envConfig.CONTACT_ALERT_EMAILS ||
          'apsonindustries.rke@gmail.com'

        const recipients = recipientsStr.split(',').map((e) => e.trim()).filter(Boolean)

        // Parse JSON body
        let bodyStr = ''
        req.on('data', (chunk) => {
          bodyStr += chunk
        })

        req.on('end', async () => {
          try {
            const data = JSON.parse(bodyStr || '{}')
            const { name, email, phone, company, subject, message } = data

            if (!name || !email || !message) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Name, email, and message are required fields.' }))
              return
            }

            // Create Nodemailer Transporter (Port 587 STARTTLS with TLS cert inspection fallback)
            const transporter = nodemailer.createTransport({
              host,
              port,
              secure: port === 465,
              auth: {
                user,
                pass,
              },
              tls: {
                rejectUnauthorized: false,
              },
            })

            const submittedAt = new Date().toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              dateStyle: 'full',
              timeStyle: 'medium',
            })

            // Construct HTML Email Template
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #111827; }
                .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
                .header { background: #0B1220; padding: 28px 32px; text-align: center; border-bottom: 3px solid #2F80ED; }
                .brand-title { color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
                .brand-sub { color: #2F80ED; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
                .content { padding: 32px; }
                .badge { display: inline-block; background: #2F80ED; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
                .title { font-size: 18px; font-weight: 800; color: #0B1220; margin: 0 0 20px 0; }
                .field-group { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; }
                .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 4px; }
                .value { font-size: 14px; font-weight: 600; color: #0f172a; word-break: break-word; }
                .message-box { background: #0B1220; color: #f8fafc; border-radius: 12px; padding: 20px; margin-top: 20px; line-height: 1.6; font-size: 14px; border-left: 4px solid #2F80ED; }
                .footer { background: #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                .reply-btn { display: inline-block; background: #2F80ED; color: #ffffff !important; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 24px; box-shadow: 0 4px 12px rgba(47,128,237,0.3); }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <h1 class="brand-title">APSON <span style="color: #2F80ED;">INDUSTRIES</span></h1>
                  <div class="brand-sub">Roorkee • India</div>
                </div>

                <div class="content">
                  <div class="badge">🔔 New Website Inquiry</div>
                  <h2 class="title">New Inquiry Received via Website Contact Form</h2>

                  <div class="field-group">
                    <div class="label">Full Name</div>
                    <div class="value">${name}</div>
                  </div>

                  <div class="field-group">
                    <div class="label">Email Address</div>
                    <div class="value"><a href="mailto:${email}" style="color: #2F80ED; text-decoration: none;">${email}</a></div>
                  </div>

                  <div class="field-group">
                    <div class="label">Phone / Mobile</div>
                    <div class="value">${phone || 'Not provided'}</div>
                  </div>

                  <div class="field-group">
                    <div class="label">Company / Organization</div>
                    <div class="value">${company || 'Not provided'}</div>
                  </div>

                  <div class="field-group">
                    <div class="label">Subject</div>
                    <div class="value">${subject || 'General Inquiry'}</div>
                  </div>

                  <div class="message-box">
                    <div class="label" style="color: #94a3b8; margin-bottom: 8px;">Message Content</div>
                    <div style="white-space: pre-wrap;">${message}</div>
                  </div>

                  <div style="text-align: center;">
                    <a href="mailto:${email}?subject=RE: ${encodeURIComponent(subject || 'APSON Industries Inquiry')}" class="reply-btn">
                      ✉️ Reply Directly to ${name}
                    </a>
                  </div>
                </div>

                <div class="footer">
                  <p style="margin: 0 0 6px 0;">Submitted on: <strong>${submittedAt}</strong></p>
                  <p style="margin: 0;">Automated Notification System • APSON Industries Roorkee</p>
                </div>
              </div>
            </body>
            </html>
            `

            // Send Mail via Nodemailer SMTP
            const info = await transporter.sendMail({
              from,
              to: recipients.join(', '),
              subject: `[New Inquiry] ${subject || 'Website Inquiry'} - ${name}`,
              text: `New Website Inquiry received from ${name} (${email}, Phone: ${phone || 'N/A'}). Message: ${message}`,
              html: htmlContent,
              replyTo: email,
            })

            console.log('✅ Gmail SMTP Email Sent Successfully:', info.messageId)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                success: true,
                message: 'Admin email notification dispatched successfully via Gmail SMTP.',
                messageId: info.messageId,
              })
            )
          } catch (err: any) {
            console.error('❌ Gmail SMTP Email Dispatch Error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: err.message || 'Failed to dispatch email via Gmail SMTP.',
              })
            )
          }
        })
      })
    },
  }
}
