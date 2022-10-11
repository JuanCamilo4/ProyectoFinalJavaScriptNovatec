//EVENTOS
const input = document.getElementById('input-documento');
const button = document.getElementById('btn-search');

input.addEventListener('keyup', ()=> {
    documentUser = input.value;
});
button.addEventListener('click', ()=> {
    searchState();
})

//VARIABLES
let usuarios = []; 
let cuentas = [];
let state = [];
let documentUser = '';

//FUNCIONES
const pintarTabla = (user, table) => {
    let row = document.createElement('tr');
    for (const key in user) {
        let column = document.createElement('td');
        if (key != 'cuentas') {
            column.innerHTML = user[key];
        } else {
            user[key].forEach(e => {
                let value = document.createElement('p');
                value.classList.add('mb-1');
                value.innerHTML = `Número: ${e.numero} - <span class="badge bg-secondary">Saldo: $${e.saldo}</span>`;
                column.appendChild(value);
            });
        }
        row.appendChild(column);
    }
    table.appendChild(row);
}
const loadData = () => {
    fetch("http://localhost:3000/cuentas")
        .then(response => response.json())
        .then(data => {
            cuentas = data;
            fetch("http://localhost:3000/clientes")
                .then(response => response.json())
                .then(data => {
                    usuarios = data;
                    state = parseState(cuentas, usuarios);
                    console.log(state);
                    let body = document.getElementById('table-banco');
                    state.forEach(e => {
                        pintarTabla(e, body);
                    })
                });
        });
}
const parseState = (cuentas, usuarios) => {
    let state = [];
    usuarios.forEach(e => {
        let obj = {documento: e.documento, nombre: e.nombre, cuentas: []};
        cuentas.forEach(k => {
            if (e.documento == k.documento) {
                obj.cuentas.push(k);
            }
        });
        state.push(obj);
    });
    return state;
}
const searchState = () => {
    if (documentUser == '') {
        let body = document.getElementById('table-banco');
        let limit = body.childNodes.length;
        for (let i = 0; i < limit; i++) { body.childNodes[0].remove(); }
        state.forEach(e => pintarTabla(e, body));
    } else {
        let aux = [];
        state.forEach(e => {
            if (e.documento.includes(documentUser)) aux.push(e);
        });
        let body = document.getElementById('table-banco');
        let limit = body.childNodes.length;
        for (let i = 0; i < limit; i++) { body.childNodes[0].remove(); }
        aux.forEach(e => pintarTabla(e, body));
    }
}
loadData();