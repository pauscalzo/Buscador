// creo variables y arrays necesarios

let wishlistSeleccionadas = [];
let paqueteElegidos = [];

const destinos = ["Europa", "Caribe", "NorteAmerica", "Brasil"];

const paquetes = ["Italia", "Francia", "Inglaterra", "Republica Dominicana", "Mexico", "Panama", "Orlando", "California", "Miami", "Sur de Brasil", "Centro de Brasil", "Norte de Brasil"];

const selectDestinos = document.getElementById("destinos");
const selectPaquetes = document.getElementById("paquetes");
const adultos = document.getElementById("adultos");
const ninos = document.getElementById("ninos");


// Declaro función mostrarOpcion para que se pinten en el DOM las opciones de destinos o paquetes con js.

function mostrarOpcion (array, posicion) {
    let item ="<option selected disabled>--Seleccione--</option>"
    for (let i = 0; i < array.length; i++){
        item += `<option value="${array[i]}">${array[i]}</option>`
    } 
    return posicion.innerHTML = item;
};

// Ejecuto la función mostrarOpcion para destinos (declarada en línea 16)

mostrarOpcion (destinos, selectDestinos);

// Ejecuto la función mostrarOpcion para paquetes (declarada en la línea 16). Creo un switch para desplegar los paquetes que corresponden a cada destino. Asimismo creo la función recortar para optimizar el código del switch.

const recortar = (array, inicio, fin, posicion) => {
    let recortarArray = array.slice(inicio, fin);
    mostrarOpcion (recortarArray, posicion);
};

selectDestinos.addEventListener ('change', function(){
    let valor = selectDestinos.value;
        switch (valor) {
            case "Europa":
                recortar(paquetes, 0, 3, selectPaquetes);
                break;
            case "Caribe":
                recortar(paquetes, 3, 6, selectPaquetes);
                break;
            case "NorteAmerica":
                recortar(paquetes, 6, 9, selectPaquetes);
                break;
            case "Brasil":
                recortar(paquetes, 9, 12, selectPaquetes);
                break;
            }
});

// Al escuchar el evento submit sobre el boton cotizar se ejecuta la funcion tomarValores (declarada en la línea 66).

const formulario = document.getElementById("myForm");
const cotizar = document.getElementById("cotizar");
const wishlist = document.getElementById("wishlist");

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    tomarValores();
});

// Declaro la funcion tomarValores. 

const divResultados = document.getElementById("columnas");

const tomarValores = () => {
    
    paqueteElegidos = precioPaquetes.filter (paquete => paquete.destino == selectPaquetes.value); // Filtro las opciones disponibles para el paquete seleccionado.

    calcularPrecio(paqueteElegidos, adultos, ninos) // ejecuto la función calcularPrecio (declarada en la línea 128)

    // pinto en el DOM los resultados:
    paqueteElegidos.forEach (paquete => {
        const div = document.createElement('div');
        div.classList.add('item-blog');
        div.classList.add('p-t-20');
        div.classList.add('p-b-20');
        div.classList.add('align-c');
        div.innerHTML +=
        `<img src=${paquete.img} alt="${paquete.nombre}">
        <p class="p-t-10">Nombre del Paquete: ${paquete.nombre}</p>
        <ul>
            <li># Adultos: ${paquete.cantidadAdultos}. # Niños: ${paquete.cantidadNinos}</li>
            <li>Salida: ${paquete.salida}. Regreso: ${paquete.regreso}</li>
            
        </ul>

        <p><strong>Precio</strong>: ${paquete.precio} USD</p>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Ver cotización dolar HOY
        </button>
        </br>
        
        <button class="wishlistActive" value="${paquete.id}"><i class="fa fa-heart-o fa-xl"></i> wishlist</button>
        
        </div>`

        divResultados.appendChild(div);
    });

};

// Llamo por fetch la cotización del dolar (dolar api) actualizada para que pueda observarse al clickear el botón ver cotización del dolar HOY (creado con modal - librería bootstrap).

const modalDolar = document.querySelector('.modal-body');

fetch("https://dolarapi.com/v1/dolares")
  .then(response => response.json())
  .then(data => {
    data.forEach (post => {
        const div = document.createElement ("div")
        div.innerHTML = `
            <strong>Dolar: ${post.nombre}</strong>
            <p>Compra: ${post.compra} - Venta: ${post.venta}</p>      
        `
        modalDolar.appendChild(div);
    })  
    
  });
    

