
const socket = io();
const productosLista = document.getElementById('productos-lista');
const formAgregar = document.getElementById('form-agregar');

socket.on('productosActualizados', (productos) => {
    productosLista.innerHTML = '';
    productos.forEach(prod => {
        productosLista.innerHTML += 
        `<div>
            <h3 class="producto-titulo">${prod.title}</h3>
            <div class="productos-container">
                <p>${prod.categoria}</p>
                <p>${prod.descripcion}</p>
                <p>${prod.codigo}</p>
            </div>
            <button class="product-button"onclick="eliminarProducto('${prod.id}')">Eliminar</button></div>
        </div>`;
    });
});

formAgregar.addEventListener('submit', (e) => {
    const nuevoProducto = {
        title: document.getElementById('title').value,
        descripcion: document.getElementById('descripcion').value,
        codigo: document.getElementById('codigo').value,
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value,
        categoria: document.getElementById('categoria').value
    };
    socket.emit('agregarProducto', nuevoProducto);
});

function eliminarProducto(id) {
    socket.emit('eliminarProducto', id);
}
