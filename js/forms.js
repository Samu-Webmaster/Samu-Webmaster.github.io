async function sha256(input) {
    // Convierte el input en una cadena de texto
    const text = input.toString();

    // Convierte el texto en un array de bytes (Buffer)
    const buffer = new TextEncoder().encode(text);

    // Calcula el hash utilizando el algoritmo SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    // Convierte el resultado del hash en un array de bytes
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convierte el array de bytes en una cadena hexadecimal
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}  

function formValidate(name, phone, tc) {

    // Expresión regular para validar un nombre con al menos 2 caracteres
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    
    // Expresión regular para validar un número de teléfono entre 7 y 10 dígitos
    const phoneRegex = /^[0-9]{8,8}$/;
    
    // Validar el nombre
    if (!nameRegex.test(name)) {
        alert("Por favor, ingrese un nombre válido con al menos 2 caracteres.");
        return false;
    }
    
    // Validar el número de teléfono
    if (!phoneRegex.test(phone)) {
        alert("Por favor, ingrese un número de teléfono válido (8 dígitos).");
        return false;
    }

    if(!tc.checked) {
        alert("Debe aceptar términos y condiciones.")
        return false;
    }
    
    return true;
}

function getDataLayerInfo () {
    let bu = document.getElementById("bu").innerText;
    let oferta = document.getElementById("oferta").innerText;
    let valor = document.getElementById("valor").innerText;

    let data;

    return data = {
        'bu': bu,
        'oferta': oferta,
        'valor': valor
    }
}

function handleFormSubmit(dataPromo) {
    
    let data = getDataLayerInfo();


    sha256(dataPromo.phone).then(hash => {
        
        window.dataLayer.push({
            'event': 'formulario_enviado',
            'category': dataPromo.category,
            'action': 'button click',
            'label': dataPromo.label,
            'bu': data.bu,
            'oferta': data.oferta,
            'valor': data.valor,
            'numero': hash,
            'correo': dataPromo.email
        });

    }).catch(error => {
        console.error('Error:', error);
    });

    
}

function handleSuccessResponse(dataPromo) {
    let data = getDataLayerInfo();

    sha256(dataPromo.phone).then(hash => {
        window.dataLayer.push({
            'event': 'formulario_exitoso',
            'category': dataPromo.category,
            'action': 'button click',
            'label': dataPromo.label,
            'bu': data.bu,
            'oferta': data.oferta,
            'valor': data.valor,
            'numero': hash,
            'correo': dataPromo.email
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}

//Modal//
const btnOpenModal = document.querySelector("#btn-open-modal");
const btnCloseModal = document.querySelector("#btn-close-modal");
const modal = document.querySelector("#modal");

btnCloseModal.addEventListener("click",()=>{
    modal.close();
})
/*  */

//Modal Error//
const btnCloseModalError = document.querySelector("#btn-close-modal-error");
const modalError = document.querySelector("#modal-error");

btnCloseModalError.addEventListener("click",()=>{
    modalError.close();
})
/*  */

document.getElementById("contact-form").addEventListener("submit", function(event) {
    // Detenemos el comportamiento de recarga del formulario
    event.preventDefault();

    // Capturamos los valores de los campos de nombre y teléfono
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const tc = document.getElementById("tyc");
    const category = document.getElementById("category_form").value;
    const label = document.getElementById("label_form").value;
    const email = document.getElementById("email").value;

    // Validación del formulario
    if (!formValidate(name, phone, tc)) {
        return;
    }

    let dataPromo = {
        phone,
        category,
        label,
        email
    };

    // Creación del DataLayer Botón Enviar
    window.dataLayer = window.dataLayer || [];
    handleFormSubmit(dataPromo);

    // Objeto de datos que se enviarán al API
    var data = {
        name: name,
        phone: phone,
        email: email
    };

    let btnOriginal =  btnOpenModal.value;
    btnOpenModal.value= "Enviando ...";

    // Solicitud POST al API mediante fetch
    fetch("https://hooks.zapier.com/hooks/catch/2244901/3881q56/", {
        method: "POST",
       /*  headers: {
        "Content-Type": "application/json" 
        }, */
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la solicitud.");
        }
        return response.json();
    })
    .then(data => {
        btnOpenModal.value= btnOriginal;
        modal.showModal();
        handleSuccessResponse(dataPromo);
        console.log("Solicitud exitosa:", data);
    })
    .catch(error => {
        btnOpenModal.value= btnOriginal;
        modalError.showModal();
        handleSuccessResponse(dataPromo);
        console.error("Error:", error);
    });
});