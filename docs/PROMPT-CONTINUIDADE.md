# Prompt de continuidade — Projeto Abertura

Copie o texto abaixo para retomar o trabalho em outra conversa:

> Estou desenvolvendo o sistema de ingressos **Abertura** no Windows, usando Next.js, TypeScript, Node.js e Supabase. Sou iniciante e preciso de instruções passo a passo em português. Use a versão organizada `abertura-v3` como base, sem recomeçar do zero.
>
> **Regras:** ingresso individual R$ 25,00; casadinha R$ 40,00 para duas pessoas, com dois QR Codes de entrada independentes. Os QR Codes Pix do Banco do Brasil enviados pelo organizador estão em `public/pix-individual.jpeg` e `public/pix-casadinha.png`. O fluxo é confirmação manual: o organizador confere o crédito real no aplicativo do banco e confirma no painel; só depois o sistema deve emitir os ingressos. Desejamos notificar organizador e comprador por WhatsApp após a confirmação.
>
> **Já feito:** Node.js/npm instalados; o projeto anterior foi extraído, `npm install` executado e `npm run dev` abriu o site local. Esta versão contém documentação organizada, `.env.example`, `supabase/schema.sql`, fluxo inicial de pedido pendente, painel de confirmação e integração inicial com WhatsApp.
>
> **Próximos passos:** instalar dependências nesta versão; rodar `npm run typecheck` e `npm run build`; configurar Supabase e executar o SQL; preencher `.env.local` sem compartilhar segredos; testar autenticação, confirmação idempotente, emissão de um e dois ingressos, scanner e bloqueio de reuso; configurar WhatsApp Business Platform e templates; revisar segurança, dependências, privacidade, HTTPS e hospedagem.
>
> Não presuma que qualquer integração está funcionando sem testes. Não recomende vendas reais até completar configuração e revisão de segurança. Ao fim de cada etapa, atualize `docs/STATUS-E-PROXIMOS-PASSOS.md` e este resumo com o que foi concluído e o próximo passo. Nunca peça para eu enviar senhas, tokens ou chaves secretas no chat.
