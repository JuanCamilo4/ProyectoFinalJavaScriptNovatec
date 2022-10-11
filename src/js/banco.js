//EVENTOS
document.getElementById('btn-userSection').addEventListener('click', () => {changeSection('user')});
document.getElementById('btn-accountSection').addEventListener('click', () => {changeSection('account')});
document.getElementById('btn-stateSection').addEventListener('click', () => {changeSection('state')});
document.getElementById('btn-logout').addEventListener('click', () => {logout()});

//FUNCIONES
const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '../../index.html';
}
const changeSection = (section) =>{
    const iframe = document.getElementById('iFrame');
    iframe.src = `./${section}.html`;
    const options = ['user', 'account', 'state'];
    options.forEach(e => {
        if (e == section) document.getElementById(`btn-${e}Section`).classList.add('li-active');     
        else document.getElementById(`btn-${e}Section`).classList.remove('li-active');
    });
}

changeSection('user');