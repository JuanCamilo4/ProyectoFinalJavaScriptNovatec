//EVENTOS
document.getElementById('btn-account-clienteSection').addEventListener('click', () => {changeSection('account-cliente')});
document.getElementById('btn-moveSection').addEventListener('click', () => {changeSection('move')});
document.getElementById('btn-logout').addEventListener('click', () => {logout()});

//FUNCIONES
const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '../../index.html';
}
const changeSection = (section) =>{
    const iframe = document.getElementById('iFrame');
    iframe.src = `./${section}.html`;
    const options = ['account-cliente', 'move'];
    options.forEach(e => {
        if (e == section) document.getElementById(`btn-${e}Section`).classList.add('li-active');     
        else document.getElementById(`btn-${e}Section`).classList.remove('li-active');
    });
}

changeSection('account-cliente');