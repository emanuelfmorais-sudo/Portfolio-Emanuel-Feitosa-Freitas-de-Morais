const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos estaticos do portfolio
app.use(express.static(path.join(__dirname)));

// Conexao com o banco portfolio
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'portfolio'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao MySQL - Banco: portfolio');
});

// Rota de login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    // Buscar nos 3 tipos de usuario
    const sql = `
        SELECT id, nome, email, 'admin' AS tipo FROM admins WHERE email = ? AND senha = ?
        UNION
        SELECT id, nome, email, 'professor' AS tipo FROM professores WHERE email = ? AND senha = ?
        UNION
        SELECT id, nome, email, 'aluno' AS tipo FROM alunos WHERE email = ? AND senha = ?
    `;

    db.query(sql, [email, senha, email, senha, email, senha], (err, results) => {
        if (err) {
            console.error('Erro na query:', err);
            return res.status(500).json({ success: false, message: 'Erro interno no servidor' });
        }

        if (results.length > 0) {
            return res.json({
                success: true,
                user: {
                    id: results[0].id,
                    nome: results[0].nome,
                    email: results[0].email,
                    tipo: results[0].tipo
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'E-mail ou senha invalidos!'
            });
        }
    });
});

// Rota para cadastrar usuario (para testes)
app.post('/api/cadastrar', (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    let tabela;
    switch (tipo) {
        case 'admin': tabela = 'admins'; break;
        case 'professor': tabela = 'professores'; break;
        case 'aluno': tabela = 'alunos'; break;
        default:
            return res.status(400).json({ success: false, message: 'Tipo invalido' });
    }

    const sql = `INSERT INTO ${tabela} (nome, email, senha) VALUES (?, ?, ?)`;

    db.query(sql, [nome, email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'Email ja cadastrado!' });
            }
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar' });
        }
        return res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse o portfólio em http://localhost:${PORT}/index.html`);
});
