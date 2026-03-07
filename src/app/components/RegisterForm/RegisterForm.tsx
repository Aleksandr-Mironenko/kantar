"use client";

import { useState } from "react";
import ButtonSendCode from "../ButtonSendCode/ButtonSendCode";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [check, setCheck] = useState<boolean>(false);
  const [trueCode, setTrueCode] = useState<boolean>(false) //верный код подтверждения
  const [isFiledCheck, setIsFiledCheck] = useState<'error' | 'noFailed' | 'filledTime' | 'filledCode'>('noFailed') //флаг ошибки при проверке кода

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ошибка регистрации");
      return;
    }

    router.replace("/lk");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        minWidth: "300px",
        margin: "0 auto",
        gap: "12px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        marginBottom: '100px',
        marginTop: '100px'
      }}
    >
      <h2 style={{ textAlign: "center" }}>Регистрация</h2>

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
        type="tel"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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

      <ButtonSendCode check={check} trueCode={trueCode} isFiledCheck={isFiledCheck} email={email} phone={phone} setIsFiledCheck={setIsFiledCheck} setTrueCode={setTrueCode} setCheck={setCheck} />

      {check && trueCode && <p>Код подтверждения верный</p>}
      <button
        disabled={!check || !trueCode || !email || !password || !phone} type="submit"
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

        Зарегистрироваться
      </button>

      {error && (
        <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </form>
  );
}