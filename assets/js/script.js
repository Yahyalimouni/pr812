window.addEventListener("DOMContentLoaded", () => {
    /* ------------- DOM Elements ----------------- */
    const inputs = document.getElementsByTagName("input");
    const yearSelect = document.getElementById("year");
    const monthSelect = document.getElementById("month");
    const daySelect = document.getElementById("day");
    const submit = document.getElementById('submit');
    const uppercaseInputs = document.getElementsByClassName('uppercase-input');

    /* ------------- GLOBAL VARS ---------------- */
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const currentDateObj = new Date();

    /*  ------------  FUNCTIONS  ------------------  */

    // Styling Functions
    const updateLabelsStyles = () => {
        Array.from(inputs).forEach((input) => {
            const label = input.parentElement.querySelector('label');
            const labelClassList = label.classList;
            const styleClass = 'stay-up';

            input.value = input.value.trim();

            if( input.value !== '' ) {
                labelClassList.add(styleClass);
            }
            else {
                if(labelClassList.contains(styleClass)){
                    labelClassList.remove(styleClass);
                }
            }
        })
    }

    // Date Setup:

    const setUpDateSelects = () => {
        setUpYears();
        setUpMonths();
        setUpDays();
    }

    // Sets the years from the current one to a max of 5 years.
    const setUpYears = () => {
        const currentYear = currentDateObj.getFullYear();
        const maxYear = currentYear + 5;

        yearSelect.textContent = '';
        yearSelect.appendChild(createOption('', '', true));
        
        for(let year = currentYear; year <= maxYear; year++) {
            yearSelect.appendChild(createOption(year, year));
        }
    }
    
    // Function to create an option
    const createOption = (value='', text='', defaultOp = false) => {
        if(typeof defaultOp !== 'boolean') return;
        
        const option = document.createElement('option');
        
        if(defaultOp && !text) {
            option.selected = true;
        }
        
        option.value = value;
        option.text = text;
        
        return option;
    }
    
    // Set the months and desables the past months depending on the selected year
    const setUpMonths = () => {
        const currentMonth = currentDateObj.getMonth();
        
        monthSelect.textContent = '';

        monthSelect.appendChild(createOption('', '', true));
        
        months.forEach((month, index) => {
            const option = createOption(index, month)
            monthSelect.appendChild(option);
            
            if(yearSelect.value) {
                // Selecting the current month as default
                option.selected = index === currentMonth;
                // Deshabilitar los meses pasados
                option.disabled = parseInt(yearSelect.value) === currentDateObj.getFullYear() && index < currentMonth;
            }
        })
    }
    
    // Setting up days
    const setUpDays = () => {
        daySelect.textContent = '';
        daySelect.appendChild(createOption('', '', true));
        
        // Get the selected year and month
        const selectedYear = !isNaN(yearSelect.value) ? parseInt(yearSelect.value) : "";
        const selectedMonth = !isNaN(monthSelect.value) ? parseInt(monthSelect.value) : "";

        // Get current date parts
        const currentDay = currentDateObj.getDate();
        const currentYear = currentDateObj.getFullYear();
        const currentMonth = currentDateObj.getMonth();

        // Get the days number of the current month
        const currentMonthDays = getMonthDays(selectedYear, selectedMonth + 1);

        for( let day = 1; day <= currentMonthDays; day++ ) {
            const dayOption = createOption(day, day);
            daySelect.appendChild(dayOption);

            if(selectedMonth && selectedYear) {
                // Select current day by default
                dayOption.selected = day === currentDay;
    
                // Disable the previous days in the same year and month
                dayOption.disabled =  selectedYear === currentYear && selectedMonth === currentMonth && day < currentDay;
            }
        }
    }

    const getMonthDays = (year, month) => {
        if(isNaN(year) || isNaN(month)) return;
        return new Date(year, month, 0).getDate()
    }

    setUpDateSelects();

    /* ------------------ Event Listeners --------------------- */
    document.forms[0].addEventListener("blur", updateLabelsStyles, true);
    document.forms[0].addEventListener("submit", (e) => e.preventDefault());
    yearSelect.addEventListener("change", setUpMonths);
    yearSelect.addEventListener("change", setUpDays);
    monthSelect.addEventListener("change", setUpDays);

    Array.from(uppercaseInputs).forEach(input => input.addEventListener("input", (e) => {
        const value = e.target.value;
        if (e.inputType !== 'deleteContentBackward' && e.inputType !== 'deleteContentForward') {
            e.target.value = /[a-zA-Z]/.test(value) ? value.toUpperCase() : value;
        }
    }));
})