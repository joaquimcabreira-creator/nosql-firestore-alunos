# CRUD de Alunos — Firebase Cloud Firestore (Node.js)

Aplicação de terminal para manipular a coleção `alunos` no **Firebase Cloud Firestore**, desenvolvida como atividade prática da aula de **Banco de Dados NoSQL**.

## O que a aplicação faz

| Operação | Onde no menu |
| --- | --- |
| CREATE — cadastrar aluno | opção `1` |
| READ — listar todos / buscar por ID | opções `2` e `3` |
| UPDATE — atualizar aluno | opção `4` |
| DELETE — excluir aluno (com confirmação) | opção `5` |
| Consulta por turma | opção `6` |
| Consulta por data de nascimento | opção `7` |
| Consulta por turma **e** data (bônus) | opção `8` |
| Consulta por período de nascimento (bônus) | opção `9` |

### Estrutura do documento `alunos`

| Campo | Tipo | Exemplo |
| --- | --- | --- |
| `nome` | string | `"Ana"` |
| `turma` | string | `"3DSB"` |
| `dataNascimento` | string (`AAAA-MM-DD`) | `"2009-05-15"` |
| `ativo` | boolean | `true` |

O ID de cada documento é gerado automaticamente pelo Firestore.

## 1. Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Conta no [Firebase](https://firebase.google.com/)
- Acesso ao console do Firebase para criar projeto e gerar a chave de serviço

## 2. Configurar o Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um projeto.
2. No menu lateral, vá em **Build > Firestore Database** e clique em **Criar banco de dados**.
3. Escolha o modo de produção e a localidade desejada.
4. Vá em **Configurações do projeto** (ícone de engrenagem) > **Contas de serviço**.
5. Clique em **Gerar nova chave privada** e baixe o arquivo JSON.
6. Renomeie o arquivo para `serviceAccountKey.json` e coloque-o na raiz deste projeto:

```text
nosql-firestore-alunos/
├── serviceAccountKey.json   ← arquivo baixado do Firebase (NÃO publicar)
├── package.json
├── README.md
└── src/
```

> **Segurança:** `serviceAccountKey.json` já está listado no `.gitignore`. Nunca faça commit ou publique esse arquivo no GitHub.

### Caminho alternativo para a chave

Se quiser guardar a chave em outro local, defina a variável de ambiente antes de executar:

```powershell
# Windows PowerShell
$env:SERVICE_ACCOUNT_KEY = "C:\caminho\da\chave.json"
npm start
```

```bash
# Linux / macOS
export SERVICE_ACCOUNT_KEY=/caminho/da/chave.json
npm start
```

Também é possível usar `GOOGLE_APPLICATION_CREDENTIALS`, padrão do Google Cloud.

## 3. Instalar e executar

```bash
npm install
npm start
```

No Windows, se o PowerShell bloquear o comando `npm` por política de execução, use:

```powershell
cmd /c "npm.cmd install"
cmd /c "npm.cmd start"
```

Na primeira execução, a mensagem `✅ Conexão com o Firebase Cloud Firestore estabelecida.` confirma que as credenciais e o projeto estão corretos.

## 4. Exemplo de uso

```text
=== CRUD DE ALUNOS — FIREBASE CLOUD FIRESTORE ===
──────────────────────────────────────────────────────────────
MENU PRINCIPAL
  1. Cadastrar aluno (CREATE)
  2. Listar alunos (READ)
  3. Buscar aluno por ID (READ)
  4. Atualizar aluno (UPDATE)
  5. Excluir aluno (DELETE)
  6. Consultar por turma
  7. Consultar por data de nascimento
  8. Consultar por turma + data (pode exigir índice)
  9. Consultar por período de nascimento
  0. Sair
──────────────────────────────────────────────────────────────
Escolha uma opção: 1

--- CREATE: cadastrar aluno ---
Nome: Ana
Turma: 3DSB
Data de nascimento (AAAA-MM-DD): 2009-05-15
Ativo? (S/N): s
✅ Aluno cadastrado com sucesso. ID: 7xKp2mQa4RtBcDeFgHiJ
```

O programa valida os dados informados: campos obrigatórios, formato `AAAA-MM-DD`, data existente e valores `S`/`N` para o campo `ativo`.

## 5. Observação sobre índices

As opções `6`, `7` e `9` usam índices de campo único, criados automaticamente pelo Firestore.

A opção `8` combina dois filtros em campos diferentes. Se o Firestore exibir um erro de índice, abra o link retornado no próprio erro (ou acesse **Firestore Database > Índices**) e crie o índice composto sugerido para `turma` + `dataNascimento`.

## 6. Entrega sugerida

1. Crie um repositório no GitHub e envie este projeto.
2. Confira se `serviceAccountKey.json` e `node_modules/` **não** foram enviados.
3. Faça capturas de tela de:
   - cadastro de um aluno;
   - listagem dos alunos;
   - atualização e exclusão;
   - consulta por turma;
   - consulta por data de nascimento.
4. Envie no Google Sala de Aula o link do repositório e as capturas.

Use apenas dados fictícios, conforme a orientação da atividade.

## Estrutura do projeto

```text
src/
├── index.js       → ponto de entrada e teste de conexão
├── firebase.js    → inicialização do Firebase Admin SDK
├── alunos.js      → operações CRUD e consultas no Firestore
├── validacao.js   → validação dos dados de entrada
└── menu.js        → interface de terminal (menu e exibição)
```
