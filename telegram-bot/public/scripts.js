document.getElementById('emergency-button').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendEmergencyMessage);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function sendEmergencyMessage(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const message = `Экстренная ситуация! Мое местоположение: https://maps.google.com/?q=${latitude},${longitude} Google Maps`;


    fetch('/send-telegram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chatId: '5360245239',
            message: message,
        })
    }).then(response => {
        if (response.ok) {
            alert('Сообщение отправлено');
        } else {
            alert('Ошибка при отправке сообщения');
        }
    });
}

// scripts.js
// scripts.js
document.getElementById('article-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('article-title').value;
    const content = document.getElementById('article-content').value;
    const image = document.getElementById('article-image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', content);
    formData.append('image', image);

    fetch('/events', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          
          loadEvents();
      });

    document.getElementById('article-form').reset();
});

function loadEvents() {
    fetch('/events')
        .then(response => response.json())
        .then(events => {
            const eventsList = document.getElementById('articles-list');
           
            events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'article';
                eventElement.innerHTML = `
                    <img src="${event.image}" alt="${event.title}">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                `;
                eventsList.appendChild(eventElement);
            });
        });
}

// Загружаем мероприятия при загрузке страницы
document.addEventListener('DOMContentLoaded', loadEvents);



function togglediv(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "flex" : "none";
}
function toggledivmain(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "flex" ? "none" : "flex";
}


function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

   
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tablinks").click();
});



let map; let markers = []; const services = { clinic: [ { name: "Поликлиника №1", lat: 54.8714, lng: 69.1208, phone: "77152626226" }, { name: "Поликлиника №2", lat: 54.8760, lng: 69.1551, phone: "+77152502090" }, { name: "Поликлиника №3", lat: 54.891853, lng: 69.136540, phone: "+7 123 456 7891" }, { name: "Поликлиника №4", lat: 54.858171610730054, lng: 69.15518642777697, phone: "+77152502090" }, { name: "Поликлиника №5", lat: 54.86161527824978, lng: 69.1338721185554, phone: "+77152626226" }, { name: "Поликлиника №6", lat: 54.87273494519059, lng: 69.20885273851074, phone: "s" } ], sport: [ { name: "Спортцентр 'Здоровье'", lat: 54.8798, lng: 69.1627, phone: "+7 123 456 7892" }, { name: "Фитнес-клуб 'Энергия'", lat: 54.8705, lng: 69.1372, phone: "+7 123 456 7893" }, { name: "Tennis ortalyğy", lat: 54.85480198899982, lng: 69.11493448250272, phone: "+77056529343" } ], parking: [ { name: "Парковка 1", lat: 54.86095808553424, lng: 69.12645763914122, phone: "отсутствует" }, { name: "Парковка 2", lat: 54.8654980136969, lng: 69.13593795860953, phone: "отсутствует" }, { name: "Парковка 3", lat: 54.868065790513384, lng: 69.12678804888299, phone: "отсутствует" }, { name: "Парковка 4", lat: 54.86238377435917, lng: 69.16069927444477, phone: "отсутствует" }, { name: "Парковка 5", lat: 54.8822340402485, lng: 69.14307010699257, phone: "отсутствует" } ], waste: [ { name: "Пункт сбора мусора №1", lat: 54.8778, lng: 69.1300, phone: "+7 123 456 7896" }, { name: "Пункт сбора мусора №2", lat: 54.8754, lng: 69.1553, phone: "+7 123 456 7897" }, { name: "Пункт сбора мусора №3", lat: 54.91212117407304, lng: 69.13915020942402, phone: "+7 747 456 7896" } ] }; function initMap() { map = new google.maps.Map(document.getElementById('map'), { center: { lat: 54.8747, lng: 69.1515 }, zoom: 13 }); } function showService(type) { const selectedService = services[type]; if (markers.length > 0) { markers.forEach(marker => marker.setMap(null)); markers = []; } else { const bounds = new google.maps.LatLngBounds(); selectedService.forEach(service => { const latlng = { lat: service.lat, lng: service.lng }; const marker = new google.maps.Marker({ position: latlng, map: map, title: service.name }); markers.push(marker); geocodeLatLng(latlng, marker, service); bounds.extend(marker.getPosition()); }); map.fitBounds(bounds); } } function geocodeLatLng(latlng, marker, service) { const geocoder = new google.maps.Geocoder(); geocoder.geocode({ location: latlng }, (results, status) => { if (status === "OK") { if (results[0]) { const address = results[0].formatted_address; const infoWindow = new google.maps.InfoWindow({ content: `<h3>${service.name}</h3><p>Адрес: ${address}</p><p>Телефон: <a href="tel:${service.phone}">${service.phone}</a></p>` }); marker.addListener('click', () => { infoWindow.open(map, marker); }); } else { console.error("No results found"); } } else { console.error("Geocoder failed due to: " + status); } }); }


fetch('data.json')
    .then(response => response.json())
    .then(data => distributeData(data))
    .catch(error => console.error('Error loading JSON file:', error));

function distributeData(data) {
    const block1 = document.getElementById('block1');
    const block2 = document.getElementById('block2');
    const block3 = document.getElementById('block3');
    if (data.length > 0) {
        const itemsPerBlock = Math.ceil(data.length / 3);
        data.slice(0, itemsPerBlock).forEach(item => {
            block1.appendChild(createArticle(item));
        });
        data.slice(itemsPerBlock, itemsPerBlock * 2).forEach(item => {
            block2.appendChild(createArticle(item));
        });
        data.slice(itemsPerBlock * 2).forEach(item => {
            block3.appendChild(createArticle(item));
        });
    }
}

function createArticle(item) {
    const article = document.createElement('article');
    const title = document.createElement('h2');
    title.textContent = item.title;
    article.appendChild(title);
    const summary = document.createElement('p');
    summary.textContent = item.summary;
    article.appendChild(summary);
    if (item.imageUrl) {
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = 'Image';
        article.appendChild(img);
    }
    return article;
}






document.addEventListener('DOMContentLoaded', initMap);


document.addEventListener('DOMContentLoaded', loadEvents);
