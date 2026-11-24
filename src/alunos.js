import { db, NOME_COLECAO } from './firebase.js';

const colecao = () => db.collection(NOME_COLECAO);

function mapear(documento) {
  return { id: documento.id, ...documento.data() };
}

function ordenarPorNome(lista) {
  return lista.sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'pt-BR'));
}

// CREATE
export async function criarAluno(dados) {
  const referencia = await colecao().add(dados);
  return referencia.id;
}

// READ (todos)
export async function listarAlunos() {
  const consulta = await colecao().get();
  return ordenarPorNome(consulta.docs.map(mapear));
}

// READ (por ID)
export async function buscarAlunoPorId(id) {
  const documento = await colecao().doc(id).get();
  return documento.exists ? mapear(documento) : null;
}

// UPDATE
export async function atualizarAluno(id, alteracoes) {
  const referencia = colecao().doc(id);
  const documento = await referencia.get();

  if (!documento.exists) {
    throw new Error(`Não existe aluno com o ID "${id}".`);
  }

  await referencia.update(alteracoes);
  return { id, ...documento.data(), ...alteracoes };
}

// DELETE
export async function excluirAluno(id) {
  const referencia = colecao().doc(id);
  const documento = await referencia.get();

  if (!documento.exists) {
    throw new Error(`Não existe aluno com o ID "${id}".`);
  }

  const aluno = mapear(documento);
  await referencia.delete();
  return aluno;
}

// CONSULTAS
export async function consultarPorTurma(turma) {
  const consulta = await colecao().where('turma', '==', turma).get();
  return ordenarPorNome(consulta.docs.map(mapear));
}

export async function consultarPorDataNascimento(dataNascimento) {
  const consulta = await colecao().where('dataNascimento', '==', dataNascimento).get();
  return ordenarPorNome(consulta.docs.map(mapear));
}

export async function consultarPorTurmaEData(turma, dataNascimento) {
  const consulta = await colecao()
    .where('turma', '==', turma)
    .where('dataNascimento', '==', dataNascimento)
    .get();
  return ordenarPorNome(consulta.docs.map(mapear));
}

export async function consultarPorPeriodo(inicio, fim) {
  const consulta = await colecao()
    .where('dataNascimento', '>=', inicio)
    .where('dataNascimento', '<=', fim)
    .get();
  return ordenarPorNome(consulta.docs.map(mapear));
}
