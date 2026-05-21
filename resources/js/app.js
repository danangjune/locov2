import './bootstrap';


import * as bootstrap from 'bootstrap';

// Tooltip Globaly
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

window.terbilang = function (id) {
  console.log('hey terbilang', id);
}