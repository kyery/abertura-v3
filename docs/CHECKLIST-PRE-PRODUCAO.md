# Checklist antes de vender ingressos reais

Marque os itens somente depois de testar e confirmar.

## Ambiente e banco
- [ ] `npm install` termina sem erro.
- [ ] `npm run typecheck` termina sem erro.
- [ ] `npm run build` termina sem erro.
- [ ] Projeto Supabase correto criado e SQL aplicado.
- [ ] `.env.local` não está no Git nem foi compartilhado.
- [ ] Chave `service_role` só é usada no servidor.
- [ ] RLS e permissões foram revisadas.

## Fluxo de pedidos
- [ ] Individual custa exatamente R$ 25,00 e cria um ingresso.
- [ ] Casadinha custa exatamente R$ 40,00 e cria dois ingressos diferentes.
- [ ] Pedido novo fica pendente.
- [ ] Não é possível marcar pago apenas pelo navegador do comprador.
- [ ] Apenas administrador autenticado pode confirmar pagamento.
- [ ] A confirmação exige conferência do crédito real no banco.
- [ ] Clique repetido não cria ingressos duplicados.
- [ ] Link privado do pedido usa token imprevisível e não expõe dados a terceiros.

## Portaria
- [ ] Apenas equipe autorizada consegue usar o scanner.
- [ ] Ingresso válido e pago é aceito uma vez.
- [ ] Segundo uso do mesmo QR Code é bloqueado.
- [ ] Ingresso pendente, cancelado ou inválido é recusado.
- [ ] Casadinha permite entradas separadas usando dois códigos distintos.

## WhatsApp
- [ ] Conta WhatsApp Business Platform configurada.
- [ ] Número remetente e credenciais configurados como segredos no servidor.
- [ ] Templates necessários foram aprovados pela Meta.
- [ ] Comprador deu consentimento apropriado para receber mensagens.
- [ ] Mensagem para organizador testada.
- [ ] Mensagem para comprador testada.
- [ ] Falha no WhatsApp não desfaz nem duplica a confirmação do pagamento.

## Publicação e privacidade
- [ ] QR Codes Pix verificados e testados com valor correto.
- [ ] Política de privacidade e termos publicados.
- [ ] Domínio e HTTPS configurados.
- [ ] Limitação de tentativas/rate limiting revisada.
- [ ] Logs não expõem tokens, dados pessoais ou credenciais.
- [ ] Backup e plano de recuperação definidos.
- [ ] Testes completos realizados em ambiente de homologação.
- [ ] Responsável autorizou início das vendas.
