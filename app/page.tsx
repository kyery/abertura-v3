
"use client";

import { useState, type FormEvent } from "react";
import { TICKETS, type TicketKind } from "@/lib/pricing";

export default function HomePage() {
  const [kind, setKind] = useState<TicketKind>("individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = TICKETS[kind];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível criar o pedido.");
      }

      if (!data.orderUrl || !data.orderUrl.startsWith("/pedido/")) {
        throw new Error("O servidor não retornou um pedido válido.");
      }

      window.location.assign(data.orderUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro de conexão. Tente novamente."
      );
      setLoading(false);
    }
  }

  return (
    <main className="wrap section">
      <a className="brand" href="/">
        abertura<span>.</span>
      </a>

      <div className="panel" style={{ marginTop: 22 }}>
        <div className="eyebrow">INGRESSOS ONLINE</div>

        <h1>Garanta seu ingresso</h1>

        <p className="small">
          Escolha seu ingresso, preencha seus dados e realize
          o pagamento via Pix.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
            {(
              Object.entries(TICKETS) as [
                TicketKind,
                (typeof TICKETS)[TicketKind]
              ][]
            ).map(([key, ticket]) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 18,
                  border: kind === key
                    ? "2px solid #167454"
                    : "1px solid #d5ddd9",
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="ticket"
                  checked={kind === key}
                  onChange={() => setKind(key)}
                />

                <span style={{ flex: 1 }}>
                  <strong>{ticket.label}</strong>
                  <span className="small" style={{ display: "block" }}>
                    {ticket.quantity}{" "}
                    {ticket.quantity === 1 ? "pessoa" : "pessoas"}
                  </span>
                </span>

                <strong>
                  {ticket.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </label>
            ))}
          </div>

          <h2 style={{ marginTop: 28 }}>Seus dados</h2>

          <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
            <label>
              Nome completo
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={3}
                maxLength={120}
                autoComplete="name"
                placeholder="Digite seu nome completo"
                style={{ display: "block", width: "100%", padding: 12 }}
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                style={{ display: "block", width: "100%", padding: 12 }}
              />
            </label>

            <label>
              WhatsApp com DDD
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                minLength={10}
                maxLength={20}
                autoComplete="tel"
                placeholder="(98) 99999-9999"
                style={{ display: "block", width: "100%", padding: 12 }}
              />
            </label>
          </div>

          {error && (
            <div className="result invalid" style={{ marginTop: 18 }}>
              {error}
            </div>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ marginTop: 24, width: "100%" }}
          >
            {loading
              ? "Criando pedido..."
              : `Continuar para o Pix — ${selected.price.toLocaleString(
                  "pt-BR",
                  { style: "currency", currency: "BRL" }
                )}`}
          </button>
        </form>

        <p className="small" style={{ marginTop: 18 }}>
          O pagamento é conferido pelo organizador. Após a confirmação,
          os ingressos ficam disponíveis na página do pedido.
          Cada ingresso possui um QR Code exclusivo para entrada.
        </p>
      </div>
    </main>
  );
}
