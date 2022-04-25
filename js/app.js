const cards = document.getElementById("cards");
const search = document.getElementById("buttons");
const items = document.getElementById("items");
const contadorCarritohtml = document.getElementById("contadorCarrito");
const templateCards = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
const formulario = document.querySelector('#search-input')
const searchBtn = document.querySelector('#searchBtn')


let dataGral = ''
let carrito = {};
let resultadoSearch = {};
let dataFilter = ''

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    compruebaCarrito();
   

})

cards.addEventListener('click', e => {
    addCarrito(e)
})



search.addEventListener('click', e => {

    filtraProductos(e.target.outerText)
})



const fetchData = async () => {
    try {
        const res = await fetch('./js/api.json');
        const data = await res.json();
        pintarCards(data);
        dataGral = data
        localStorage.setItem("General", JSON.stringify(dataGral));
    } catch (error) {
        console.log(error);
    }
}


const pintarCards = data => {
    console.log(data)
    document.getElementById('cards').innerHTML = ''
    data.forEach(producto => {
        templateCards.querySelector('h4').textContent = producto.title
        templateCards.querySelector(".categoriaLink").setAttribute("href", producto.thumbnailUrl)
        templateCards.querySelector('h5').textContent = producto.Categoria
        templateCards.querySelector('h3').textContent = producto.precio
        templateCards.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCards.querySelector('span').textContent =`Reviews (${producto.reviews})`
        templateCards.querySelector('ul').innerHTML = calculaStar(producto.star)
        templateCards.querySelector('.btn-primary').dataset.id = producto.id
        const clone = templateCards.cloneNode(true)
        fragment.appendChild(clone)

    })

    cards.appendChild(fragment)
    

}

const addCarrito = e => {

    if(e.target.classList.contains("btn-primary")){ 
        setCarrito(e.target.parentElement) 
        }else if(e.target.classList.contains("detailProduct")){
            setProducto(e.target.parentElement.parentElement)
        }else{
        e.stopPropagation()}
}

const setProducto = objeto =>{

    localStorage.removeItem('producto');

    const productos = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        title: objeto.querySelector('h4').textContent,
        precio: objeto.querySelector('p').textContent,
        thumbnailUrl: objeto.querySelector('img').src,
        Categoria: objeto.querySelector('h5').textContent,
        cantidad: parseInt(objeto.querySelector('input').value)
    }
    localStorage.setItem("producto", JSON.stringify(productos));
}


const setCarrito = objeto => {
    
    let carritolocalStorage = JSON.parse(localStorage.getItem("carrito"))
    if (carritolocalStorage) {
        carrito = carritolocalStorage;
    }
    const producto = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        title: objeto.querySelector('h4').textContent,
        precio: objeto.querySelector('.precioProducto').textContent,
        thumbnailUrl: objeto.querySelector('img').src,
        Categoria: objeto.querySelector('h5').textContent,
        cantidad: parseInt(objeto.querySelector('input').value)
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
        producto.cantidad = carrito[producto.id].cantidad + parseInt(objeto.querySelector('input').value);

    }
    carrito[producto.id] = {
        ...producto
    }

    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    compruebaCarrito()

}


function sumaObjetoCarrito(carrito) {
    let contadorCarrito = 0;

    for (let contador in carrito) {
        contadorCarrito++
    }
    contadorCarritohtml.innerHTML = contadorCarrito

}

function compruebaCarrito() {
    let cuentaCarrito = JSON.parse(localStorage.getItem("carrito"));
    if (cuentaCarrito) {
        sumaObjetoCarrito(cuentaCarrito)
    }
}

function calculaStar(stars){
    let totalStar = '<ul class="stars">';
    let contadorStar = Math.round(stars)
    
    for (let i = 0 ; i < contadorStar; i++){
        totalStar += '<li><i class="fa fa-star"></i></li>'; 
    }
    totalStar += '</ul>';
    return totalStar
}


function filtraProductos ( Categoria) {
    
    document.getElementById('cards').innerHTML = ''
    Categoria == 'All'  ? dataFilter = dataGral : dataFilter= dataGral.filter(producto => producto.Categoria == Categoria )
    pintarCards(dataFilter);

}

const filtrarInput = () => {

    const texto = formulario.value.toLowerCase()
    document.getElementById('cards').innerHTML = ''
    
    dataSeach = dataGral.filter(producto => producto.title.toLowerCase() == texto )
    pintarCards(dataSeach);
    
}



searchBtn.addEventListener('click', filtrarInput)
