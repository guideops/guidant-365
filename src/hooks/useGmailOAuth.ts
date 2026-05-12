'use client'

import { useState } from 'react'

export function useGmailOAuth() {
  const [connecting, setConnecting] = useState(false)

  async function connectGmail() {
    setConnecting(true)
    try {
      const res = await fetch('/api/gmail/auth')
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setConnecting(false)
    }
  }

  return { connectGmail, connecting }
}
