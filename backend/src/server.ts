import express, { Request, Response, RequestHandler } from "express";
import mongoose, { Schema, Document, Model } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

// ミドルウェア

app.use(
  cors({
    //origin: "http://localhost:5173", // Viteのデフォルトポート
    //credentials: true,
  })
);
app.use(express.json());

// 静的ファイルの提供
const distPath = path.join(__dirname, "../dist");
console.log("Static files path:", distPath);
app.use(express.static(distPath));

// MongoDB接続
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDBに接続しました"))
  .catch((err) => console.error("MongoDB接続エラー:", err));

// 型定義
interface IThread extends Document {
  title: string;
  createdAt: Date;
}

interface IPost extends Document {
  threadId: number;
  content: string;
  author: string;
  createdAt: Date;
}

// スキーマ定義
const threadSchema: Schema = new Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema: Schema = new Schema({
  threadId: { type: Number, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Thread: Model<IThread> = mongoose.model<IThread>("Thread", threadSchema);
const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

// スレッドIDのカウンターを取得する関数
const getNextThreadId = async (): Promise<number> => {
  const lastThread = await Thread.findOne().sort({ _id: -1 }).exec();
  return lastThread ? Number(lastThread._id) + 1 : 1;
};

// APIルート
app.get("/api/threads", async (req: Request, res: Response) => {
  try {
    const threads = await Thread.find().sort({ createdAt: -1 });
    res.json(threads);
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.post("/api/threads", async (req: Request, res: Response) => {
  const { title } = req.body;
  const _id = await getNextThreadId();
  const thread = new Thread({ _id, title });

  try {
    const savedThread = await thread.save();
    res.status(201).json(savedThread);
  } catch (err) {
    res
      .status(400)
      .json({ message: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.get("/api/threads/:threadId/posts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      threadId: Number(req.params.threadId),
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.post(
  "/api/threads/:threadId/posts",
  async (req: Request, res: Response) => {
    const { content, author } = req.body;
    const threadId = Number(req.params.threadId);
    const post = new Post({ threadId, content, author });

    try {
      const savedPost = await post.save();
      res.status(201).json(savedPost);
    } catch (err) {
      res.status(400).json({
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
);

app.delete("/api/threads/:threadId", (async (req: Request, res: Response) => {
  try {
    const threadId = Number(req.params.threadId);
    await Post.deleteMany({ threadId });
    const result = await Thread.findOneAndDelete({ _id: threadId });
    if (!result) {
      return res.status(404).json({ message: "スレッドが見つかりません" });
    }
    res.json({ message: "スレッドを削除しました" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "Unknown error" });
  }
}) as RequestHandler);

app.delete("/api/threads/:threadId/posts/:postId", (async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Post.findOneAndDelete({
      _id: req.params.postId,
      threadId: Number(req.params.threadId),
    });
    if (!result) {
      return res.status(404).json({ message: "投稿が見つかりません" });
    }
    res.json({ message: "投稿を削除しました" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err instanceof Error ? err.message : "Unknown error" });
  }
}) as RequestHandler);

// すべてのルートをindex.htmlにリダイレクト（SPA用）
app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, "../dist/index.html");
  console.log("Index file path:", indexPath);
  res.sendFile(indexPath);
});

const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
