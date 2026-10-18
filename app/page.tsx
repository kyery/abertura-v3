
"use client";

import { useEffect, useRef, useState } from "react";

type ValidationResult = {
  ok: boolean;
  message: string;
  ticket?: {
    id?: string;
    buyer_name?: string;
  };
  alreadyUsed?: boolean;
};

export default function ScannerPage() {
  const host = useRef<HTMLDivElement>(null);
  const scanner = useRef<any>(null);
  const locked = useRef(false);
  const mounted = useRef(true);

  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  async function validate(token: string) {
    if (locked.current) return;

    locked.current = true;
    setBusy(true);
    setResult(null);

    // Pausa a leitura antes de enviar a validação.
    try {
      scanner.current?.pause(true);
    } catch {
      // A pausa da câmera não altera o resultado da validação.
    }

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!mounted.current) return;

      setResult({
        ...data,
        ok: response.ok && data.ok !== false,
        alreadyUsed: response.status === 409,
        message:
          data.message ||
          (response.status === 409
            ? "Este ingresso já foi utilizado."
            : response.ok
              ? "Ingresso validado com sucesso."
              : "Não foi possível validar o ingresso."),
      });
    } catch {
      if (mounted.current) {
        setResult({
          ok: false,
          message: "Falha de conexão. Verifique a internet e tente novamente.",
        });
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  function extractToken(decoded: string) {
    try {
      const url = new URL(decoded);
      return url.pathname.split("/").filter(Boolean).pop() || decoded;
    } catch {
      return decoded.trim();
    }
  }

  async function start() {
    if (!host.current || scanner.current) return;

    locked.current = false;
    setResult(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const reader = new Html5Qrcode("qr-reader");
      scanner.current = reader;

      await reader.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        (decoded: string) => {
          if (locked.current) return;
          const token = extractToken(decoded);
          if (token) void validate(token);
        },
        () => {}
      );

      if (mounted.current) setRunning(true);
    } catch {
      scanner.current = null;
      setRunning(false);
      setResult({
        ok: false,
        message:
          "Não foi possível abrir a câmera. Autorize o acesso e use HTTPS.",
      });
    }
  }

  async function stop() {
    locked.current = true;

    if (scanner.current) {
      try {
        await scanner.current.stop();
      } catch {}

      try {
        scanner.current.clear();
      } catch {}

      scanner.current = null;
    }

    setRunning(false);
  }

  function nextTicket() {
    if (busy) return;

    setResult(null);
    locked.current = false;

    try {
      scanner.current?.resume();
    } catch {
      void stop();
    }
  }

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      locked.current = true;

      if (scanner.current) {
        const reader = scanner.current;
        scanner.current = null;
        void reader.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <main className="wrap section">
      <a className="brand" href="/">
        abertura<span>.</span>
      </a>

      <div className="panel" style={{ marginTop: 22 }}>
        <div className="eyebrow">Portaria</div>
        <h1>Leitor de ingressos</h1>

        <p className="small">
          Escaneie um ingresso por vez. Confira o resultado antes de
          liberar a entrada.
        </p>

        <div id="qr-reader" ref={host} className="scanner" />

        <div className="row" style={{ marginTop: 14 }}>
          <button
            className="btn"
            onClick={running ? stop : start}
            disabled={busy}
          >
            {running ? "Parar câmera" : "Ativar câmera"}
          </button>

          {running && result && (
            <button
              className="btn secondary"
              onClick={nextTicket}
              disabled={busy}
            >
              Ler próximo ingresso
            </button>
          )}
        </div>

        {busy && (
          <p style={{ marginTop: 18 }}>
            Validando ingresso...
          </p>
        )}

        {result && (
          <div
            className={"result " + (!result.ok ? "invalid" : "")}
            style={{ marginTop: 18 }}
          >
            <strong>
              {result.ok
                ? "ENTRADA LIBERADA"
                : result.alreadyUsed
                  ? "INGRESSO JÁ UTILIZADO"
                  : "ENTRADA NÃO LIBERADA"}
            </strong>

            <p>{result.message}</p>

            {result.ticket && (
              <p className="small">
                Ingresso: {result.ticket.id?.slice(0, 8)}
                {result.ticket.buyer_name
                  ? ` · ${result.ticket.buyer_name}`
                  : ""}
              </p>
            )}
          </div>
        )}

        <p className="small" style={{ marginTop: 18 }}>
          Cada ingresso permite uma única entrada. A validação é
          registrada no servidor.
        </p>
      </div>

      <a
        href="/admin"
        className="btn secondary"
        style={{ marginTop: 14 }}
      >
        Voltar ao painel
      </a>
    </main>
  );
}
