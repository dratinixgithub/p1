// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Trofeos",
        imagen: "trofeo.jpg",
        descripcion: "Trofeos en acrílico, con grabado laser mostrando el nombre del que recibe el trofeo y su proesa.",
        precio: 45000
    },
    {
        id: 2,
        nombre: "Habladores",
        imagen: "habladorqr.jpg",
        descripcion: "Habladores en los que puedes añadir cualquier contenido, ya sea códigos qr para pagar, menús de restaurantes, redes sociales entre otros.",
        precio: 25000
    },
    {
        id: 3,
        nombre: "Avisos",
        imagen: "aviso.jpg",
        descripcion: "Avisos para mostrar el nombre de su empresa, puede incluirles luces led para la noche, incluye un año de mantenimiento.",
        precio: 120000
    },
    {
        id: 4,
        nombre: "Urnas",
        imagen: "urna.jpg",
        descripcion: "Urnas para dejar sugerencias o votaciones.",
        precio: 35000
    }
];

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});

// Carrito de compras
let carrito = [];

// Función para mostrar productos
function mostrarProductos() {
    const contenedor = document.querySelector('.contenedor');
    contenedor.innerHTML = ''; // Limpiar contenido existente
    
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'fotos acriltec-block' ;
    
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" width="20%" height="auto">
            <h2 class="titulo">${producto.nombre}</h2>
            <p class="texto">${producto.descripcion}</p>
            <p class="precio">$${producto.precio.toLocaleString('es-CO')}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
            <br>
        `;
        contenedor.appendChild(productoDiv);
    });
}

// Función para agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === idProducto);
        
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({...producto, cantidad: 1});
        }
        
        actualizarCarrito();
        mostrarMensaje(`${producto.nombre} agregado al carrito`);
    }
}

// Función para remover producto del carrito
function removerDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarrito();
    mostrarMensaje('Producto removido del carrito');
}

// Función para cambiar cantidad de producto en el carrito
function cambiarCantidad(idProducto, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        removerDelCarrito(idProducto);
        return;
    }
    
    const item = carrito.find(item => item.id === idProducto);
    if (item) {
        item.cantidad = parseInt(nuevaCantidad);
        actualizarCarrito();
    }
}

// Función para vaciar el carrito - versión simplificada que funciona
function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito ya está vacío');
        return;
    }
    
    // Vaciar directamente - confirmación removida para asegurar funcionamiento
    carrito.splice(0, carrito.length);
    actualizarCarrito();
    mostrarMensaje('🗑️ Carrito vaciado completamente');
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    
    // Actualizar contador
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
    
    // Actualizar contenido del carrito
    if (carrito.length === 0) {
        carritoDiv.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
        totalCarrito.textContent = '$0';
    } else {
        let carritoHTML = `
            <div class="carrito-header-items">
                <h3>Productos en el carrito:</h3>
                <button class="btn-vaciar" onclick="event.preventDefault(); vaciarCarrito();">🗑️ Vaciar Todo</button>
            </div>
        `;
        let total = 0;
        
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            carritoHTML += `
                <div class="item-carrito">
                    <img src="${item.imagen}" alt="${item.nombre}" width="60" height="60">
                    <div class="info-item">
                        <h4>${item.nombre}</h4>
                        <div class="cantidad-control">
                            <label>Cantidad:</label>
                            <input type="number" min="1" max="99" value="${item.cantidad}" 
                                   onchange="cambiarCantidad(${item.id}, this.value)" 
                                   class="input-cantidad">
                        </div>
                        <p>Precio unitario: $${item.precio.toLocaleString('es-CO')}</p>
                        <p class="subtotal">Subtotal: $${subtotal.toLocaleString('es-CO')}</p>
                        <button class="btn-remover" onclick="removerDelCarrito(${item.id})">🗑️ Remover</button>
                    </div>
                </div>
            `;
        });
        
        carritoDiv.innerHTML = carritoHTML;
        totalCarrito.textContent = `$${total.toLocaleString('es-CO')}`;
    }
}

// Función para mostrar/ocultar carrito
function toggleCarrito() {
    const carritoModal = document.getElementById('carrito-modal');
    carritoModal.style.display = carritoModal.style.display === 'none' ? 'block' : 'none';
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje';
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeInOut 3s forwards;
    `;
    
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        document.body.removeChild(mensajeDiv);
    }, 3000);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarProductos();
    actualizarCarrito();
});