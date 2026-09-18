const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos estaticos do portfolio
app.use(express.static(path.join(__dirname)));

// Tenta conectar ao MySQL (opcional - sem ele o site funciona normalmente)
let db = null;
let dbConnected = false;

try {
    const mysql = require('mysql2');
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '12345',
        database: process.env.DB_NAME || 'portfolio'
    });

    db.connect((err) => {
        if (err) {
            console.log('Banco de dados indisponivel. Modo estatico ativo.');
            console.log('Para usar login/cadastro, inicie o MySQL.');
            dbConnected = false;
        } else {
            console.log('Conectado ao MySQL - Banco: portfolio');
            dbConnected = true;
        }
    });
} catch (e) {
    console.log('Modo estatico ativo (sem banco de dados).');
}

// Rota de login
app.post('/api/login', (req, res) => {
    if (!dbConnected || !db) {
        return res.status(503).json({ success: false, message: 'Banco de dados indisponivel' });
    }

    const { email, senha } = req.body;

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

// Rota para cadastrar usuario
app.post('/api/cadastrar', (req, res) => {
    if (!dbConnected || !db) {
        return res.status(503).json({ success: false, message: 'Banco de dados indisponivel' });
    }

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

// Status do servidor
app.get('/api/status', (req, res) => {
    res.json({
        servidor: 'online',
        banco: dbConnected ? 'conectado' : 'desconectado',
        modo: dbConnected ? 'completo' : 'estatico'
    });
});

// Fallback para rotas inexistentes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('=================================');
    console.log('  PORTFOLIO EMANUEL FEITOSA');
    console.log('=================================');
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log(`Portofolio: http://localhost:${PORT}/index.html`);
    console.log(`Status: http://localhost:${PORT}/api/status`);
    console.log('=================================');
});
