# Abertura — status e próximos passos

Atualizado em 2026-10-18.

## Contexto confirmado

- Evento: Abertura.
- Ingresso individual: R$ 25,00.
- Casadinha: R$ 40,00 para duas pessoas, com dois QR Codes de entrada separados.
- Recebimento escolhido: QR Codes Pix do Banco do Brasil enviados pelo organizador.
- Confirmação escolhida: manual no painel após conferir o crédito no aplicativo bancário.
- Notificações desejadas: organizador e comprador pelo WhatsApp.
- Usuário trabalha no Windows e precisa de orientação passo a passo, sem pressupor experiência de programação.

## Feito até agora

- Node.js e npm instalados no Windows.
- Projeto anterior extraído, dependências instaladas e site iniciado localmente com `npm run dev`.
- Projeto existente organizado nesta versão `abertura-v3`.
- QR Codes Pix enviados pelo organizador estão em `public/pix-individual.jpeg` e `public/pix-casadinha.png`.
- Existe esquema SQL em `supabase/schema.sql` para pedidos, ingressos, logs de entrada e funções de confirmação/check-in.
- Existe fluxo inicial de pedido pendente, confirmação manual protegida por sessão e tentativa de envio via WhatsApp.

## Ainda não comprovado

- Supabase `abertura-ingressos` criado e ativo na região São Paulo (`sa-east-1`); URL `https://rkvmilonozvcahtzccae.supabase.co`.
- SQL inicial aplicado com sucesso; tabelas `orders`, `tickets` e `entry_logs` confirmadas com RLS ativado.
- `.env.local` configurado com valores reais e guardado em segurança.
- Build, tipos e testes executados nesta versão: a correção de JSX foi feita, mas a instalação de dependências e compilação não puderam ser validadas neste ambiente porque o acesso ao registro npm falhou por DNS.
- Login e autorização testados em navegador.
- QR Codes de pagamento conferidos quanto a validade, titularidade e valores.
- Templates e credenciais WhatsApp aprovados/configurados.
- Notificações entregues com sucesso.
- Testes completos de emissão e check-in.
- Hospedagem HTTPS e domínio configurados.

## Próxima etapa recomendada

1. Baixar e extrair o ZIP corrigido em uma pasta nova.
2. Criar `.env.local` a partir de `.env.example` e preencher a chave privada `SUPABASE_SERVICE_ROLE_KEY`, senha de administrador e segredo de sessão.
3. No computador com internet, rodar `npm install`, `npm run typecheck` e `npm run build`; corrigir qualquer erro remanescente antes de publicar.
4. Testar o painel, pedido pendente, confirmação, emissão de um e dois ingressos e check-in duplicado.
5. Configurar WhatsApp Business Platform oficial e templates aprovados.
6. Fazer revisão de segurança e publicar em hospedagem HTTPS só depois de todos os testes.

## Regra de honestidade

Não afirmar que o sistema está pronto para produção até as integrações reais serem configuradas e os testes passarem. Não pedir ao usuário que envie senhas, chaves secretas, tokens, ou arquivo `.env.local` no chat.