// Declaro funcion para calcular el precio de las opciones

const calcularPrecio = (paqueteElegidos, adultos, ninos) => {
    paqueteElegidos.forEach (paquete => (
        paquete.cantidadAdultos = Number(adultos.value), 
        paquete.cantidadNinos = Number(ninos.value),
        paquete.precio = (paquete.precio * Number(adultos.value)) + (paquete.precio * Number(ninos.value)/2)
        )
    )   
};

// Al escuchar el click en el botón wishlist se ejecuta la función guardarWishlist (declarada en la línea 151) y se avisa al usuario mediante notificación creada con la librería toastify. 

divResultados.addEventListener('click', (e) => {
    if (e.target.classList.contains('wishlistActive')) { 
        guardarWishlist(e.target.value);   
        Toastify ({
            text: "Guardando en Wishlist...",
            duration: 3000
            }).showToast();
    }
});

// Declaro la función guardarWishlist que determina cual es el paquete elegido de acuerdo al id del mismo. Este id se encuentra como valor que se desprende luego del evento click sobre el boton wishlist. Esta función sube el paquete seleccionado al array wishlistSeleccionadas, actualiza el modal y el contador del ícono de corazon de wishlist (arriba a la derecha).

const guardarWishlist = (wishlistId) => {
    const wishlistGuardada = paqueteElegidos.find(paquete => paquete.id == wishlistId); 
    wishlistSeleccionadas.push(wishlistGuardada); 
    agregarWishlist (wishlistSeleccionadas);
    actualizarWishlist (wishlistSeleccionadas);

};

// Declaro las funciones para actualizar el contador del wishlist.

const actualizarWishlist = (wishlistSeleccionadas) => {
    const totalCantidad = wishlistSeleccionadas.reduce((acc, item) => acc + item.cantidad, 0);
    pintarWishlist (totalCantidad);  
};

const pintarWishlist = (totalCantidad) => {
    const contadorWishlist = document.getElementById('contador');
    contadorWishlist.innerText = totalCantidad;
};

// Declaro la función para actualizar el modal de wishlist.

const contenedor = document.getElementById('cotizacionesContenedor');

const agregarWishlist = (wishlistSeleccionadas) => {
    contenedor.innerHTML = '';

    wishlistSeleccionadas.forEach(paqueteElegidos => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>- Paquete: ${paqueteElegidos.nombre}. Precio: USD ${paqueteElegidos.precio}. n° Adultos: ${paqueteElegidos.cantidadAdultos} n° Niños: ${paqueteElegidos.cantidadNinos}  <button class="botonEliminar" value="${paqueteElegidos.id}"> x </button></p>
            
        `
        contenedor.appendChild(div);
    });
    guardarWishlistStorage(wishlistSeleccionadas);
};

// Declaro funciones para que se pueda eliminar una cotización del modal del wishlist al clickear la cruz.

contenedor.addEventListener('click', (e) => {
    e.target.classList.contains('botonEliminar') && eliminarCotizacionRealizada(e.target.value);   
});

const eliminarCotizacionRealizada = (cotizacionId) => {
    const cotizacionEliminar = wishlistSeleccionadas.findIndex(paqueteElegido => paqueteElegido.id == cotizacionId);
    wishlistSeleccionadas.splice(cotizacionEliminar, 1);
    agregarWishlist (wishlistSeleccionadas);
    actualizarWishlist (wishlistSeleccionadas);
};


// Declaro las funciones para guardar y luego recuperar las cotizaciones realizadas en localStorage.

const guardarWishlistStorage = (wishlistSeleccionadas) => {
    localStorage.setItem('wishlistGuardadas', JSON.stringify(wishlistSeleccionadas));
};

const obtenerWishlistStorage = () => {
    return JSON.parse(localStorage.getItem('wishlistGuardadas'));
};

const cargarWishlist = () => {
    if (localStorage.getItem('wishlistGuardadas')) {
        wishlistSeleccionadas = obtenerWishlistStorage();
        agregarWishlist (wishlistSeleccionadas);
        actualizarWishlist (wishlistSeleccionadas);
    }
};

cargarWishlist();
