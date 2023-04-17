import './css/styles.css';
import { fetchCountries } from './JS/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const countriesListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

function countrySearch(evt) {
  const value = evt.target.value.trim();
  if (value.length) {
    fetchCountries(value)
      .then(data => {
        cleanData();
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          let dataItemMarkup = buildCounriesList(data);
          countriesListEl.innerHTML += dataItemMarkup;
        } else if (data.length === 1) {
          let dataItemMarkups = buildCountries(data);
          countryInfoEl.innerHTML += dataItemMarkups;
        }
      })
      .catch(() => {
        cleanData();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  } else {
    cleanData();
  }
}

function buildCounriesList(data) {
  return data
    .map(({ name, flags }) => {
      return `<li class = "country-item"> 
            <img src = "${flags.svg}" alt = "flag" width = 40/> 
            <p>${name.official}</p>
        </li>`;
    })
    .join('');
}

function buildCountries(data) {
  return data
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class = "country-title"> 
            <img class = "country-img" src = "${
              flags.svg
            }" alt = "flag" width = 50/> 
            <b class = "country-name">${name.official}</b>
        </div>
        <ul>
            <li>
                <p><b>Capital:</b> ${capital}</p>
            </li>
            <li>
                <p><b>Population:</b> ${population}</p>
            </li>
            <li>
                <p><b>Langues:</b> ${Object.values(languages).join(', ')}</p>
            </li>
        </ul>
        `;
    })
    .join('');
}
function cleanData() {
  countriesListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}
