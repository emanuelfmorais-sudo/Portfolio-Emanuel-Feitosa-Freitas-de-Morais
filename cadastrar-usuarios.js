const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as tuas credenciais reais
const SUPABASE_URL = 'https://qetuedlddueqhdcahejj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldHVlZGxkZHVlcWhkY2FoZWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDM4MTAsImV4cCI6MjEwNTU3OTgxMH0.6__rEwkA89wYHkZilrpwnZIIagwlArlkMKR2FNFk5fk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log('Conectado ao Supabase!\n');

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
        let tabela = '';
        let dadosParaInserir = {};

        if (user.tipo === 'admin') {
            tabela = 'admins';
            dadosParaInserir = { nome: user.nome, email: user.email, senha: user.senha };
        } else if (user.tipo === 'professor') {
            tabela = 'professores';
            dadosParaInserir = { nome: user.nome, email: user.email, senha: user.senha, departamento: user.departamento };
        } else if (user.tipo === 'aluno') {
            tabela = 'alunos';
            dadosParaInserir = { nome: user.nome, email: user.email, senha: user.senha, matricula: user.matricula };
        }

        const { data, error } = await supabase.from(tabela).insert([dadosParaInserir]);

        if (error) {
            if (error.code === '23505') {
                console.log(`✗ [${user.tipo}] ${user.nome} - email já cadastrado`);
            } else {
                console.log(`✗ [${user.tipo}] ${user.nome} - erro: ${error.message}`);
            }
            erros++;
        } else {
            console.log(`✓ [${user.tipo}] ${user.nome} - cadastrado com sucesso`);
            cadastrados++;
        }
    }

    console.log(`\n--- Resumo ---`);
    console.log(`Cadastrados: ${cadastrados}`);
    console.log(`Erros/Duplicados: ${erros}`);
}

main();