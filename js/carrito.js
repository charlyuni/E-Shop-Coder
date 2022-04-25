const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCarrito = document.getElementById("template-carrito").content;
const contadorCarritohtml = document.getElementById("contadorCarrito");
const templateFooter = document.getElementById("template-footer").content;
const fragment = document.createDocumentFragment();
let carrito = JSON.parse(localStorage.getItem("carrito"));



document.addEventListener('DOMContentLoaded', () => {
    
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
        compruebaCarrito()
    }
})



items.addEventListener('click', e => {
    btnAction(e)
})


const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - llego la hora de comprar!</th>'
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {
        cantidad
    }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {
        cantidad,
        precio
    }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {

        Swal.fire({
            title: 'Está seguro de eliminar todo el carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, seguro',
            cancelButtonText: 'No, no quiero'
        }).then((result) => {
    
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Borrado!',
                    icon: 'success',
                    text: 'El archivo ha sido borrado'
                })
                carrito = {};
                pintarCarrito();
                compruebaCarrito();
            }
        })
    })
}

const btnAction = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++;
        carrito[e.target.dataset.id] = {
            ...producto
        }
        pintarCarrito()
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }

    if (e.target.classList.contains('btn-danger')) {

        Swal.fire({
            title: 'Está seguro de eliminar el producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, seguro',
            cancelButtonText: 'No, no quiero'
        }).then((result) => {
    
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Borrado!',
                    icon: 'success',
                    text: 'El archivo ha sido borrado'
                })

                const producto = carrito[e.target.dataset.id];
                producto.cantidad--;
                producto.cantidad === 0 && delete carrito[e.target.dataset.id];
                pintarCarrito()
                localStorage.setItem('carrito', JSON.stringify(carrito));
            }
        })
    }
    compruebaCarrito();
    e.stopPropagation();
}

function sumaObjetoCarrito(carrito) {
    let contadorCarrito = 0;

    for (let contador in carrito) {
        contadorCarrito++;
    }
    console.log(contadorCarrito);
    contadorCarritohtml.innerHTML = contadorCarrito;
}

function sumaObjetoCarrito(carrito) {
    let contadorCarrito = 0;

    for (let contador in carrito) {
        contadorCarrito++;
    }
    contadorCarritohtml.innerHTML = contadorCarrito;

}

function compruebaCarrito() {
    let cuentaCarrito = JSON.parse(localStorage.getItem("carrito"));
    cuentaCarrito && sumaObjetoCarrito(cuentaCarrito);
}