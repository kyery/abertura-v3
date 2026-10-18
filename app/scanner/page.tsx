"use client";
import { useEffect, useRef, useState } from "react";
export default function ScannerPage() {
  const host = useRef<HTMLDivElement>(null); const scanner = useRef<any>(null);
  const [running,setRunning] = useState(false); const [busy,setBusy] = useState(false); const [result,setResult] = useState<any>(null);
  async function validate(token:string) {
    if(busy) return; setBusy(true); setResult(null);
    try {
      const r = await fetch("/api/validate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token})});
      const d = await r.json(); setResult({...d,ok:r.ok});
      if(scanner.current) await scanner.current.pause(true);
    } catch { setResult({ok:false,message:"Falha de conexão. Confira a internet e tente novamente."}); }
    finally { setBusy(false); }
  }
  async function start() {
    if(!host.current || scanner.current) return;
    const { Html5Qrcode } = await import("html5-qrcode");
    const id = "qr-reader";
    scanner.current = new Html5Qrcode(id);
    try {
      await scanner.current.start({ facingMode:"environment" }, { fps:10, qrbox:{width:230,height:230} },
        (decoded:string)=>{ try { const u=new URL(decoded); const token=u.pathname.split("/").filter(Boolean).pop(); if(token) void validate(token); } catch { void validate(decoded); } },
        ()=>{});
      setRunning(true);
    } catch(e) { setResult({ok:false,message:"Não foi possível abrir a câmera. Autorize o acesso e use o site em HTTPS."}); scanner.current=null; }
  }
  async function stop() { if(scanner.current) { try { await scanner.current.stop(); scanner.current.clear(); } catch {} scanner.current=null; } setRunning(false); }
  useEffect(()=>()=>{ if(scanner.current) { scanner.current.stop().catch(()=>{}); } },[]);
  return <main className="wrap section"><a className="brand" href="/">abertura<span>.</span></a><div className="panel" style={{marginTop:22}}><div className="eyebrow">Portaria</div><h1>Leitor de ingressos</h1><p className="small">Permita acesso à câmera. Após ler, confira o resultado antes de entregar a pulseira.</p><div id="qr-reader" ref={host} className="scanner"/><div className="row" style={{marginTop:14}}><button className="btn" onClick={running?stop:start}>{running?"Parar câmera":"Ativar câmera"}</button><button className="btn secondary" onClick={()=>setResult(null)}>Limpar resultado</button></div>
    {result&&<div className={"result "+(!result.ok?"invalid":"")} style={{marginTop:18}}><strong>{result.ok?"ENTRADA LIBERADA":"ENTRADA NÃO LIBERADA"}</strong><p>{result.message}</p>{result.ticket&&<p className="small">Ingresso: {result.ticket.id?.slice(0,8)} · {result.ticket.buyer_name}</p>}</div>}
    <p className="small" style={{marginTop:18}}>O sistema registra a validação no servidor. A câmera exige HTTPS quando estiver publicado.</p></div><a href="/admin" className="btn secondary" style={{marginTop:14}}>Voltar ao painel</a></main>;
}
