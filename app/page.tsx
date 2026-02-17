'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        router.push('/dashboard')
      }
    }

    checkUser()
  }, [router])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    })
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Smart Book App Login</h1>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  )
}
