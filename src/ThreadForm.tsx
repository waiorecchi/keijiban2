import { useState } from "react";
import type { Thread } from "./api";

interface ThreadFormProps {
  onSubmit: (thread: Omit<Thread, "_id" | "createdAt">) => void;
}

const ThreadForm = ({ onSubmit }: ThreadFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="thread-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="スレッドタイトル"
        required
      />
      <button type="submit">スレッドを作成</button>
    </form>
  );
};

export default ThreadForm;
