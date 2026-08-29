"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Structured Chatbot</h1>
      <p>Ask a question and receive a validated JSON response.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question..."
          rows={6}
          style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 8 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            fontSize: 16,
            borderRadius: 8,
            border: "none",
            background: loading ? "#888" : "#111",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Thinking..." : "Ask chatbot"}
        </button>
      </form>

      {error ? (
        <div style={{ marginTop: 20, color: "crimson", whiteSpace: "pre-wrap" }}>
          {error}
        </div>
      ) : null}

      {response ? (
        <pre
          style={{
            marginTop: 20,
            background: "#f4f4f4",
            padding: 16,
            borderRadius: 8,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </pre>
      ) : null}
    </main>
  );
}
