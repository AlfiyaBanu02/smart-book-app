"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // ✅ Get logged-in user
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        fetchBookmarks(data.user.id);
      }
    }
    getUser();
  }, []);

  // ✅ Fetch bookmarks
  async function fetchBookmarks(userId: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
  }

  // ✅ Add bookmark
  async function addBookmark() {
    if (!title || !url || !user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ])
      .select();

    if (!error && data) {
      setBookmarks((prev) => [data[0], ...prev]);
      setTitle("");
      setUrl("");
    } else {
      console.error("Add error:", error);
      alert("Failed to add bookmark");
    }
  }

  // ✅ Delete bookmark (Optimistic)
  async function deleteBookmark(id: string) {
    // Remove immediately from UI
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.id !== id)
    );

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
      // Reload from DB if something fails
      if (user) fetchBookmarks(user.id);
    }
  }

  // ✅ Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user?.email}</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Add Bookmark</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={addBookmark}>Add</button>

      <h3>Your Bookmarks</h3>

      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <div key={bookmark.id} style={{ marginTop: "10px" }}>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {bookmark.title}
            </a>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}