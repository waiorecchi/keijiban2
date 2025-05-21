import { useState } from "react";
import type { Post } from "./api";

interface PostFormProps {
  onSubmit: (post: Omit<Post, "createdAt">) => void;
  currentMaxId: number;
  threadId: number;
}

const PostForm = ({ onSubmit, currentMaxId, threadId }: PostFormProps) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      content,
      author: author.trim() === "" ? "名無し" : author,
      _id: String(currentMaxId + 1),
      threadId,
    });
    setContent("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
        required
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="投稿者"
      />
      <button type="submit">投稿</button>
    </form>
  );
};

export default PostForm;
