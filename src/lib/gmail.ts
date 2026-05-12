import { google } from 'googleapis'

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

export function getAuthUrl(emailScope: 'read' | 'draft'): string {
  const oauth2Client = getOAuthClient()
  const scopes =
    emailScope === 'read'
      ? ['https://www.googleapis.com/auth/gmail.readonly']
      : [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.compose',
        ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })
}

export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = getOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export function getGmailClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = getOAuthClient()
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  return google.gmail({ version: 'v1', auth: oauth2Client })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractTextFromPayload(payload: any): string {
  if (!payload) return ''
  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8')
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      const text = extractTextFromPayload(part)
      if (text) return text
    }
  }
  return ''
}

export interface GmailMessage {
  id: string
  subject: string
  snippet: string
  from: string
  date: string
  body: string
}

export async function listRecentThreads(
  gmail: ReturnType<typeof getGmailClient>,
  maxResults = 20
): Promise<GmailMessage[]> {
  const listRes = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    q: 'is:unread',
  })

  const messages = listRes.data.messages ?? []
  const details = await Promise.all(
    messages.map(msg =>
      gmail.users.messages.get({ userId: 'me', id: msg.id!, format: 'metadata', metadataHeaders: ['Subject', 'From', 'Date'] })
    )
  )

  return details.map(d => {
    const headers = d.data.payload?.headers ?? []
    const get = (name: string) => headers.find(h => h.name === name)?.value ?? ''
    return {
      id: d.data.id ?? '',
      subject: get('Subject'),
      snippet: d.data.snippet ?? '',
      from: get('From'),
      date: get('Date'),
      body: '',
    }
  })
}

export async function createDraft(
  gmail: ReturnType<typeof getGmailClient>,
  opts: { to: string; subject: string; body: string; inReplyTo?: string }
) {
  const { to, subject, body, inReplyTo } = opts
  const headers = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    ...(inReplyTo ? [`In-Reply-To: ${inReplyTo}`, `References: ${inReplyTo}`] : []),
  ].join('\r\n')

  const raw = Buffer.from(`${headers}\r\n\r\n${body}`).toString('base64url')
  return gmail.users.drafts.create({
    userId: 'me',
    requestBody: { message: { raw } },
  })
}
