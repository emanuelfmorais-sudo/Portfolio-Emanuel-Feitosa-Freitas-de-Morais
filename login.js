// Configuração do Supabase com suas credenciais
const SUPABASE_URL = 'https://qetuedlddueqhdcahejj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldHVlZGxkZHVlcWhkY2FoZWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDM4MTAsImV4cCI6MjEwNTU3OTgxMH0.6__rEwkA89wYHkZilrpwnZIIagwlArlkMKR2FNFk5fk';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function logar() {
    var email = document.getElementById("login").value;
    var senha = document.getElementById("senha").value;
    var msg = document.getElementById("mensagem");

    msg.style.display = "none";

    try {
        let usuarioEncontrado = null;
        let tipoUsuario = '';

        const tabelas = ['admins', 'professores', 'alunos'];

        for (const tabela of tabelas) {
            const { data, error } = await _supabase
                .from(tabela)
                .select('*')
                .eq('email', email)
                .eq('senha', senha)
                .maybeSingle();

            if (data) {
                usuarioEncontrado = data;
                tipoUsuario = tabela;
                break;
            }
        }

        if (usuarioEncontrado) {
            sessionStorage.setItem("autenticado", "true");
            sessionStorage.setItem("usuario", JSON.stringify({ ...usuarioEncontrado, tipo: tipoUsuario }));
            window.location.href = "index.html";
        } else {
            msg.style.display = "block";
            msg.textContent = "E-mail ou senha inválidos!";
            document.getElementById("senha").value = "";
            document.getElementById("senha").focus();
        }

    } catch (err) {
        msg.style.display = "block";
        msg.textContent = "Erro ao conectar com o banco de dados!";
        console.error('Erro:', err);
    }
}

function cancelar() {
    document.getElementById("login").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("mensagem").style.display = "none";
}

function toggleSenha() {
    var input = document.getElementById("senha");
    var eyeOpen = document.querySelector(".eye-open");
    var eyeClosed = document.querySelector(".eye-closed");

    if (input.type === "password") {
        input.type = "text";
        eyeOpen.style.display = "none";
        eyeClosed.style.display = "block";
    } else {
        input.type = "password";
        eyeOpen.style.display = "block";
        eyeClosed.style.display = "none";
    }
}

function logout() {
    sessionStorage.removeItem("autenticado");
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html";
}

function verificarAcesso() {
    if (sessionStorage.getItem("autenticado") !== "true") {
        window.location.href = "login.html";
        return false;
    }
    return true;
}