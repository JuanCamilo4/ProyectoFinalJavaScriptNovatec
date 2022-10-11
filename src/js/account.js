//EVENTOS
const form = document.forms['form-registerUser'];
const form2 = document.forms['form-registerMonto'];

form.addEventListener('submit', (e) => {registerUser(e)});
form2.addEventListener('submit', (e) => {registrarMonto(e)});

//VARIABLES
let usuarios = []; 
let movimientos = []; 
let user = [];

//FUNCIONES
const loadUser = () => {
    fetch("http://localhost:3000/cuentas")
        .then(response => response.json())
        .then(data => {
            usuarios = data;
            usuarios.forEach((e, i) => {
                let user = {
                    "documento": e.documento,
                    "numero": e.numero,
                    "saldo": e.saldo,
                }
                let body = document.getElementById('table-banco');
                pintarTabla(user, body);
            });
        });
}
const loadMove = () => {
    let user = getUser().split(';');
    fetch("http://localhost:3000/movimientos")
    .then(response => response.json())
    .then(data => {
        let aux = [];
        movimientos = data;
        movimientos.forEach((e, i) => {
            if (e.documento == user[0]) {
                aux.push(e);
            }
        });
        movimientos = aux;
    });
}
const getUsers = () => {
    fetch("http://localhost:3000/clientes")
        .then(response => response.json())
        .then(data => {
            user = data;
        });
}
const getUser = () => {
    return localStorage.getItem('user');
}
const pintarTabla = (user, table) => {
    let row = document.createElement('tr');
    for (const key in user) {
        let column = document.createElement('td');
        column.innerHTML = user[key];
        row.appendChild(column);
    }
    table.appendChild(row);
}
const hasNumbers = (texto) => {
    let numeros="0123456789";
    for(i=0; i<texto.length; i++){
        if (numeros.indexOf(texto.charAt(i),0)!=-1){
            return true;
        }
    }
    return false;
}
const hasLetters = (texto, letras) =>{
    for(i=0; i<texto.length; i++){
        if (letras.indexOf(texto.charAt(i),0)!=-1){
            return true;
        }
    }
   return false;
}
const registerUser = (event) => {
    event.preventDefault();
    let account = {
        id: usuarios.length+1,
        documento: form[0].value,
        numero: form[1].value,
        saldo: parseInt(form[2].value)
    }
    let letras="abcdefghyjklmnñopqrstuvwxyz";
    let existeUsuario = false;
    let numeroRepetido = false;
    const msg = document.getElementById('msg-error');

    user.forEach(e => {
        console.log(e);
        if (e.documento == account.documento) {
            console.log(e);
            existeUsuario = true;
        }
    });
    usuarios.forEach(e => {
        if (e.numero == account.numero) {
            numeroRepetido = true;
        }
    });

    if (!existeUsuario) {
        console.log('msg5');
        msg.classList.remove('d-none');
        msg.classList.add('d-block');
        msg.innerHTML = 'El usuario no encuenta registrado';
        return;
    }

    if (numeroRepetido) {
        console.log('msg6');
        msg.classList.remove('d-none');
        msg.classList.add('d-block');
        msg.innerHTML = 'Este número de cuenta ya está en uso';
        return;
    }

    if (account.numero.length != 10) {
        console.log('msg', account.numero.length);
        msg.classList.remove('d-none');
        msg.classList.add('d-block');
        msg.innerHTML = 'El número de la cuenta debe ser de 10 caracteres';
        return;
    }
    if (!hasNumbers(account.numero)) {
        console.log('msg2');
        msg.classList.remove('d-none');
        msg.classList.add('d-block');
        msg.innerHTML = 'El número de la cuenta debe tener al menos un número';
        return;
    }
    if (!hasLetters(account.numero, letras.toLocaleLowerCase()) && !hasLetters(account.numero, letras.toLocaleUpperCase())) {
        console.log('msg3');
        msg.classList.remove('d-none');
        msg.classList.add('d-block');
        msg.innerHTML = 'El número de la cuenta debe tener al menos una letra';
        return;
    }
    if (account.saldo < 100) {
        console.log('msg4');
        msg.classList.remove('d-none');
        msg.classList.add('d-block');
        msg.innerHTML = 'El saldo inicial debe ser mayor o igual a $100';
        return;
    }
    fetch('http://localhost:3000/cuentas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
        })
        .then((response) => response.json())
        .then((data) => {
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    /*let body = document.getElementById('table-banco');
    pintarTabla(account, body);
    msg.classList.add('d-none');
    msg.classList.remove('d-block');*/
}
const registrarMonto = (event) => {
    event.preventDefault();
    let user = getUser().split(';');
    const numero = document.getElementById('cuenta').value;
    const quantity = document.getElementById('quantity').value;
    usuarios.forEach(e => {
        if (e.numero == numero && quantity > 1) {
            let cantidad = parseInt(e.saldo) + parseInt(quantity);
            let account = {
                id: e.id,
                documento: e.documento,
                numero: e.numero,
                saldo: cantidad
            }
            fetch(`http://localhost:3000/cuentas/${e.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(account),
                })
                .then((response) => response.json())
                .then((data) => {
                    let move = {
                        id: movimientos.length,
                        documento: user[0],
                        numero: account.numero,
                        cantidad: parseInt(quantity),
                        type: 'ingreso',
                        fecha: `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`
                    }
                    fetch('http://localhost:3000/movimientos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(move),
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.reload();
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    //window.location.reload();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    });
}
loadUser();
getUsers();