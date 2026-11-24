try {
  // Importação dinâmica: erros de configuração das credenciais também caem no catch abaixo.
  const { db, NOME_COLECAO } = await import('./firebase.js');
  const { executarMenu } = await import('./menu.js');

  // Testa a conexão e as credenciais antes de abrir o menu.
  await db.collection(NOME_COLECAO).limit(1).get();
  console.log('✅ Conexão com o Firebase Cloud Firestore estabelecida.');
  await executarMenu();
} catch (erro) {
  console.error('\n❌ Não foi possível iniciar a aplicação.');
  console.error(`   ${erro.message}`);
  process.exitCode = 1;
}
