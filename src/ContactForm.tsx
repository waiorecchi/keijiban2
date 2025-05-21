import { useState } from "react";
import { sendContact } from "./api";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendContact({ name, email, message });
      console.log("お問い合わせが送信されました");
      // 送信後にフォームをリセット
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("送信エラー:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="お名前"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="お問い合わせ内容"
        required
      />
      <button type="submit">送信</button>
    </form>
  );
};

export default ContactForm;
