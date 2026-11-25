let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const panel = new bootstrap.Offcanvas(document.getElementById('ventana-carrito'));
const aviso = new bootstrap.Modal(document.getElementById('ventana-aviso'));

const contador = document.createElement('span');
contador.className = 'contador-carrito';
document.getElementById('abrir-carrito').appendChild(contador);

function guardar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrar();
}

function mostrar() {
    let lista = '';
    let total = 0;
    let unidades = 0;

    for (let i = 0; i < carrito.length; i++) {
        const item = carrito[i];
        total = total + item.precio * item.cantidad;
        unidades = unidades + item.cantidad;
        lista = lista + '<p>' + item.nombre + ' (' + item.talla + ') x ' + item.cantidad + ' = ' + item.precio * item.cantidad + ' €</p>';
    }

    if (carrito.length === 0) {
        lista = '<p>Tu carrito está vacío.</p>';
    }

    document.getElementById('lista-carrito').innerHTML = lista;
    document.getElementById('total-carrito').textContent = total + ' €';

    if (unidades > 0) {
        contador.textContent = unidades;
    } else {
        contador.textContent = '';
    }

    const resumen = document.getElementById('resumen-pago');
    if (resumen) {
        resumen.innerHTML = lista;
        document.getElementById('total-pago').textContent = total + ' €';
        document.getElementById('confirmar-pago').disabled = carrito.length === 0;
    }
}

function anadirProducto(boton) {
    const talla = document.querySelector('input[name="talla"]:checked').value;
    const id = boton.getAttribute('data-id');
    let posicion = -1;

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id && carrito[i].talla === talla) {
            posicion = i;
        }
    }

    if (posicion === -1) {
        carrito.push({
            id: id,
            nombre: boton.getAttribute('data-nombre'),
            precio: Number(boton.getAttribute('data-precio')),
            talla: talla,
            cantidad: 1
        });
    } else {
        carrito[posicion].cantidad = carrito[posicion].cantidad + 1;
    }

    guardar();
    panel.show();
}

document.querySelectorAll('[data-anadir]').forEach(function (boton) {
    boton.addEventListener('click', function () {
        anadirProducto(boton);
    });
});

document.getElementById('abrir-carrito').addEventListener('click', function () {
    panel.show();
});

document.getElementById('vaciar-carrito').addEventListener('click', function () {
    carrito = [];
    guardar();
});

document.querySelectorAll('form[data-aviso]').forEach(function (formulario) {
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        if (formulario.hasAttribute('data-vaciar')) {
            carrito = [];
            guardar();
        }

        document.getElementById('aviso-titulo').textContent = formulario.getAttribute('data-titulo');
        document.getElementById('aviso-texto').textContent = formulario.getAttribute('data-aviso');
        aviso.show();
    });
});

mostrar();
