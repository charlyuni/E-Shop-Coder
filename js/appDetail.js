const cards = document.getElementById("cards");
const templateDetail = document.getElementById("templateDetail").content;
const fragment = document.createDocumentFragment();
let producto = JSON.parse(localStorage.getItem("producto"));
let totalProductos  = JSON.parse(localStorage.getItem("General"));
const contadorCarritohtml = document.getElementById("contadorCarrito");
let cantidadPedida = 1;
let carrito = {};


document.addEventListener('DOMContentLoaded', () => {
    
    if (localStorage.getItem('producto')) {
        productoDetail = JSON.parse(localStorage.getItem('producto'))
        pintarProducto(filtrarProducto(totalProductos,productoDetail.id))
        compruebaCarrito()
    }
})




cards.addEventListener('click', e => {

    btnAction(e)
})




const pintarProducto = productoDetail => {
    templateDetail.querySelector('.img-principal').setAttribute("src", productoDetail.thumbnailUrl)
    templateDetail.querySelector('h3').innerHTML = productoDetail.title;
    templateDetail.querySelector('.rating').innerHTML = calculaStar(productoDetail.star)
    templateDetail.querySelector('.reviews').innerHTML = `${productoDetail.reviews} reviews`;
    templateDetail.querySelector('.product-description').innerHTML = productoDetail.description;
    templateDetail.querySelector('.price').innerHTML = productoDetail.precio;

    const clone = templateDetail.cloneNode(true);
    fragment.appendChild(clone)
    cards.appendChild(fragment)

}


const btnAction = e => {
    if (e.target.classList.contains('btn-info')) {
        document.getElementById("cantidadProductos").textContent = parseInt(document.getElementById("cantidadProductos").textContent )+ 1;
    }

    if (e.target.classList.contains('btn-danger')) {
        cantidadPedida == 1 ? cantidadPedida = 1 :cantidadPedida =  parseInt(document.getElementById("cantidadProductos").textContent ) - 1 ;
        document.getElementById("cantidadProductos").textContent = cantidadPedida;
    }


    if (e.target.classList.contains('btn-primary')) { 

        setCarrito(filtrarProducto(totalProductos,productoDetail.id));
        }else{
        e.stopPropagation();
    }
    
}




function calculaStar(stars){
    let totalStar = '<div class="stars">';
    let contadorStar = Math.round(stars)
    
    for (let i = 0 ; i < contadorStar; i++){
        totalStar += '<span class="fa fa-star checked"></span>'; 
    }
    totalStar += '</div>';
    return totalStar
}



function compruebaCarrito() {
    let cuentaCarrito = JSON.parse(localStorage.getItem("carrito"));
    cuentaCarrito && sumaObjetoCarrito(cuentaCarrito);
}


function sumaObjetoCarrito(carrito) {
    let contadorCarrito = 0;
    for (let contador in carrito) {
        contadorCarrito++;
    }
    contadorCarritohtml.innerHTML = contadorCarrito;
}

function filtrarProducto (totalProductos, id){
    return totalProductos.find(producto => producto.id == id)
}


const setCarrito = objeto => {
    
    let carritolocalStorage = JSON.parse(localStorage.getItem("carrito"))
    if (carritolocalStorage) {
        carrito = carritolocalStorage;
    
    }
    
   cantidadPedida = document.getElementById("cantidadProductos").textContent;
   cantidadPedida = parseInt(cantidadPedida)

    const producto = {
        id: objeto.id,
        title: objeto.title,
        precio: objeto.precio,
        thumbnailUrl: objeto.thumbnailUrl,
        Categoria: objeto.Categoria,
        cantidad: cantidadPedida
    }
    
    Swal.fire({
        title: 'Felicitaciones',
        text: `Se agrego al carrito ${producto.title}.`,
        imageUrl: producto.thumbnailUrl,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
    })


    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + parseInt(document.getElementById("cantidadProductos").textContent);
        
    }
    

    carrito[producto.id] = {
        ...producto

    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    compruebaCarrito()

}
