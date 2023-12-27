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
    }, 3000);
});

window.addEventListener('load', function() {
    setTimeout(function() {
        var logo = document.getElementById('logo');
        logo.classList.add('small');
    }, 1000);
});