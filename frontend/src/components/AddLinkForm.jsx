import { useState } from "react";
import { api } from "../api";

export default function AddLinkForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/links", { url, code });
      setMsg("Link created!");
      onCreated();
      setUrl("");
      setCode("");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }

    setLoading(false);
  };

  return (
    <form className="space-y-3 mb-6" onSubmit={submit}>
      <input
        className="border px-3 py-2 w-full"
        placeholder="Long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        className="border px-3 py-2 w-full"
        placeholder="Custom Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create"}
      </button>
      <p className="text-sm text-gray-700">{msg}</p>
    </form>
  );
}
