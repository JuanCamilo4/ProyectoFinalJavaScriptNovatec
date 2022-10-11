//EVENTOS
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    login();
});

//VARIABLES
let usuario = {}; 

//FUNCIONES
const loadUser = () => {
    fetch("http://localhost:3000/clientes")
        .then(response => response.json())
        .then(data => {
            usuarios = data;
        });
}
const login = () => {
    let documento = document.getElementById('document').value;
    let password = document.getElementById('password').value;
    let params = `?documento=${documento}&contrasena=${password}`;
    fetch("http://localhost:3000/clientes"+params)
        .then(response => response.json())
        .then(data => {
            usuario = data;
            console.log(usuario);
            if (usuario[0].rol == 'banco') {
                localStorage.setItem('user', `${documento};banco`);
                window.location.href = './src/pages/banco.html';
            }
            else {
                console.log(usuario.rol);
                localStorage.setItem('user', `${documento};cliente`);
                window.location.href = './src/pages/cliente.html';
            }
        })
        .catch(err => {
            const msg = document.getElementById('msg-error');
            msg.classList.remove('d-none');
            msg.classList.add('d-block');
            msg.innerHTML = 'Documento y/o contraseña incorrectos';
        })
}
//loadUser();