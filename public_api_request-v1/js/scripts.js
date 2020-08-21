//global variables
const gallery = document.querySelector('.gallery')
const searchContainer = document.querySelector('.search-container')
/**
 * fetchData fetches data, checks the status of the response, 
 * parses the response into json and catches error
 * @param {*} url 
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const response_status = await checkStatus(response);
        return response_status.json();
    }
    catch (error) {
        return console.log('Looks like there was a problem', error);
    }
}

fetchData('https://randomuser.me/api/?results=12&nat=us')
    .then(employees => generateCard(employees.results))
    // .then(data => console.log((data.results)))

/**
 * checkStatus checks the status of the response
 * @param {*} response 
 */
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * generateCard renders the card for each employee
 * renders the modal for the clicked employee
 * @param {*} employees 
 */
function generateCard(employees) {
    const card = employees.map(employee => `
    <div class='card'>
        <div class='card-img-container'>
            <img class="card-img" src="${employee.picture.thumbnail}">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employee.name.first}, ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}</p>
        </div>
    </div>
    `).join('');
    gallery.innerHTML = card;
    
    const cards = document.querySelectorAll('.card');
    //renders the modal for the clicked employee
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', (e) => {
            if (cards[i].contains(e.target)) {
                generateModal(employees, i)
            }
        })
    }
}

/**
 * createSearchBox creates the input field and button for filter
 */
function createSearchBox() {
    const inputField = document.createElement('input');
    inputField.className = 'search-input'
    inputField.placeholder = 'Search for an employee'
    searchContainer.appendChild(inputField)

    const searchButton = document.createElement('button')
    searchButton.className = 'search-submit'
    searchButton.textContent = 'Search'
    searchContainer.appendChild(searchButton)
    
    searchButton.addEventListener('click', () => searchEmployee(inputField))
    inputField.addEventListener('input', () => searchEmployee(inputField))
}
createSearchBox()

/**
 * searchEmployee filters by the value of the name on the card and display the matched card
 * @param {*} inputField 
 */
function searchEmployee(inputField) {
    const searchValue = inputField.value
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const employeeName = card.querySelector('.card-name')
        let matchedEmployee = employeeName.textContent.toLowerCase().includes(searchValue.toLowerCase())
            matchedEmployee ? 
            card.style.display = '': 
            card.style.display = 'none'
    })
}

/**
 * generateModal renders the details of the employees
 * @param {*} employee 
 */
function generateModal(employees, i) {
    let employee = employees[i];
    let getDate = new Date(employee.dob.date);
    let phoneDigits = employee.cell.replace(/[^\d]/g, ""); //sets value of cell to only digits with no space
    let formattedPhoneNumber = phoneDigits.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") //set the formatted cell into a 3 groups and format to US phone format

    const modal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${formattedPhoneNumber}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.nat} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${getDate.toLocaleDateString()}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    //inserts the modal of an employee after the gallery
    gallery.insertAdjacentHTML('afterend', modal);

    const modalContainer = document.querySelector('.modal-container')
    const closeButton = document.querySelector('.modal-close-btn');
    const closeModal = [modalContainer, closeButton]
    //remove the modal of an employee when the close button is clicked or any part of the modal
    closeModal.forEach(action => {
        action.addEventListener('click', () => {
            modalContainer.remove()
        })
    });

    const previousEmployee = document.querySelector('.modal-prev')
    const nextEmployee = document.querySelector('.modal-next')
    const totalNumberOfEmployees = employees.length
    const displayedEmployee = employees.indexOf(employee)
    //hides previous button on the first employee modal
    if (displayedEmployee < 1) {
        previousEmployee.classList.add('d-none')
    }
    //hides next button on the last employee modal
    if (displayedEmployee === (totalNumberOfEmployees - 1)) {
        nextEmployee.classList.add('d-none')
    }
    //displays the details of an employee when previous button is clicked
    previousEmployee.addEventListener('click', () => {
        const previous = displayedEmployee - 1
        modalContainer.remove()
        generateModal(employees, previous)
    })
    //displays the modal of an employee when next button is clicked
    nextEmployee.addEventListener('click', () => {
        const next = displayedEmployee + 1
        modalContainer.remove()
        generateModal(employees, next)
    })
}
