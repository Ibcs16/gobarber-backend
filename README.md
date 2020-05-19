# Requisitos do sistema

## RF
*requisitos funcionais* - Funcionalidades reais

## RNF
*requisitos não funcionais* - (tecnologias e metodologias) Não é ligado diretamente à regra de negócio

## RN
*regras de negócio* - Regras para ações serem concluídas

# Separando Requisitos

Requisitos podem ser coletados com cliente final, em uma análise de telas e funcionalidades do sistema

# Macros e micros

## Recuperação de Senha

**RF**

- O usuário deve poder recuperar sua senha, informando o seu email;
- O usuário deve receber um email com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar mailtrap para testar envio de email em desenvolvimento;
- Utilizar amazon SES para envio em produção;
- O envio de emails deve acontecer em segundo plano (background job - fila);

**RN**

- O link enviado por email para resetar senha, deve expirar em 2hs;
- O usuário precisa confirmar nova senha no reset de senha;

## Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha;

**RN**

- O usuário não deve alterar seu email para email já utilizado;
- Para atualizar sua senha, o usuário deve informar sua senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar nova senha;

## Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando socket.io

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;


## Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados
- O usuário deve poder listar os dias de um mês com horário disponível de um prestados;
- O usuário deve poder listar horários de um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com o prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Deve haver pelo menos um horário disponível no dia para ele ser listado no mês;
- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
