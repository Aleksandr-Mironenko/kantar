"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }

    alert("Вход выполнен!");
    window.location.href = "/";
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        margin: "0 auto",
        gap: "12px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Вход</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "10px",
          fontSize: "14px",
          borderRadius: "4px",
          backgroundColor: "#ff0d01",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Войти
      </button>

      {error && (
        <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </form>
  );
}