// 7.1  declaro lista de empleados como un "array" vacio para que sea mi base de datos
let listaEmpleados = [];

// 7.1 Definición de un "objeto" que representa a un empleado con sus propiedades
const objEmpleado = {
    id: '',
    nombre: '',
    apellidos: '',
    correo: '',
    numero: '',
    servicios: [],
    tipoSoporte: ''
};

// Variable para controlar si se está editando un empleado
let editando = false;

// Evento para manejar el envío del formulario
$(document).ready(function() {                      //.ready(funcion) es un metodo que toma como parametro una funcion y se ejecutara cuando el DOM esté completamente cargado
    const $formulario = $('.formulario-registro');  // Selecciono el elemento con la clase 'formulario-registro' y lo almaceno en const $formulario
    $formulario.on('submit', validarFormulario);  // Agrega un evento 'submit' al formulario seleccionado y especifica que la función 'validarFormulario' se ejecutará cuando se envíe el formulario
});

// 7.1 Función para validar el formulario antes de agregar o editar un empleado
function validarFormulario(e) { //interceptar el envío de el formulario y evita que se envíe automáticamente.
    e.preventDefault(); //evita enviar los datos del formulario al servidor y recargar la página

    // Verificación de que todos los campos del formulario estén llenos
    const $nombreInput = $('#nombres');  //Estas variables almacenan los elementos del formulario que tienen los ID que corresponden a los escrityos (ni yo me entendi aqui xD)
    const $apellidosInput = $('#apellidos');
    const $correoInput = $('#correo');
    const $numeroInput = $('#Numero');
    const $serviciosInput = $('input[name="servicios"]:checked');
    const $tipoSoporteInput = $('input[name="tipo-soporte"]:checked');

 // comprueba si alguno de los campos estan vacios , si alguno de los campos está vacío, muestra una alerta y termina la función
    if ($nombreInput.val() === '' || $apellidosInput.val() === '' || $correoInput.val() === '' || $numeroInput.val() === '' || $serviciosInput.length === 0 || $tipoSoporteInput.length === 0) {
        alert('Todos los campos se deben llenar');
        return;
    } // el operador lógico || lo usa para combinar todas las verificaciones en una sola fila 

    // Asignación de valores del formulario al objeto de empleado
    objEmpleado.id = editando ? objEmpleado.id : Date.now(); //Decide si se debe usar el ID existente del empleado o generar uno nuevo.
    //Si editando es true: Mantiene el ID actual (objEmpleado.id). pero si editando es false: Asigna un nuevo ID basado en la fecha y hora actual (Date.now()), que es un número único
    objEmpleado.nombre = $nombreInput.val(); //Estos métodos obtienen los valores actuales de los campos, y los asignan a las propiedades correspondientes de objEmpleado
    objEmpleado.apellidos = $apellidosInput.val();//Estos métodos obtienen los valores actuales de los campos, y los asignan a las propiedades correspondientes de objEmpleado
    objEmpleado.correo = $correoInput.val();//Estos métodos obtienen los valores actuales de los campos, y los asignan a las propiedades correspondientes de objEmpleado
    objEmpleado.numero = $numeroInput.val();//Estos métodos obtienen los valores actuales de los campos, y los asignan a las propiedades correspondientes de objEmpleado
    objEmpleado.servicios = $serviciosInput.map(function() { return $(this).val(); }).get(); //Crea una lista (array) con los valores de los servicios seleccionados
    objEmpleado.tipoSoporte = $tipoSoporteInput.val();//Estos métodos obtienen los valores actuales de los campos, y los asignan a las propiedades correspondientes de objEmpleado

// Si se está editando un empleado, se llama a la función de editar, de lo contrario se agrega un nuevo empleado
    if (editando) {         //se está editando un empleado existente
        editarEmpleado();   //se llama a la función editarEmpleado() para actualizar los datos del empleado
        editando = false;   //se establece editando a false para indicar que la operación de edición ha terminado
    } else {
        agregarEmpleado();  //se está agregando un nuevo empleado, por lo que se llama a la función agregarEmpleado() para añadirlo
    }

// Limpiar el formulario después de enviar los datos
    const $formulario = $('.formulario-registro'); //se logra seleccionando el formulario a través de la clase formulario-registro
    $formulario.trigger('reset'); //luego activando el evento de reseteo usando $formulario.trigger('reset')
}


// Función para agregar un nuevo empleado a la lista
function agregarEmpleado() {
    listaEmpleados.push({...objEmpleado}); // Agrega una copia del objeto empleado a la lista
    mostrarEmpleados(); // Muestra los empleados actualizados en el DOM
    limpiarObjeto(); // Limpia el objeto empleado para su reutilización
}

// Función para limpiar el objeto de empleado después de agregar o editar
function limpiarObjeto() {
    objEmpleado.id = '';
    objEmpleado.nombre = '';
    objEmpleado.apellidos = '';
    objEmpleado.correo = '';
    objEmpleado.numero = '';
    objEmpleado.servicios = [];
    objEmpleado.tipoSoporte = '';
}

// Función para mostrar todos los empleados en el DOM (aqui manipula el dom)

