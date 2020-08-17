const gallery = document.querySelector('.gallery');

/**
 * 
 * @param {*} url 
 */
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .catch(error => console.log('Looks like there was a problem', error))
}

fetchData('https://randomuser.me/api/?results=12')
    .then(data => generateCard(data.results))
    // .then(data => console.log((data.results)))

fetchData('https://randomuser.me/api/?results=12')
    .then(data => generateModal(data.results))
/**
 * checkStatus
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
 * 
 * @param {*} data 
 */
function generateCard(data) {
    const card = data.map(item => `
    <div class='card'>
        <div class='card-img-container'>
            <img class="card-img" src="${item.picture.thumbnail}">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${item.name.first}, ${item.name.last}</h3>
            <p class="card-text">${item.email}</p>
            <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
        </div>
    </div>
    `).join('');
    gallery.innerHTML = card;
}

function generateModal(data) {
    const modal = data.map(item => `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${item.picture.medium}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${item.name.first} ${item.name.last}</h3>
                <p class="modal-text">${item.email}</p>
                <p class="modal-text cap">${item.location.city}</p>
                <hr>
                <p class="modal-text">${item.cell}</p>
                <p class="modal-text">${item.location.street.number} ${item.location.street.name}., ${item.country} OR ${item.location.postcode}</p>
                <p class="modal-text">Birthday: ${item.dob.date}</p>
            </div>
        </div>

    // IMPORTANT: Below is only for exceeds tasks 
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `)
    gallery.nextSibling.innerHTML = modal;
}