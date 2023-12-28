import * as functions from './functions.js';
import { initializeDOM, initializeMyLokum, debugLog } from './globals.js';
import {loadTexts, footerText} from './contentTexts.js';

/////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async (event) => {
    await loadTexts();
    debugLog('footerText : {}', footerText);
    initializeMyLokum();
    initializeDOM();
    setTimeout(async function() {
        await functions.addCharacter();
    }, 5000);
});


var logo = document.getElementById('logo');
var menu = document.querySelector('nav');
var prompt = document.getElementById('content');
prompt.style.display = 'none';

logo.addEventListener('transitionend', function() {
    menu.style.display = 'flex';
    prompt.style.display = 'block';
});

window.addEventListener('load', function() {
    setTimeout(function() {
        var logo = document.getElementById('logo');
        logo.classList.add('small');
    }, 1000);
});