const countryData = [
  {
    name: 'United States',
    capital: 'Washington, D.C.',
    population: '334,233,854',
    coords: [38.9072, -77.0369],
  },
  {
    name: 'China',
    capital: 'Beijing',
    population: '1,425,671,352',
    coords: [39.9042, 116.4074],
  },
  {
    name: 'India',
    capital: 'New Delhi',
    population: '1,428,627,663',
    coords: [28.6139, 77.2090],
  },
  {
    name: 'Brazil',
    capital: 'Brasília',
    population: '215,353,593',
    coords: [-15.7939, -47.8828],
  },
  {
    name: 'Nigeria',
    capital: 'Abuja',
    population: '218,541,212',
    coords: [9.0765, 7.3986],
  },
  {
    name: 'Russia',
    capital: 'Moscow',
    population: '146,307,472',
    coords: [55.7558, 37.6176],
  },
  {
    name: 'Japan',
    capital: 'Tokyo',
    population: '123,951,692',
    coords: [35.6762, 139.6503],
  },
  {
    name: 'Australia',
    capital: 'Canberra',
    population: '26,307,604',
    coords: [-35.2809, 149.1300],
  },
  {
    name: 'Canada',
    capital: 'Ottawa',
    population: '40,854,605',
    coords: [45.4215, -75.6972],
  },
  {
    name: 'Germany',
    capital: 'Berlin',
    population: '84,256,203',
    coords: [52.5200, 13.4050],
  },
  {
    name: 'France',
    capital: 'Paris',
    population: '65,893,557',
    coords: [48.8566, 2.3522],
  },
  {
    name: 'South Africa',
    capital: 'Pretoria',
    population: '61,758,123',
    coords: [-25.7479, 28.2293],
  },
];

const map = L.map('map', {
  center: [20, 0],
  zoom: 2,
  minZoom: 2,
  zoomControl: true,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const markers = L.layerGroup().addTo(map);
const countryList = document.getElementById('country-list');
const searchInput = document.getElementById('country-search');
const searchButton = document.getElementById('search-button');

function formatPopup(country) {
  return `
    <div>
      <h3>${country.name}</h3>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Capital:</strong> ${country.capital}</p>
    </div>
  `;
}

function addCountryMarker(country) {
  const marker = L.circleMarker(country.coords, {
    radius: 10,
    fillColor: '#38bdf8',
    fillOpacity: 0.9,
    color: '#FFFFFF',
    weight: 1.5,
  })
    .addTo(markers)
    .bindPopup(formatPopup(country), { closeButton: false, offset: [0, -8] });

  marker.country = country;
  return marker;
}

const markerItems = countryData.map((country) => addCountryMarker(country));

function buildCountryList(data) {
  countryList.innerHTML = '';
  data.forEach((country) => {
    const item = document.createElement('li');
    item.className = 'country-item';
    item.innerHTML = `
      <h4>${country.name}</h4>
      <p>Capital: ${country.capital}</p>
      <p>Population: ${country.population}</p>
    `;
    item.addEventListener('click', () => focusCountry(country));
    countryList.appendChild(item);
  });
}

function focusCountry(country) {
  const marker = markerItems.find((entry) => entry.country.name === country.name);
  if (!marker) return;
  map.setView(country.coords, 4, { animate: true, duration: 0.8 });
  marker.openPopup();
}

function searchCountry() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    buildCountryList(countryData);
    return;
  }

  const matches = countryData.filter((country) => country.name.toLowerCase().includes(query));
  if (matches.length > 0) {
    focusCountry(matches[0]);
  }
  buildCountryList(matches.length ? matches : countryData);
}

searchButton.addEventListener('click', searchCountry);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchCountry();
  }
});

buildCountryList(countryData);
