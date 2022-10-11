//EVENTOS
const form = document.forms['form-registerUser'];

form.addEventListener('submit', (e) => {registerUser(e)});

//VARIABLES
let usuarios = []; 

//FUNCIONES
const pintarTabla = (user, table) => {
    let row = document.createElement('tr');
    for (const key in user) {
        let column = document.createElement('td');
        column.innerHTML = user[key];
        row.appendChild(column);
    }
    table.appendChild(row);
}
const registerUser = (event) => {
    event.preventDefault();
    let registrar = true;
    const msg = document.getElementById('msg-error');
    usuarios.forEach(e => {
        if (e.documento == form[0].value) {
            msg.classList.remove('d-none');
            msg.classList.add('d-block');
            msg.innerHTML = 'Un usuario ya está registrado con este documento';
            registrar = false;
        }
    });
    if (registrar) {
        let user = {
            "id": usuarios.length+1,
            "documento": form[0].value,
            "contrasena": form[1].value,
            "nombre": form[2].value,
            "telefono": form[3].value,
            "direccion": form[4].value,
            "rol": form[5].value
        }
        fetch('http://localhost:3000/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
            })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });    
    }
    
}
const loadUser = () => {
    fetch("http://localhost:3000/clientes")
        .then(response => response.json())
        .then(data => {
            usuarios = data;
            usuarios.forEach((e, i) => {
                let user = {
                    "documento": e.documento,
                    "contrasena": e.contrasena,
                    "nombre": e.nombre,
                    "telefono": e.telefono,
                    "direccion": e.direccion,
                    "rol": e.rol
                }
                let body;
                if (e.rol == 'banco') body = document.getElementById('table-banco');
                else body = document.getElementById('table-cliente');
                pintarTabla(user, body);
            });
        });
}

loadUser();