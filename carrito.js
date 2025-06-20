// --- Variables principales ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = carrito.reduce((acc, item) => acc + item.precio, 0);

// --- Función para agregar un producto al carrito ---
function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  total += precio;
  guardarCarrito();
  actualizarCarrito();

  // Asegura que el carrito se abra automáticamente si está cerrado
  const carritoDiv = document.getElementById("carrito");
  if (carritoDiv.classList.contains("cerrado")) {
    alternarCarrito();
  }
}

// --- Mostrar el contenido del carrito en pantalla ---
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalElemento = document.getElementById("total");

  if (!lista || !totalElemento) return;

  lista.innerHTML = "";

  // Agrupar productos por nombre
  const agrupado = {};
  carrito.forEach((item) => {
    if (agrupado[item.nombre]) {
      agrupado[item.nombre].cantidad += 1;
      agrupado[item.nombre].subtotal += item.precio;
    } else {
      agrupado[item.nombre] = {
        precio: item.precio,
        cantidad: 1,
        subtotal: item.precio,
      };
    }
  });

  // Mostrar cada producto agrupado
  Object.entries(agrupado).forEach(([nombre, datos]) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>${datos.cantidad} x ${nombre} - S/. ${datos.subtotal.toFixed(2)}</span>
    <span style="display: inline-flex; gap: 5px; margin-left: 10px;">
        <button style="font-size: 28px;" onclick="event.stopPropagation(); agregarAlCarrito('${nombre}', ${datos.precio})">➕</button>
        <button style="font-size: 28px;" onclick="event.stopPropagation(); eliminarUno('${nombre}')">❌</button>
    </span>
`;
    lista.appendChild(li);
  });

  totalElemento.textContent = total.toFixed(2);
}


// --- Eliminar un producto específico ---
function eliminarItem(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    mostrarPopup("El carrito ya está vacío.");
    return;
  }
  carrito = [];
  total = 0;
  guardarCarrito();
  actualizarCarrito();
 mostrarPopup("🧹 Tu carrito ha sido vaciado correctamente.");

}

function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarPopup("Tu carrito está vacío. Agrega productos antes de comprar.");
    return;
  }

  // Agrupar productos
  const agrupado = {};
  carrito.forEach((item) => {
    if (agrupado[item.nombre]) {
      agrupado[item.nombre].cantidad += 1;
      agrupado[item.nombre].subtotal += item.precio;
    } else {
      agrupado[item.nombre] = {
        cantidad: 1,
        subtotal: item.precio,
      };
    }
  });

  // Crear mensaje de boleta
  let mensaje = "🎉 ¡Gracias por tu compra!<br><br>Tu pedido:<br>";
  Object.entries(agrupado).forEach(([nombre, datos]) => {
    mensaje += `- ${datos.cantidad} x ${nombre} - S/. ${datos.subtotal.toFixed(2)}<br>`;
  });

  mensaje += `<br><strong>Total: S/. ${total.toFixed(2)}</strong>`;

  mostrarPopup(mensaje);
  carrito = [];
  total = 0;
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// --- Cargar carrito al abrir página ---
window.addEventListener('DOMContentLoaded', actualizarCarrito);

function mostrarPopup(mensaje) {
  const popup = document.getElementById("popup");
  const texto = document.getElementById("popup-mensaje");
  texto.innerHTML = mensaje.replace(/\n/g, "<br>");
  popup.classList.remove("oculto");
}

function cerrarPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("oculto");
}
function alternarCarrito() {
  const carrito = document.getElementById('carrito');
  carrito.classList.toggle('abierto');
  carrito.classList.toggle('cerrado');
}
// Permitir abrir el carrito desde el ícono del menú
document.addEventListener("DOMContentLoaded", () => {
  const iconoMenu = document.getElementById("iconoCarritoMenu");
  const carrito = document.getElementById("carrito");

  if (iconoMenu && carrito) {
    iconoMenu.addEventListener("click", (e) => {
      e.stopPropagation(); // evita conflictos de eventos
      alternarCarrito();   // abre o cierra como el ícono flotante
    });
  }
});

function eliminarUno(nombreProducto) {
  // Encuentra el índice del primer producto con ese nombre
  const index = carrito.findIndex(item => item.nombre === nombreProducto);
  if (index !== -1) {
    total -= carrito[index].precio;
    carrito.splice(index, 1); // Elimina solo 1
    guardarCarrito();
    actualizarCarrito();
  }
}
