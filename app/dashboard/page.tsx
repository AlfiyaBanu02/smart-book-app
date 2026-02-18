'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { useRouter } from 'next/navigation'

interface Bookmark {
  id: string
  title: string
  url: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const router = useRouter()

  // 🔹 Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setBookmarks(data)
    }
  }

  // 🔹 Check auth & load data
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUser(user)
      fetchBookmarks(user.id)
    }

    checkUser()
  }, [router])

  // 🔹 Add bookmark (instant UI update)
  const handleAdd = async () => {
    if (!title || !url || !user) return

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ title, url, user_id: user.id }])
      .select()

    if (!error && data) {
      setBookmarks(prev => [data[0], ...prev])
    }

    setTitle('')
    setUrl('')
  }

  // 🔹 Delete bookmark (instant UI update)
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (!error) {
      setBookmarks(prev => prev.filter(b => b.id !== id))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Welcome, {user.email}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Add Bookmark</h3>
          <div className="flex gap-2">
            <input
              className="border p-2 rounded w-1/3"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border p-2 rounded flex-1"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Your Bookmarks</h3>

          {bookmarks.length === 0 && (
            <p className="text-gray-500">No bookmarks yet.</p>
          )}

          <ul className="space-y-3">
            {bookmarks.map((b) => (
              <li
                key={b.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded border"
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex-1"
                >
                  {b.title}
                </a>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded ml-3 hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
