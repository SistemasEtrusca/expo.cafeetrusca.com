// Ocultar contenedor de Registro finalizado
const contenedorRegistroFinal = document.getElementById('contenedor-registro-finalizado');


// Tomar los datos del formulario

document.addEventListener('DOMContentLoaded', function () {
    const inputExpo = document.getElementById('inputExpo');
    const inputEspecifica = document.getElementById('contenedor-especifica');

    inputEspecifica.style.display = "none"; // Oculta el elemento al cargar la página

    // Barra de porcentaje

    // Selecciona todos los elementos de entrada del formulario
    const formInputs = document.querySelectorAll('input, select');

    // Calcula el porcentaje de progreso para cada campo completado
    const calculateProgress = () => {
        // Calcula la cantidad de campos completados
        const completedFields = Array.from(formInputs).filter(input => {
            if (input.tagName === 'SELECT') {
                return input.selectedIndex !== 0; // Verifica si se ha seleccionado una opción en el select
            } else if (input.type === 'checkbox') {
                return input.checked; // Verifica si el checkbox está marcado
            } else {
                return input.value.trim() !== ''; // Verifica si el campo de entrada tiene un valor
            }
        }).length;

        // Calcula el porcentaje de progreso
        const totalFields = formInputs.length;
        const progressPercentage = (completedFields / totalFields) * 100;
        return progressPercentage;
    };

    // Actualiza la barra de progreso con el porcentaje calculado
    const updateProgressBar = () => {
        const progressBar = document.getElementById('progress-bar');
        const progressPercentage = calculateProgress();

        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
    };

    // Escucha los eventos de cambio en los campos del formulario
    formInputs.forEach(input => {
        input.addEventListener('change', updateProgressBar);
    });

    // End Barra de porcentaje

    inputExpo.addEventListener('change', function (event) {
        const selectedValue = event.target.value;
        if (selectedValue === '6') {
            inputEspecifica.style.display = "block"; // Muestra el elemento en caso contrario
        } else {
            inputEspecifica.style.display = "none"; // Oculta el elemento si el valor seleccionado es '6'
        }
    });
});


