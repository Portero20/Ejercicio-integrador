/*
En el archivo tarea2.js podemos encontrar un código de un supermercado que vende productos.
El código contiene 
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/


// Cada producto que vende el super es creado con esta clase
class Producto {

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock || 10;

    }
    agregarStock(cantidad) {

        this.stock += cantidad

    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {

    // Al crear un carrito, empieza vació
    constructor(precioTotal) {
        this.precioTotal = precioTotal || 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
 
        try {
            console.log(`Agregando cantidad: ${cantidad} del producto ${sku}`);

            const producto = await findProductBySku(sku);
            const productoExistente = this.productos.find((prod) => prod.sku === sku);

            console.log(productoExistente)

            const stockDisponible = producto.stock;

            if (cantidad > stockDisponible) {

                console.log(`No te puedes pasar del stock del producto ${sku} y se agrega el máximo disponible: ${stockDisponible}`);
                cantidad = stockDisponible


            }else {

                console.log('Producto Agregado');

                if (productoExistente) {

                    productoExistente.cantidad += cantidad;
                    console.log('Producto encontrado: ', producto);

                } else {

                    const nuevoProducto = new ProductoEnCarrito(producto.sku, producto.nombre, cantidad);
                    this.productos.push(nuevoProducto);

                    if (!this.categorias.includes(producto.categoria)) {

                        this.categorias.push(producto.categoria);
                    }

                    console.log(nuevoProducto);
                }
            }

            this.precioTotal += producto.precio * cantidad;

            const productosSuperIndex = productosDelSuper.findIndex((prod) => prod.sku === sku);

            if(productosSuperIndex !== -1) { //si se encontro el producto directamente me resta la cantidad

                productosDelSuper[productosSuperIndex].stock -= cantidad;

            }

            console.log('Precio Total: $' + this.precioTotal);

        } catch (error) {

            console.log('Producto no encontrado', error);

        }
    }

    eliminarProd(sku, cantidad) { //esto esta bien

        return new Promise(async(resolve, reject) => {

            const productoExiste = this.productos.find((pro) => pro.sku == sku);
            const productosSuper = await findProductBySku(sku)

            if (!productoExiste) {

                reject(`El producto ${sku} no existe en el carrito`);
                return;

            }

            if (cantidad < productoExiste.cantidad) {

                productoExiste.cantidad -= cantidad;

                this.precioTotal <= 0 ? (this.precioTotal = 0) : (this.precioTotal -= productosSuper.precio * cantidad);

                resolve(`Se eliminaron ${cantidad} unidades del producto ${sku}`);

            } else if (cantidad >= productoExiste.cantidad) {

                const productoIndex = this.productos.indexOf(productoExiste);

                this.precioTotal -= 0 ? (this.precioTotal = 0) : (this.precioTotal -= productosSuper.precio * cantidad);

                this.productos.splice(productoIndex, 1);

                resolve(`Se eliminó el producto ${sku} del carrito`);
                
            }
        });
    }

}

// Cada producto que se agrega al carrito es creado con esta clase (esto esta bien)
class ProductoEnCarrito {

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos" (esto esta bien)
function findProductBySku(sku) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            const foundProduct = productosDelSuper.find((product) => product.sku === sku);

            if (foundProduct) {

                resolve(foundProduct);

            } else {

                reject(`Product ${sku} not found`);
            }

        }, 1500);

    });
}

const carrito = new Carrito();

console.group('Carrito de compras');

carrito.agregarProducto('OL883YE', 20)
    .then(() => {

        console.log('Productos en el carrito: ', carrito.productos);
        return carrito.eliminarProd('OL883YE', 2);

    })
    .then((mensaje) => {

        console.log(mensaje);
        console.log('Productos en el carrito después de eliminar:', carrito.productos);
        console.log('Productos disponibles del supermercado' ,productosDelSuper)

    })
    .then(() => {

        console.log('Productos en el carrito después de agregar: ', carrito.productos);
        console.log('Precio total del carrito: $', carrito.precioTotal);

    })
    .catch((err) => {

        console.log(err);

    });

console.groupEnd();