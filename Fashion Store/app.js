/* =====================================================================
   AQUÍ ESTÁN LAS IMÁGENES DE LAS 6 PRENDAS (DESTACADOS Y COLECCIÓN)
   Reemplaza cada ruta en "imagen" por la foto de tu prenda.
   ===================================================================== */
const PRODUCTOS = [
  {
    id: 1,
    nombre: "Casaca Urbana Oversize",
    precio: 45.00,
    tallas: ["S", "M", "L", "XL"],
    destacado: true,
    imagen: "IMG/prenda1.jpg"
  },
  {
    id: 2,
    nombre: "Conjunto Casual Minimal",
    precio: 58.00,
    tallas: ["S", "M", "L"],
    destacado: true,
    imagen: "IMG/prenda2.jpg"
  },
  {
    id: 3,
    nombre: "Pantalón Recto Clásico",
    precio: 39.00,
    tallas: ["S", "M", "L", "XL"],
    destacado: true,
    imagen: "IMG/prenda3.jpg"
  },
  {
    id: 4,
    nombre: "Camisa Cuello Resort",
    precio: 34.00,
    tallas: ["M", "L", "XL"],
    destacado: false,
    imagen: "IMG/prenda4.jpg"
  },
  {
    id: 5,
    nombre: "Vestido Midi Contemporáneo",
    precio: 52.00,
    tallas: ["S", "M", "L"],
    destacado: false,
    imagen: "IMG/prenda5.jpg"
  },
  {
    id: 6,
    nombre: "Polera Algodón Premium",
    precio: 29.00,
    tallas: ["S", "M", "L", "XL"],
    destacado: false,
    imagen: "IMG/prenda6.jpg"
  }
];

let tallasElegidas = {};
let filtroTallaActual = "TODAS";
let carrito = JSON.parse(localStorage.getItem("fashionStoreCarrito")) || [];

PRODUCTOS.forEach((prod) => {
  tallasElegidas[prod.id] = prod.tallas[0];
});

function guardarCarrito() {
  localStorage.setItem("fashionStoreCarrito", JSON.stringify(carrito));
}

function mostrarAvisoImagen(imgElement, etiqueta) {
  imgElement.style.display = "none";
  const padre = imgElement.parentElement;
  if (padre && !padre.querySelector(".placeholder-sin-foto")) {
    const aviso = document.createElement("div");
    aviso.className = "placeholder-sin-foto";
    aviso.textContent = `Espacio reservado (${etiqueta})`;
    padre.appendChild(aviso);
  }
}

function crearTarjetaHTML(producto, mostrarControlesCompra = true) {
  const tallaActual = tallasElegidas[producto.id];
  return `
    <article class="tarjeta-ropa">
      <div class="casilla-imagen">
        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
          onerror="mostrarAvisoImagen(this, '${producto.nombre}')"
        />
      </div>
      ${
        mostrarControlesCompra
          ? `
        <div class="cuerpo-ropa">
          <div class="fila-nombre-precio">
            <h3 class="nombre-ropa">${producto.nombre}</h3>
            <span class="precio-ropa">$${producto.precio.toFixed(2)}</span>
          </div>

          <div class="selector-tallas">
            <span class="etiqueta-talla">Talla:</span>
            ${producto.tallas
              .map(
                (talla) => `
                <button
                  type="button"
                  class="btn-talla ${talla === tallaActual ? "seleccionada" : ""}"
                  onclick="elegirTalla(${producto.id}, '${talla}')"
                >${talla}</button>
              `
              )
              .join("")}
          </div>

          <button type="button" class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
            Agregar al pedido (Talla ${tallaActual})
          </button>
        </div>
      `
          : ""
      }
    </article>
  `;
}

function renderizarDestacados() {
  const grid = document.getElementById("gridDestacados");
  if (!grid) return;

  const destacados = PRODUCTOS.filter((p) => p.destacado).slice(0, 3);
  grid.innerHTML = destacados.map((p) => crearTarjetaHTML(p, false)).join("");
}

function renderizarColeccion() {
  const grid = document.getElementById("gridColeccion");
  if (!grid) return;

  const filtrados = PRODUCTOS.filter((p) => {
    if (filtroTallaActual === "TODAS") return true;
    return p.tallas.includes(filtroTallaActual);
  });

  const textoConteo = document.getElementById("textoConteoPrendas");
  if (textoConteo) {
    textoConteo.textContent = `Mostrando ${filtrados.length} ${filtrados.length === 1 ? "prenda" : "prendas"}`;
  }

  grid.innerHTML = filtrados.map((p) => crearTarjetaHTML(p, true)).join("");
}

window.elegirTalla = function (idProducto, talla) {
  tallasElegidas[idProducto] = talla;
  renderizarColeccion();
};

window.filtrarPorTalla = function (talla) {
  filtroTallaActual = talla;
  document.querySelectorAll("[data-filtro-talla]").forEach((btn) => {
    btn.classList.toggle("seleccionada", btn.dataset.filtroTalla === talla);
  });
  renderizarColeccion();
};

window.agregarAlCarrito = function (idProducto) {
  const producto = PRODUCTOS.find((p) => p.id === idProducto);
  if (!producto) return;
  const talla = tallasElegidas[idProducto] || producto.tallas[0];

  const existente = carrito.find((item) => item.id === idProducto && item.talla === talla);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      talla,
      cantidad: 1
    });
  }

  guardarCarrito();
  actualizarCarrito();
};

window.quitarDelCarrito = function (indice) {
  carrito.splice(indice, 1);
  guardarCarrito();
  actualizarCarrito();
};

function actualizarCarrito() {
  const totalPrendas = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const contador = document.getElementById("contadorCarrito");
  if (contador) {
    contador.textContent = totalPrendas;
  }

  const totalEl = document.getElementById("totalPedido");
  if (totalEl) {
    totalEl.textContent = `$${totalPrecio.toFixed(2)}`;
  }

  const lista = document.getElementById("listaResumenPedido");
  if (!lista) return;

  if (carrito.length === 0) {
    lista.innerHTML = `<li>Aún no has agregado prendas. Ve a <a href="productos.html" style="color:#f2c40f;">Productos</a> para elegir.</li>`;
    return;
  }

  lista.innerHTML = carrito
    .map(
      (item, idx) => `
      <li>
        <span>${item.nombre} (Talla ${item.talla}) x${item.cantidad}</span>
        <span>
          $${(item.precio * item.cantidad).toFixed(2)}
          <button type="button" class="btn-quitar" onclick="quitarDelCarrito(${idx})">Quitar</button>
        </span>
      </li>
    `
    )
    .join("");
}

const formulario = document.getElementById("formularioPedido");
if (formulario) {
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreCompleto").value.trim();
    const total = document.getElementById("totalPedido").textContent;
    const confirmacion = document.getElementById("mensajeConfirmacion");

    confirmacion.style.display = "block";
    confirmacion.textContent =
      `¡Gracias, ${nombre}! Tu pedido en FASHION STORE ha sido registrado (Total: ${total}).`;

    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    this.reset();
  });
}

renderizarDestacados();
renderizarColeccion();
actualizarCarrito();