// Espera a que se cargue todo el contenido del documento
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el formulario
    const form = document.getElementById('myForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const zipcode = document.getElementById('inputCodigoPostal');
    const col = document.getElementById('inputColonia');

    // Función para limpiar todos los campos del formulario
    const clearFormFields = () => {
        formInputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0; // Reinicia los selects
            } else if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false; // Desmarca checkboxes y radios
            } else {
                input.value = ''; // Limpia inputs y textareas
            }
        });
    };
    // Verifica si el formulario ya ha sido enviado desde este navegador
    // const isFormSubmitted = localStorage.getItem('formSubmitted');

    // Si el formulario ya ha sido enviado, redirige a otra ruta
    // if (isFormSubmitted) {
    // window.location.href = 'usuario-registrado.html'; 
    // }
    // Manejador de evento para el campo de código postal
    // Event listener para el input del código postal
    zipcode.addEventListener('input', function () {
        var zipCode = this.value;

        if (zipCode.length === 5) {
            fetch('https://cafeetrusca.com/api/CodigoPostal/' + zipCode, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(response => {
                    console.log('ZipCode Get successfully');
                    if (response) {
                        console.log('ZipCode Get successfully');
                        console.log(response.data);

                        // Mostrar los campos ocultos
                        document.getElementById('container-colonia').style.display = 'block';
                        document.getElementById('container-municipio').style.display = 'block';
                        document.getElementById('container-estado').style.display = 'block';
                        document.getElementById('container-ciudad').style.display = 'block';

                        // Vaciar las opciones existentes en el select de colonia
                        var colSelect = document.getElementById('inputColonia');
                        colSelect.innerHTML = '';
                        // Si el inputColonia es un input de texto, lo convertimos a un select
                        if (colSelect.tagName === 'INPUT') {
                            // Crear el select
                            var newSelect = document.createElement('select');
                            newSelect.className = 'form-control';  // Añadir clase para estilo
                            newSelect.id = 'inputColonia';  // Mantener el mismo ID si es necesario
                            colSelect.parentNode.replaceChild(newSelect, colSelect);
                            colSelect = newSelect;  // Actualizar la referencia al nuevo select
                        }
                        if (response.length > 0) {
                            // Obtener el primer registro en caso de que haya varios
                            var firstRecord = response[0];

                            // Asignar valores a los campos de municipio y estado
                            document.getElementById('inputMunicipio').value = firstRecord?.municipio || '';
                            document.getElementById('inputEstado').value = firstRecord?.estado || '';
                            document.getElementById('inputCiudad').value = firstRecord?.ciudad || '';

                            // Emitir el evento Livewire (si es necesario)
                            // Livewire.emit('updateCity', firstRecord?.municipio || '');
                            // Livewire.emit('updateMun', firstRecord?.ciudad || '');

                            var edo = firstRecord?.estado || '';
                            edo = (edo === 'México') ? 'Estado de México' : edo;
                            // Livewire.emit('updateProvince', edo);

                            // Agregar nuevas opciones al select de colonia
                            response.forEach(function (item) {
                                var option = document.createElement('option');
                                option.text = item.asenta;
                                option.value = item.asenta;
                                colSelect.add(option);
                                console.log(item.asenta);
                            });
                        } else {
                            // Puedes agregar una opción "Otro" si es necesario
                            // var option = document.createElement('option');
                            // option.text = 'Otro';
                            // option.value = 'Otro';
                            // colSelect.add(option);
                            // Reemplazar el select por un input de tipo text si no hay resultados
                            var inputText = document.createElement('input');
                            inputText.type = 'text';
                            inputText.className = 'form-control';  // Añadir clase para estilo
                            inputText.id = 'inputColonia'; // Mantener el mismo ID si es necesario
                            inputText.placeholder = 'Ingresa tu colonia'; // Texto de placeholder

                            // Reemplazar el select por el nuevo input
                            colSelect.parentNode.replaceChild(inputText, colSelect);
                        }

                        // Inicializar Select2 (si es necesario)
                        // initSelect2();
                    } else {
                        console.log('Error: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Error en la petición AJAX: ' + error);
                });
        }
    });

    // Agrega un evento 'submit' al formulario
    form.addEventListener('submit', function (event) {
        // Previene el comportamiento predeterminado de enviar el formulario
        event.preventDefault();
        // Desactiva el botón de enviar
        submitButton.disabled = true;
        // Crea un objeto para almacenar los datos del formulario
        const USERS = {};
        Swal.fire({
            title: '¡Guardado con éxito!',
            text: 'Los cambios han sido guardados correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            willClose: () => {
                location.reload(); // Recarga la página cuando se cierra la alerta, sin importar cómo
            },
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload(); // Recarga la página al hacer clic en "Aceptar"
            }
        });
        // Obtiene los valores de los campos del formulario y los agrega al objeto USERS
        USERS.first_name = document.getElementById('inputNombre').value;
        USERS.telephone = document.getElementById('inputTelefono').value;
        USERS.email = document.getElementById('inputEmail').value;
        USERS.expo = document.getElementById('inputExpo') ? document.getElementById('inputExpo').value : '';
        USERS.codigopostal = document.getElementById('inputCodigoPostal') ? document.getElementById('inputCodigoPostal').value : '';
        USERS.colonia = document.getElementById('inputColonia') ? document.getElementById('inputColonia').value : '';
        USERS.municipio = document.getElementById('inputMunicipio') ? document.getElementById('inputMunicipio').value : '';
        USERS.estado = document.getElementById('inputEstado') ? document.getElementById('inputEstado').value : '';
        USERS.ciudad = document.getElementById('inputCiudad') ? document.getElementById('inputCiudad').value : '';


        USERS.message = document.getElementById('inputEspecifica') ? document.getElementById('inputEspecifica').value : '';
        USERS.message += document.getElementById('inputObservaciones') ? document.getElementById('inputObservaciones').value : '';

        USERS.curso = document.getElementById('inputTaller') ? document.getElementById('inputTaller').value : '';
        USERS.fecha = document.getElementById('inputDate') ? document.getElementById('inputDate').value : '';


        USERS.newsletter = document.getElementById('inputNewsletter').checked;
        USERS.avisoPrivacidad = document.getElementById('inputAvisoPrivacidad').checked;
        USERS.url = location.href;
        
        // Muestra los datos del formulario en la consola y envío a newsletter
        console.log(USERS),
        fetch('https://intranet.cafeetrusca.com/api/v1/venta/prospeccion', {
            method: "POST",
            body: JSON.stringify(USERS),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            response.json().then(parsedValue => {
                console.log(parsedValue);
                localStorage.setItem('codigo', parsedValue.code),
                    localStorage.setItem('email', parsedValue.email),
                    console.log(USERS),
                    // Limpia todos los campos del formulario
                    // clearFormFields();

                    // Redirige a una ruta diferente después de enviar el formulario
                    //window.location.href = 'registro-final.html'; // Reemplaza 'ruta_diferente.html' con la URL a la que deseas redirigir
                    Swal.fire({
                        title: '¡Guardado con éxito!',
                        text: 'Los cambios han sido guardados correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        willClose: () => {
                            location.reload(); // Recarga la página cuando se cierra la alerta, sin importar cómo
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload(); // Recarga la página al hacer clic en "Aceptar"
                        }
                    });

                //location.reload();

            })
        }).catch(err => console.log(err)).finally(() => {
        
            // Habilita nuevamente el botón de enviar, ya sea que la solicitud tenga éxito o falle
            submitButton.disabled = false;
        });

            fetch('https://cafeetrusca.com/api/newsLetter', {
                method: "POST",
                body: JSON.stringify(USERS),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                response.json().then(parsedValue => {
                    console.log(parsedValue);
                    localStorage.setItem('codigo', parsedValue.code),
                        localStorage.setItem('email', parsedValue.email),
                        console.log(USERS),
                        // Limpia todos los campos del formulario
                        // clearFormFields();

                        // Redirige a una ruta diferente después de enviar el formulario
                        //window.location.href = 'registro-final.html'; // Reemplaza 'ruta_diferente.html' con la URL a la que deseas redirigir
                        Swal.fire({
                            title: '¡Guardado con éxito!',
                            text: 'Los cambios han sido guardados correctamente.',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            willClose: () => {
                                location.reload(); // Recarga la página cuando se cierra la alerta, sin importar cómo
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload(); // Recarga la página al hacer clic en "Aceptar"
                            }
                        });

                    //location.reload();

                })
            }).catch(err => console.log(err)).finally(() => {
                Swal.fire({
                    title: '¡Guardado con éxito!',
                    text: 'Los cambios han sido guardados correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    willClose: () => {
                        location.reload(); // Recarga la página cuando se cierra la alerta, sin importar cómo
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload(); // Recarga la página al hacer clic en "Aceptar"
                    }
                });
                // Habilita nuevamente el botón de enviar, ya sea que la solicitud tenga éxito o falle
                submitButton.disabled = false;
            });

        // Marca el formulario como enviado en el almacenamiento local
        // localStorage.setItem('formSubmitted', 'true');



    });
});

// End tomar datos del formulario






