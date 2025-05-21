export interface Thread {
  _id: number;
  title: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  threadId: number;
  content: string;
  author: string;
  createdAt: string;
}

const API_BASE_URL = "/api";

// 共通のリクエストハンドラ
const handleRequest = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "リクエストに失敗しました");
  }

  return response.json();
};

export const getThreads = async (): Promise<Thread[]> => {
  return handleRequest<Thread[]>("/threads");
};

export const createThread = async (
  threadData: Omit<Thread, "_id" | "createdAt">
): Promise<Thread> => {
  return handleRequest<Thread>("/threads", {
    method: "POST",
    body: JSON.stringify(threadData),
  });
};

export const getPosts = async (threadId: number): Promise<Post[]> => {
  return handleRequest<Post[]>(`/threads/${threadId}/posts`);
};

export const createPost = async (
  threadId: number,
  postData: Omit<Post, "_id" | "threadId" | "createdAt">
): Promise<Post> => {
  return handleRequest<Post>(`/threads/${threadId}/posts`, {
    method: "POST",
    body: JSON.stringify(postData),
  });
};

export const deleteThread = async (
  threadId: number
): Promise<{ message: string }> => {
  return handleRequest<{ message: string }>(`/threads/${threadId}`, {
    method: "DELETE",
  });
};

export const deletePost = async (
  threadId: number,
  postId: string
): Promise<{ message: string }> => {
  return handleRequest<{ message: string }>(
    `/threads/${threadId}/posts/${postId}`,
    {
      method: "DELETE",
    }
  );
};

export const updatePost = async (
  id: number,
  postData: Partial<Omit<Post, "createdAt">>
): Promise<Post> => {
  return handleRequest<Post>(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });
};

export const sendContact = async (contactData: {
  name: string;
  email: string;
  message: string;
}): Promise<{ message: string }> => {
  return handleRequest<{ message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(contactData),
  });
};
