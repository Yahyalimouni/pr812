window.addEventListener("DOMContentLoaded", () => {
    /* ----------- DOM ------------- */
    const submit = document.getElementById('submit');
    const refElement = document.getElementById("referencia");
    const form = document.forms[0];

    /* ----------- GLOBAL VARS -----------*/
    const dataRegExp = {
        'referencia': /^[A-Z]{2,4}[0-9]{4}$/,
        'nif': /^[0-9]{7,8}[A-Z]$/,
        'precioUnds': /[0-9]{0,6}/,
        'dto': /[0-9]{0,2}/
    }

    // Get the fecha-disponible
    const getFecha = () => {
        const fecha = {
            'year': document.getElementById("year"),
            'month': document.getElementById("month"),
            'day': document.getElementById("day"),
        }

        const year = parseInt(fecha.year.value);
        let month = parseInt(fecha.month.value) + 1;
        let day = parseInt(fecha.day.value);

        if(year && month && day){
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;

            return `${year}-${month}-${day}`;
        }

        return '';
    }

    // Updated version
    const handleError = (element) => {
        if(!element.classList.contains('error')) {
            element.classList.add('error');
        }
    }

    const clearError = (element) => {
        if(element.classList.contains("error")) {
            element.classList.remove("error");
        }
    }

    let refOk = true;
    // Handles both, required and non required ref
    const validateRef = (element) => {
        const refValue = element.value.trim();
        const isInvalid = !dataRegExp.referencia.test(refValue);
    
        if (element.required || refValue !== '') {
            isInvalid ? (handleError(element), refOk = false) : (clearError(element), refOk = true);
        }
    };
    

    // Handles both, required and non required nif
    let nifOk = true;
    const validateNif = (element) => {
        const nifValue = element.value.trim();
        const isInvalid = !dataRegExp.nif.test(nifValue);
    
        if (element.required || nifValue !== '') {
            isInvalid ? (handleError(element), nifOk = false) : (clearError(element), nifOk = true);
        }
    }

    let precioCosteOk = true;
    const validatePrecioCoste = (element) => {
        const precioValue = parseInt(element.value.trim());
        const isInvalid = !dataRegExp.precioUnds.test(precioValue) || precioValue <= 0;

        isInvalid ? (handleError(element), precioCosteOk = false) : (clearError(element), precioCosteOk = true);
    }

    let dtoCompraOk = true;
    const validateDto = (element) => {
        const dtoValue = parseFloat(element.value.trim());
        const isInvalid = !dataRegExp.dto.test(dtoValue) || dtoValue < 0 || dtoValue > 0.9;

        isInvalid ? (handleError(element), dtoCompraOk = false) : (clearError(element), dtoCompraOk = true);
    }

    let undsOk = true;
    const validateUnd = (element) => {
        const undsValue = parseInt(element.value.trim());
        const isInvalid = undsValue < 0;

        isInvalid ? (handleError(element), undsOk = false) : (clearError(element), undsOk = true);
    }

    const handleBlur = (e) => {
        const element = e.target;
        const elementAriaLabel = element.getAttribute("aria-label");

        switch(elementAriaLabel){
            case 'referencia':
                validateRef(element);
                break;
            case 'nif':
                validateNif(element);
                break;
            case 'precio-coste':
                validatePrecioCoste(element);
                break;
            case 'dto-compra':
                validateDto(element);
                break;
            case 'und':
                validateUnd(element);
                break;
        }
    }

    const sendData = (data) => {
        const referencia = data.referenciaURL;
        const nif = data.nifURL;
        
        if(!referencia || !nif){
            alert("No ref and nif found");
            return;
        }
        
        const dataWithoutParms = {};

        for(key in data) {
            if(!['referenciaURL', 'nifURL'].includes(key)){
                dataWithoutParms[key] = data[key]
            }
        }

        dataWithoutParms['_method'] = 'PATCH';
        
        console.log(JSON.stringify(dataWithoutParms));

        fetch(`/articulo_proveedor/${nif}/${referencia}`, {
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(dataWithoutParms),
            method: "POST"
        })
        .then((res) => {
            if (res.ok) {
                console.log(res.status); 
                return;
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => console.log(data))
        .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    const handleSubmit = () => {
        let formData = {
            'referenciaURL': document.getElementById("referencia").value,
            'nifURL': document.getElementById("nif").value,
            'referencia': document.getElementById("new-ref").value,
            'nif': document.getElementById("new-nif").value,
            'und_compradas': document.getElementById("und-compradas").value,
            'und_disponibles': document.getElementById("und-disponibles").value,
            'precio_coste': document.getElementById("precio-coste").value,
            'dto_compra': document.getElementById("dto-compra").value,
            'fecha_disponible': getFecha(),
        }

        let validFormData = {};

        for(el in formData) {
            if(formData[el] !== '') validFormData[el] = formData[el];
        }

        sendData(validFormData);
    }

    /* ------------ EVENT LISTENERS ----------------*/
    submit.addEventListener("click", handleSubmit);
    form.addEventListener("blur", handleBlur, true);
});