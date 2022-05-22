// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')




// Eventos
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto)
}





// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 )
        // console.log(gastado);

        this.restante = this.presupuesto - gastado

        // console.log(this.restante);
    }

    eliminarGasto(id) {
        // console.log(id);
        this.gastos = this.gastos.filter( gasto => gasto.id !== id )

        this.calcularRestante()
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // Extraemos los valores
        const { presupuesto, restante } = cantidad
        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje, tipo) {
        // crear el div
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert')

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }

        // Mensaje de error
        divMensaje.textContent = mensaje

        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        // Quitar del HTML
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    mostrarGastos( gastos ) {
        ui.limpiarHTML()

        // Iterar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto

            // Crear li
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            // nuevoGasto.setAttribute('data-id', id)
            nuevoGasto.dataset.id = id

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.onclick = () => eliminarGasto(id)
            btnBorrar.innerHTML = 'Borrar &times'

            nuevoGasto.appendChild(btnBorrar)

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        });
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante
    }

    comprobarPresupuesto( presupuestoObj ) {
        const { presupuesto, restante} = presupuestoObj
        const restanteDiv = document.querySelector('.restante')

        // Comprobar 25%
        if( (presupuesto / 4) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        } else if( (presupuesto / 2) > restante ) {
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success')
        }

        // Si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }

    // Limpia el array
    limpiarHTML() {
        while( gastoListado.firstChild ) {
            gastoListado.removeChild( gastoListado.firstChild )
        }
    }
}





// Instanciar
ui = new UI()
let presupuesto;



// Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cúal es tu presupuesto?')
    // console.log( Number(presupuestoUsuario) );

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }

    // Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario)
    // console.log(presupuesto);


    ui.insertarPresupuesto(presupuesto)
}

// Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)

    // Validar
    if( nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error')
        return;
    } else if( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no valida', 'error')
        return;
    }

    // console.log('Agregando Gasto');

    const gasto = { nombre, cantidad, id: Date.now() }

    // Añade gasto al arreglo
    presupuesto.nuevoGasto(gasto)

    // Mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado Correctamente')

    // Imprimir los gastos
    const { gastos, restante } = presupuesto

    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)



    // Reinicio del formulario
    formulario.reset()
}

function eliminarGasto(id) {
    // Elimina del objeto
    presupuesto.eliminarGasto(id)

    // Elimina los gastos del HTML
    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}