class Productos {
  constructor(item) {
    this.id = item.id;
    this.marca = item.marca;
    this.precio = item.precio;
    this.cantidad = item.cantidad;
    this.precioTotal = item.precio;
  }

  agregarUnidad() {
    this.cantidad++;
  }

  quitarUnidad() {
    this.cantidad--;
  }

  actualizarPrecioTotal() {
    this.precioTotal = this.precio * this.cantidad;
  }
}

// ************** DECLARACIÓN DE FUNCIONES ************** //

function imprimirProductosEnHTML(array) {
  let contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  for (const item of array) {
    let card = document.createElement("div");
    card.innerHTML = `
        <div class="card text-center" style="width: 18rem;">
            <div class="card-img-top tarjetas">
                <img src="${item.img}" id="" class="card-img-top img-fluid pt-2" alt="">
                <h2 class="card-title">${item.marca}</h2>
                <h5 class="card-subtitle mb-2 text-muted">${item.descripcion}</h5>
                <p class="card-text fs-3 fw-bolder">$${item.precio}</p>

                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button id="agregar${item.marca}${item.id}" type="button" class="btn btn-primary mb-2 fs-3 "> Agregar </button>
                </div>
            </div>
        </div>      
        `;

    contenedor.appendChild(card);

    let boton = document.getElementById(`agregar${item.marca}${item.id}`);
    boton.addEventListener("click", () => agregarAlCarrito(item));
  }
}

function agregarAlCarrito(producto) {
  let index = carrito.findIndex((elemento) => elemento.id === producto.id);
  console.log({ index });

  if (index != -1) {
    carrito[index].agregarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    let item = new Productos(producto);
    item.cantidad = 1;
    carrito.push(item);
  }

  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
  let index = carrito.findIndex((element) => element.id === id);

  if (carrito[index].cantidad > 1) {
    carrito[index].quitarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    carrito.splice(index, 1);
  }

  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);
}

function eliminarCarrito() {
  carrito = [];
  localStorage.removeItem("carritoEnStorage");

  alert("su compra a sido eliminada con exito");

  document.getElementById("tabla-carrito").innerHTML = "";
  document.getElementById("acciones-carrito").innerHTML = "";
}

function obtenerPrecioTotal(array) {
  return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

function imprimirTabla(array) {
  let contenedor = document.getElementById("tabla-carrito");
  contenedor.innerHTML = "";

  let tabla = document.createElement("div");

  tabla.innerHTML = `
        <table id="tablaCarrito" class="table table-striped fs-4 m-5">
            <thead>         
                <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Accion</th>
                </tr>
            </thead>

            <tbody id="bodyTabla">

            </tbody>
        </table>
    `;

  contenedor.appendChild(tabla);

  let bodyTabla = document.getElementById("bodyTabla");

  for (let item of array) {
    let datos = document.createElement("tr");
    datos.innerHTML = `
                <td>${item.marca}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precioTotal}</td>
                <td><button id="eliminar${item.id}" class="btn btn-danger fs-3">Eliminar</button></td>
      `;

    bodyTabla.appendChild(datos);

    let botonEliminar = document.getElementById(`eliminar${item.id}`);
    botonEliminar.addEventListener("click", () => eliminarDelCarrito(item.id));
  }

  let precioTotal = obtenerPrecioTotal(array);
  let accionesCarrito = document.getElementById("acciones-carrito");
  accionesCarrito.innerHTML = `
		<h5 class="fs-1 fw-bold">PrecioTotal: $${precioTotal}</h5></br>
		<button id="vaciarCarrito" onclick="eliminarCarrito()" class="btn btn-warning fs-3 p-2 m-1 ">Vaciar Carrito</button>
	`;
}

function filtrarBusqueda(e) {
  e.preventDefault();

  let ingreso = document.getElementById("busqueda").value.toLowerCase();
  let arrayFiltrado = items.filter((elemento) =>
    elemento.marca.toLowerCase().includes(ingreso)
  );

  imprimirProductosEnHTML(arrayFiltrado);
}

function chequearCarritoEnStorage() {
  let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

  if (contenidoEnStorage) {
    let array = [];

    for (const objeto of contenidoEnStorage) {
      let item = new Productos(objeto);
      item.actualizarPrecioTotal();

      array.push(item);
    }

    imprimirTabla(array);

    return array;
  }

  return [];
}

// ************** EVENTO **************
let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

// ************** CONSTANTES Y VARIABLES **************
const items = [
  {
    id: 0,
    marca: "Bombilla",
    descripcion: "Bombilla de alpaca",
    precio: 8500,
    img: "./img/bombilla.jpg",
  },
  {
    id: 1,
    marca: "Mate",
    descripcion: "Mate  ",
    precio: 15000,
    img: "./img/mate.jpg",
  },
  {
    id: 2,
    marca: "Yerba",
    descripcion: "Yerba Canarias x 1Kg",
    precio: 2500,
    img: "./img/yerba.jpg",
  },
  {
    id: 3,
    marca: "Termo",
    descripcion: "Termo de acero inoxidable por 2Lts",
    precio: 25000,
    img: "./img/termo.jpg",
  },
  {
    id: 4,
    marca: "Matera",
    descripcion: "Matera de cuero",
    precio: 18000,
    img: "./img/matera.jpg",
  },
];

// Ejecución del código
// --- Invocación de funciones ---
imprimirProductosEnHTML(items);

let carrito = chequearCarritoEnStorage();
