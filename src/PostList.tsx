import type { Post } from "./api";

interface PostListProps {
  posts: Post[];
  onDelete: (id: string) => void;
}

const PostList = ({ posts, onDelete }: PostListProps) => {
  const handleDelete = (id: string) => {
    console.log("Delete button clicked for post:", id);
    onDelete(id);
  };

  // 投稿を古い順にソート
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="post-list">
      {sortedPosts.map((post) => (
        <div key={post._id} className="post">
          <div className="post-header">
            <span className="post-number">#{post._id}</span>
          </div>
          <p>{post.content}</p>
          <p className="author">投稿者: {post.author}</p>
          <p className="date">
            投稿日時: {new Date(post.createdAt).toLocaleString()}
          </p>
          <button
            className="delete-button"
            onClick={() => handleDelete(post._id)}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostList;
