# Abertura — Sistema de Ingressos

Projeto web para o evento **Abertura**, construído com Next.js, TypeScript e Supabase. Esta pasta foi organizada a partir do projeto existente para evitar recomeçar do zero.

## Regras do evento

- **Individual:** R$ 25,00 — 1 ingresso.
- **Casadinha:** R$ 40,00 — 2 ingressos, cada um com QR Code de entrada próprio.
- **Pagamento:** QR Code Pix do Banco do Brasil fornecido pelo organizador.
- **Confirmação:** manual. O organizador precisa verificar o crédito no aplicativo bancário e então confirmar o pedido no painel.
- **WhatsApp:** integração opcional com a WhatsApp Business Platform. Só funciona depois de configurar credenciais válidas e os modelos exigidos pela Meta.

> **Não está pronto para vendas reais.** Ainda é necessário configurar o Supabase e as credenciais, revisar as rotas e permissões, testar todos os fluxos, verificar as dependências e publicar em ambiente HTTPS. O site local abrir não comprova que os pagamentos, WhatsApp ou segurança estejam funcionando.

## Requisitos

- Windows 10/11
- Node.js LTS (Node 22 ou superior recomendado)
- Conta/projeto Supabase
- Conta WhatsApp Business Platform, se desejar notificações reais

## Executar no Windows (PowerShell)

1. Extraia o ZIP para uma pasta simples, por exemplo `C:\Users\SEU_USUARIO\Downloads\abertura-v3`.
2. Abra a pasta no Explorador de Arquivos.
3. Clique na barra de endereço, digite `powershell` e pressione Enter. Isso abre o PowerShell nessa pasta.
4. Instale as dependências:

   ```powershell
   npm install
   ```

5. Crie `.env.local` copiando `.env.example`. Não compartilhe esse arquivo e nunca coloque segredos em variáveis `NEXT_PUBLIC_`.
6. Configure o banco conforme a seção abaixo.
7. Inicie o ambiente local:

   ```powershell
   npm run dev
   ```

8. Abra `http://localhost:3000` no navegador.

## Configurar Supabase

1. O projeto Supabase `abertura-ingressos` já foi criado na região São Paulo. URL: <https://supabase.com/dashboard/project/rkvmilonozvcahtzccae>.
2. O esquema SQL inicial já foi aplicado ao banco. O arquivo `supabase/schema.sql` fica no projeto como referência.
3. Em **Project Settings → API**, copie a chave secreta `service_role` para o arquivo `.env.local` local. A URL já está preenchida no `.env.example`.
4. A chave `service_role` dá acesso privilegiado ao banco: mantenha-a somente no servidor e nunca a envie no chat, em capturas de tela ou para o GitHub.
5. Preencha `ADMIN_PASSWORD` com uma senha exclusiva e forte e `ADMIN_SESSION_SECRET` com um segredo aleatório longo.

Para gerar um segredo no PowerShell, execute:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Veja `.env.example` para a lista de variáveis. Não use os valores ilustrativos em um site publicado.

## Fluxo de pagamento

1. O comprador cria um pedido.
2. O pedido permanece `pending`; a página mostra o QR Code Pix correspondente.
3. O organizador verifica no Banco do Brasil que o crédito realmente entrou.
4. O organizador entra no painel administrativo e confirma o pedido.
5. A aplicação solicita ao banco de dados confirmar o pedido e emitir os ingressos.
6. O sistema tenta enviar as notificações configuradas.

**Importante:** o site não detecta automaticamente a chegada do Pix com os QR Codes atuais. Nunca confirme com base apenas em comprovante enviado pelo comprador.

## WhatsApp

O arquivo `lib/whatsapp.ts` contém a integração inicial com a API do WhatsApp Business Platform. Configure as variáveis de ambiente indicadas em `.env.example`. A Meta pode exigir templates aprovados para mensagens iniciadas pela empresa; o envio de texto livre pode falhar fora da janela permitida. Teste com números autorizados antes de produção.

## Comandos úteis

```powershell
npm run dev       # executar localmente
npm run typecheck # verificar tipos TypeScript
npm run build     # testar compilação de produção
npm run start     # executar build de produção
npm audit         # verificar vulnerabilidades reportadas nas dependências
```

Não use `npm audit fix --force` sem analisar as mudanças, pois pode introduzir incompatibilidades.

## Documentação do projeto

- `docs/STATUS-E-PROXIMOS-PASSOS.md` — o que está feito e o que falta.
- `docs/PROMPT-CONTINUIDADE.md` — prompt resumido para retomar o projeto em outra conversa.
- `docs/CHECKLIST-PRE-PRODUCAO.md` — verificações obrigatórias antes de vender ingressos.
- `supabase/schema.sql` — tabelas e funções do banco.

## Limites conhecidos

Esta é uma base de desenvolvimento, não uma certificação de segurança. Antes de vendas reais, revisar autenticação, autorização, proteção contra tentativas repetidas, privacidade, termos, logs, recuperação de conta, templates de WhatsApp, configuração HTTPS, backups e tratamento de falhas. Também é necessário executar build e testes no ambiente de destino.
