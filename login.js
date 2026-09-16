const API_URL = 'http://localhost:3000';

function logar() {
    var email = document.getElementById("login").value;
    var senha = document.getElementById("senha").value;
    var msg = document.getElementById("mensagem");

    fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem("autenticado", "true");
            sessionStorage.setItem("usuario", JSON.stringify(data.user));
            window.location.href = "index.html";
        } else {
            msg.style.display = "block";
            msg.textContent = data.message || "E-mail ou senha invalidos!";
            document.getElementById("senha").value = "";
            document.getElementById("senha").focus();
        }
    })
    .catch(err => {
        msg.style.display = "block";
        msg.textContent = "Erro ao conectar com o servidor!";
        console.error('Erro:', err);
    });
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
