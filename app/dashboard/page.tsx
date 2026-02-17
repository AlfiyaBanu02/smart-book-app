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

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (data) setBookmarks(data)
  }

  useEffect(() => {
    let channel: any

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUser(user)
      fetchBookmarks(user.id)

      channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchBookmarks(user.id)
          }
        )
        .subscribe()
    }

    setup()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [router])

  const handleAdd = async () => {
    if (!title || !url || !user) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle('')
    setUrl('')
  }

  const handleDelete = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-50 to-yellow-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome, <span className="text-purple-600">{user.email}</span>
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Add Bookmark</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-purple-300 outline-none transition"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-purple-300 outline-none transition"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition shadow"
            >
              Add
            </button>
          </div>
        </div>

        {/* Bookmarks List */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Bookmarks</h3>
          {bookmarks.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No bookmarks yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-lg transition"
                >
                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="text-purple-600 font-semibold text-lg hover:underline mb-4"
                  >
                    {bookmark.title}
                  </a>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
