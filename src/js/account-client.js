//VARIABLES
let usuarios = []; 

//FUNCIONES
const getUser = () => {
    return localStorage.getItem('user');
}
const loadUser = () => {
    let user = getUser().split(';');
    let params = `?documento=${user[0]}`;
    fetch("http://localhost:3000/cuentas"+params)
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
const pintarTabla = (user, table) => {
    let row = document.createElement('tr');
    for (const key in user) {
        let column = document.createElement('td');
        column.innerHTML = user[key];
        row.appendChild(column);
    }
    table.appendChild(row);
}

loadUser();