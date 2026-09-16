const mysql = require('mysql2/promise');

async function main() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'portfolio'
    });

    console.log('Conectado ao MySQL - Banco: portfolio\n');

    const usuarios = [
        {
            tipo: 'admin',
            nome: 'Administrador Geral',
            email: 'admin@portfolio.com',
            senha: 'admin123'
        },
        {
            tipo: 'professor',
            nome: 'Maria Silva',
            email: 'professor@sesi.com',
            senha: 'prof123',
            departamento: 'Linguagens'
        },
        {
            tipo: 'aluno',
            nome: 'Aluno',
            email: 'aluno@sesi.com',
            senha: 'aluno123',
            matricula: '2025001'
        }
    ];

    let cadastrados = 0;
    let erros = 0;

    for (const user of usuarios) {
        try {
            if (user.tipo === 'admin') {
                await db.execute(
                    'INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)',
                    [user.nome, user.email, user.senha]
                );
            } else if (user.tipo === 'professor') {
                await db.execute(
                    'INSERT INTO professores (nome, email, senha, departamento) VALUES (?, ?, ?, ?)',
                    [user.nome, user.email, user.senha, user.departamento]
                );
            } else if (user.tipo === 'aluno') {
                await db.execute(
                    'INSERT INTO alunos (nome, email, senha, matricula) VALUES (?, ?, ?, ?)',
                    [user.nome, user.email, user.senha, user.matricula]
                );
            }
            console.log(`✓ [${user.tipo}] ${user.nome} - cadastrado com sucesso`);
            cadastrados++;
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(`✗ [${user.tipo}] ${user.nome} - email já cadastrado`);
            } else {
                console.log(`✗ [${user.tipo}] ${user.nome} - erro: ${err.message}`);
            }
            erros++;
        }
    }

    console.log(`\n--- Resumo ---`);
    console.log(`Cadastrados: ${cadastrados}`);
    console.log(`Erros/Duplicados: ${erros}`);

    await db.end();
}

main();
