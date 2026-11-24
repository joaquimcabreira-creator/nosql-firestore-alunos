const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function exigirTexto(valor, nomeDoCampo) {
  const texto = String(valor ?? '').trim();
  if (!texto) {
    throw new Error(`${nomeDoCampo} é obrigatório.`);
  }
  return texto;
}

export function validarData(valor) {
  const data = String(valor ?? '').trim();

  if (!FORMATO_DATA.test(data)) {
    throw new Error('Data inválida. Use o formato AAAA-MM-DD (ex.: 2009-05-15).');
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const objeto = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    objeto.getUTCFullYear() !== ano ||
    objeto.getUTCMonth() !== mes - 1 ||
    objeto.getUTCDate() !== dia
  ) {
    throw new Error('Data inexistente. Confira o dia, o mês e o ano.');
  }

  return data;
}

export function converterBooleano(valor) {
  const entrada = String(valor ?? '')
    .trim()
    .toLowerCase();

  if (['s', 'sim', 'true', '1', 'ativo'].includes(entrada)) return true;
  if (['n', 'nao', 'não', 'false', '0', 'inativo'].includes(entrada)) return false;

  throw new Error('Informe S para ativo ou N para inativo.');
}

export function validarPeriodo(inicio, fim) {
  const inicioValido = validarData(inicio);
  const fimValido = validarData(fim);

  if (inicioValido > fimValido) {
    throw new Error('A data inicial deve ser menor ou igual à data final.');
  }

  return { inicio: inicioValido, fim: fimValido };
}

export function montarAluno({ nome, turma, dataNascimento, ativo }) {
  return {
    nome: exigirTexto(nome, 'Nome'),
    turma: exigirTexto(turma, 'Turma'),
    dataNascimento: validarData(dataNascimento),
    ativo: converterBooleano(ativo),
  };
}

export function montarAlteracoes({ nome, turma, dataNascimento, ativo }) {
  const alteracoes = {};

  if (String(nome ?? '').trim()) alteracoes.nome = exigirTexto(nome, 'Nome');
  if (String(turma ?? '').trim()) alteracoes.turma = exigirTexto(turma, 'Turma');
  if (String(dataNascimento ?? '').trim()) {
    alteracoes.dataNascimento = validarData(dataNascimento);
  }
  if (String(ativo ?? '').trim()) alteracoes.ativo = converterBooleano(ativo);

  if (Object.keys(alteracoes).length === 0) {
    throw new Error('Nenhum campo foi informado. Nada foi alterado.');
  }

  return alteracoes;
}