function mostrarEmpleados() {
    const $divEmpleados = $('.div-empleados'); // Selecciona el contenedor de empleados
    $divEmpleados.empty(); // Limpia el contenido existente

// Itera sobre la lista de empleados y muestra cada uno en el DOM
    listaEmpleados.forEach(empleado => {
        // Extrae las propiedades del empleado
        const {id, nombre, apellidos, correo, numero, servicios, tipoSoporte} = empleado;
        // Crea un nuevo div para cada empleado
        const $empleadoDiv = $('<div>').addClass('empleado');
        // Crea un párrafo con los detalles del empleado y le asigna un atributo de data-id con el ID del empleado
        const $parrafo = $('<p>').text(`${id} - ${nombre} ${apellidos} - ${correo} - ${numero} - ${servicios.join(', ')} - ${tipoSoporte} `).attr('data-id', id);
        // Botón para editar un empleado
        const $editarBoton = $('<button>').text('Editar').addClass('boton boton-editar boton-primary').on('click', () => cargarEmpleado(empleado));
        // Agrega el párrafo y el botón de editar al div del empleado
        $empleadoDiv.append($parrafo, $editarBoton);
        // Botón para eliminar un empleado
        const $eliminarBoton = $('<button>').text('Eliminar').addClass('boton boton-eliminar boton-danger').on('click', () => eliminarEmpleado(id));
        // Agrega el botón de eliminar al div del empleado
        $empleadoDiv.append($eliminarBoton);
        // Agrega el div del empleado al contenedor de empleados
        $divEmpleados.append($empleadoDiv);
    });
}

// Función para cargar los datos de un empleado en el formulario cuando aprietas editar
function cargarEmpleado(empleado) {
    // Extrae los datos del empleado pasado como argumento
    const {id, nombre, apellidos, correo, numero, servicios, tipoSoporte} = empleado;

    // Llenar los campos del formulario con los datos del empleado
    $('#nombres').val(nombre);
    $('#apellidos').val(apellidos);
    $('#correo').val(correo);
    $('#Numero').val(numero);

    // Marcar las opciones de servicios seleccionadas en el formulario
    $('input[name="servicios"]').each(function() {
        $(this).prop('checked', servicios.includes($(this).val()));
    });
    // Marcar la opción de tipo de soporte seleccionada en el formulario
    $('input[name="tipo-soporte"]').each(function() {
        $(this).prop('checked', $(this).val() === tipoSoporte);
    });

    // Asignar el ID del empleado al objeto empleado
    objEmpleado.id = id;

    // Cambiar el texto del botón de envío a "Actualizar"
    $('.btn-agregar').val('Actualizar'); // Cambia el texto del botón de envío
    editando = true; // Activa la bandera de edición

    // Mostrar alerta para que sepan que van a hacer 
    alert('Usted comenzará a actualizar los datos de la base de datos');
}

// Función para editar un empleado
function editarEmpleado() {
    // Actualizar los datos del objeto empleado con los valores del formulario
    objEmpleado.nombre = $('#nombres').val();
    objEmpleado.apellidos = $('#apellidos').val();
    objEmpleado.correo = $('#correo').val();
    objEmpleado.numero = $('#Numero').val();
    objEmpleado.servicios = $('input[name="servicios"]:checked').map(function() { return $(this).val(); }).get();
    objEmpleado.tipoSoporte = $('input[name="tipo-soporte"]:checked').val();

    // Se actualiza el empleado en la lista
    listaEmpleados = listaEmpleados.map(empleado => empleado.id === objEmpleado.id ? {...objEmpleado} : empleado);
    // Limpiar el contenido HTML y volver a mostrar los empleados actualizados
    limpiarHTML();
    mostrarEmpleados();
    // Restablecer el formulario y cambiar el texto del botón de envío
    $('.formulario-registro').trigger('reset');
    $('.btn-agregar').val('Quiero ser contactado');
    
    editando = false; // Desactiva la bandera de edición
}

// Función para eliminar un empleado de la lista
function eliminarEmpleado(id) {
    // Mostrar cuadro de confirmación antes de eliminar un empleado
    const confirmacion = confirm('¿Está seguro de eliminar?');

    if (confirmacion) {
        // Filtrar el empleado a eliminar de la lista de empleados
        listaEmpleados = listaEmpleados.filter(empleado => empleado.id !== id);// Filtra el empleado a eliminar FILTER CREA UN ARRAI NUEVO QUE CUMPLE LOS CRITERIOS DE UNA FUNCION 
        // Limpiar el contenido HTML y volver a mostrar los empleados actualizados
        limpiarHTML();
        mostrarEmpleados();
    } else {
        alert('Eliminación cancelada');
    }
}

// Función para limpiar el contenido HTML de la lista de empleados
function limpiarHTML() {
    const $divEmpleados = $('.div-empleados');
    $divEmpleados.empty(); // Limpia el contenido del div
}


// Mostrar la ventana emergente al cargar la página
window.onload = function() {
    document.getElementById('ventanaTabla').style.display = 'block';
};
// Función para cerrar la ventana emergente
function cerrarVentana() {
    document.getElementById('ventanaTabla').style.display = 'none';
}


// Mostrar y ocultar el CRUD al hacer clic en el botón CRUD
$(document).ready(function(){
    $("#mostrarCRUD").click(function(){
        $("#contenidoCRUD").toggle(); // Alternar la visibilidad del contenedor del CRUD
    });
});

