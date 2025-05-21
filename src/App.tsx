import { useState, useEffect } from "react";
import {
  getThreads,
  createThread,
  getPosts,
  createPost,
  deleteThread,
  deletePost,
} from "./api";
import type { Thread, Post } from "./api";
import ThreadForm from "./ThreadForm";
import ThreadList from "./ThreadList";
import PostForm from "./PostForm";
import PostList from "./PostList";
import ContactForm from "./ContactForm";
import "./App.css";

function App() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "create" | "contact">(
    "list"
  );

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await getThreads();
        setThreads(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      const fetchPosts = async () => {
        try {
          const data = await getPosts(selectedThread._id);
          setPosts(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      };
      fetchPosts();
    }
  }, [selectedThread]);

  const handleCreateThread = async (
    newThread: Omit<Thread, "_id" | "createdAt">
  ) => {
    try {
      const createdThread = await createThread(newThread);
      setThreads([createdThread, ...threads]);
      setActiveTab("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleDeleteThread = async (id: number) => {
    try {
      await deleteThread(id);
      setThreads(threads.filter((thread) => thread._id !== id));
      if (selectedThread?._id === id) {
        setSelectedThread(null);
        setPosts([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleAddPost = async (
    newPost: Omit<Post, "_id" | "threadId" | "createdAt">
  ) => {
    if (!selectedThread) return;
    try {
      const createdPost = await createPost(selectedThread._id, newPost);
      setPosts([createdPost, ...posts]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!selectedThread) return;
    try {
      await deletePost(selectedThread._id, postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          スレッド一覧
        </button>
        <button
          className={`tab ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          新規スレッド
        </button>
        <button
          className={`tab ${activeTab === "contact" ? "active" : ""}`}
          onClick={() => setActiveTab("contact")}
        >
          お問い合わせ
        </button>
      </div>

      <div className="app">
        <h1>なんでも掲示板</h1>
        {activeTab === "create" ? (
          <ThreadForm onSubmit={handleCreateThread} />
        ) : activeTab === "contact" ? (
          <ContactForm />
        ) : selectedThread ? (
          <div>
            <div className="thread-header">
              <h2>{selectedThread.title}</h2>
              <button
                className="back-button"
                onClick={() => setSelectedThread(null)}
              >
                戻る
              </button>
            </div>
            {posts.length === 0 && (
              <div className="no-posts">
                まだ投稿がありません。最初の投稿をしてみましょう！
              </div>
            )}
            <PostForm
              onSubmit={handleAddPost}
              currentMaxId={posts.length}
              threadId={selectedThread._id}
            />
            <PostList posts={posts} onDelete={handleDeletePost} />
          </div>
        ) : (
          <ThreadList
            threads={threads}
            onDelete={handleDeleteThread}
            onSelect={setSelectedThread}
          />
        )}
        <footer className="footer">
          © 2024 掲示板アプリ All Rights Reserved
        </footer>
      </div>
    </div>
  );
}

export default App;
