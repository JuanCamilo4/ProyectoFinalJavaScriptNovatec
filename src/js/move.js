//EVENTOS
const form = document.forms['form-registerUser'];

form.addEventListener('submit', (e) => {retirar(e)});

//VARIABLES
let usuarios = []; 
let movimientos = []; 

//FUNCIONES
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
const loadUser = () => {
    let user = getUser().split(';');
    fetch("http://localhost:3000/cuentas")
    .then(response => response.json())
    .then(data => {
        let aux = [];
        usuarios = data;
        usuarios.forEach((e, i) => {
            if (e.documento == user[0]) {
                aux.push(e);
            }
        });
        usuarios = aux;
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
const retirar = (event) => {
    event.preventDefault();
    let user = getUser().split(';');
    const numero = document.getElementById('number').value;
    const quantity = document.getElementById('quantity').value;
    const msg = document.getElementById('msg-error');
    usuarios.forEach(e => {
        if (e.numero == numero && quantity > 0) {
            let cantidad = e.saldo - quantity;
            if (cantidad >= 5) {
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
                            type: 'retiro',
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
            } else {
                msg.classList.remove('d-none');
                msg.classList.add('d-block');
                msg.innerHTML = 'La cuenta debe quedar con un minimo de $5';
            }
        } else {
            msg.classList.remove('d-none');
            msg.classList.add('d-block');
            msg.innerHTML = 'Esta cuenta no existe o ingreso un número negativo';
        }
    });
}
const mostrarRetiros = (tipo) => {
    let user = getUser().split(';');
    let params = `?documento=${user[0]}`;
    fetch("http://localhost:3000/movimientos"+params)
    .then(response => response.json())
    .then(data => {
        let body;
        data.forEach(e => {
            let obj = {
                numero: e.numero,
                cantidad: e.cantidad,
                fecha: e.fecha
            };
            if (e.type == 'retiro') body = document.getElementById('table-retiro');
            else body = document.getElementById('table-ingreso');
            pintarTabla(obj, body);
        });
        
    });
}
mostrarRetiros('retiro');
loadUser();