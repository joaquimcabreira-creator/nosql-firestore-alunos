import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as alunos from './alunos.js';
import {
  converterBooleano,
  exigirTexto,
  montarAlteracoes,
  montarAluno,
  validarData,
  validarPeriodo,
} from './validacao.js';

const rl = createInterface({ input: stdin, output: stdout });

const COLUNAS = [
  ['ID', 20],
  ['NOME', 24],
  ['TURMA', 10],
  ['NASCIMENTO', 13],
  ['ATIVO', 8],
];

function separador() {
  console.log('─'.repeat(78));
}

function celula(valor, tamanho) {
  return String(valor ?? '')
    .slice(0, tamanho)
    .padEnd(tamanho);
}

function exibirTabela(lista) {
  if (lista.length === 0) {
    console.log('Nenhum aluno encontrado.');
    return;
  }

  console.log(COLUNAS.map(([titulo, tamanho]) => celula(titulo, tamanho)).join(' | '));
  console.log(COLUNAS.map(([, tamanho]) => '─'.repeat(tamanho)).join('-|-'));

  for (const aluno of lista) {
    console.log(
      [
        celula(aluno.id, 20),
        celula(aluno.nome, 24),
        celula(aluno.turma, 10),
        celula(aluno.dataNascimento, 13),
        celula(aluno.ativo ? 'Sim' : 'Não', 8),
      ].join(' | ')
    );
  }

  console.log(`\n${lista.length} aluno(s) encontrado(s).`);
}

async function perguntar(mensagem) {
  return (await rl.question(mensagem)).trim();
}

async function perguntarValidado(mensagem, validador) {
  for (;;) {
    try {
      return validador(await perguntar(mensagem));
    } catch (erro) {
      console.log(`⚠ ${erro.message}`);
    }
  }
}

async function perguntarTexto(mensagem, campo) {
  return perguntarValidado(mensagem, (valor) => exigirTexto(valor, campo));
}

async function cadastrar() {
  console.log('\n--- CREATE: cadastrar aluno ---');
  const nome = await perguntarTexto('Nome: ', 'Nome');
  const turma = await perguntarTexto('Turma: ', 'Turma');
  const dataNascimento = await perguntarValidado(
    'Data de nascimento (AAAA-MM-DD): ',
    validarData
  );
  const ativo = await perguntarValidado('Ativo? (S/N): ', converterBooleano);

  const id = await alunos.criarAluno(montarAluno({ nome, turma, dataNascimento, ativo }));
  console.log(`✅ Aluno cadastrado com sucesso. ID: ${id}`);
}

async function listar() {
  console.log('\n--- READ: listar alunos ---');
  exibirTabela(await alunos.listarAlunos());
}

async function buscarPorId() {
  console.log('\n--- READ: buscar aluno por ID ---');
  const id = await perguntarTexto('ID do aluno: ', 'ID');
  const aluno = await alunos.buscarAlunoPorId(id);

  if (!aluno) {
    console.log('Nenhum aluno encontrado com esse ID.');
    return;
  }

  exibirTabela([aluno]);
}

async function atualizar() {
  console.log('\n--- UPDATE: atualizar aluno ---');
  const id = await perguntarTexto('ID do aluno: ', 'ID');
  const aluno = await alunos.buscarAlunoPorId(id);

  if (!aluno) {
    console.log('Nenhum aluno encontrado com esse ID.');
    return;
  }

  exibirTabela([aluno]);
  console.log('\nDeixe em branco para manter o valor atual.');

  const alteracoes = montarAlteracoes({
    nome: await perguntar(`Nome [${aluno.nome}]: `),
    turma: await perguntar(`Turma [${aluno.turma}]: `),
    dataNascimento: await perguntar(`Data de nascimento [${aluno.dataNascimento}]: `),
    ativo: await perguntar(`Ativo? S/N [${aluno.ativo ? 'S' : 'N'}]: `),
  });

  await alunos.atualizarAluno(id, alteracoes);
  console.log('✅ Aluno atualizado com sucesso.');
}

async function excluir() {
  console.log('\n--- DELETE: excluir aluno ---');
  const id = await perguntarTexto('ID do aluno: ', 'ID');
  const aluno = await alunos.buscarAlunoPorId(id);

  if (!aluno) {
    console.log('Nenhum aluno encontrado com esse ID.');
    return;
  }

  exibirTabela([aluno]);
  const confirmacao = await perguntarValidado('Confirma a exclusão? (S/N): ', converterBooleano);

  if (!confirmacao) {
    console.log('Exclusão cancelada.');
    return;
  }

  await alunos.excluirAluno(id);
  console.log('✅ Aluno excluído com sucesso.');
}

async function consultarTurma() {
  console.log('\n--- CONSULTA: alunos por turma ---');
  const turma = await perguntarTexto('Turma: ', 'Turma');
  exibirTabela(await alunos.consultarPorTurma(turma));
}

async function consultarData() {
  console.log('\n--- CONSULTA: alunos por data de nascimento ---');
  const data = await perguntarValidado('Data (AAAA-MM-DD): ', validarData);
  exibirTabela(await alunos.consultarPorDataNascimento(data));
}

async function consultarTurmaEData() {
  console.log('\n--- CONSULTA: alunos por turma E data de nascimento ---');
  const turma = await perguntarTexto('Turma: ', 'Turma');
  const data = await perguntarValidado('Data (AAAA-MM-DD): ', validarData);
  exibirTabela(await alunos.consultarPorTurmaEData(turma, data));
}

async function consultarPeriodo() {
  console.log('\n--- CONSULTA: alunos nascidos em um período ---');
  const { inicio, fim } = validarPeriodo(
    await perguntar('Data inicial (AAAA-MM-DD): '),
    await perguntar('Data final (AAAA-MM-DD): ')
  );
  exibirTabela(await alunos.consultarPorPeriodo(inicio, fim));
}

const ACOES = {
  '1': cadastrar,
  '2': listar,
  '3': buscarPorId,
  '4': atualizar,
  '5': excluir,
  '6': consultarTurma,
  '7': consultarData,
  '8': consultarTurmaEData,
  '9': consultarPeriodo,
};

const OPCOES = [
  ['1', 'Cadastrar aluno (CREATE)'],
  ['2', 'Listar alunos (READ)'],
  ['3', 'Buscar aluno por ID (READ)'],
  ['4', 'Atualizar aluno (UPDATE)'],
  ['5', 'Excluir aluno (DELETE)'],
  ['6', 'Consultar por turma'],
  ['7', 'Consultar por data de nascimento'],
  ['8', 'Consultar por turma + data (pode exigir índice)'],
  ['9', 'Consultar por período de nascimento'],
  ['0', 'Sair'],
];

export async function executarMenu() {
  console.log('\n=== CRUD DE ALUNOS — FIREBASE CLOUD FIRESTORE ===');

  try {
    for (;;) {
      separador();
      console.log('MENU PRINCIPAL');
      for (const [chave, descricao] of OPCOES) {
        console.log(` ${chave.padStart(2)}. ${descricao}`);
      }
      separador();

      const opcao = await perguntar('Escolha uma opção: ');

      if (opcao === '0') {
        console.log('Encerrando a aplicação. Até logo!');
        break;
      }

      const acao = ACOES[opcao];
      if (!acao) {
        console.log('⚠ Opção inválida. Tente novamente.');
        continue;
      }

      try {
        await acao();
      } catch (erro) {
        console.error(`❌ Erro: ${erro.message}`);
      }
    }
  } finally {
    rl.close();
  }
}
