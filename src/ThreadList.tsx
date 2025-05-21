import type { Thread } from "./api";

interface ThreadListProps {
  threads: Thread[];
  onDelete: (id: number) => void;
  onSelect: (thread: Thread) => void;
}

const ThreadList = ({ threads, onDelete, onSelect }: ThreadListProps) => {
  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <div key={thread._id} className="thread">
          <div className="thread-header">
            <h3 onClick={() => onSelect(thread)} style={{ cursor: "pointer" }}>
              {thread.title}
            </h3>
            <button
              className="delete-button"
              onClick={() => onDelete(thread._id)}
            >
              削除
            </button>
          </div>
          <p className="date">
            作成日時: {new Date(thread.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
