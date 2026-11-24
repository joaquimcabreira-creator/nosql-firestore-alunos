import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const NOME_COLECAO = 'alunos';

function criarCredencial() {
  const caminhoChave = resolve(process.env.SERVICE_ACCOUNT_KEY ?? 'serviceAccountKey.json');

  if (existsSync(caminhoChave)) {
    const chave = JSON.parse(readFileSync(caminhoChave, 'utf8'));
    return cert(chave);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return applicationDefault();
  }

  throw new Error(
    'Chave de serviço não encontrada. No Firebase, acesse Configurações do projeto > Contas de serviço, ' +
      'gere uma nova chave privada e salve o JSON como serviceAccountKey.json na raiz do projeto. ' +
      'Outra opção é definir a variável SERVICE_ACCOUNT_KEY com o caminho do arquivo.'
  );
}

if (getApps().length === 0) {
  initializeApp({ credential: criarCredencial() });
}

export const db = getFirestore();
