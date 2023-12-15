import * as functions from './functions.js';
import { initializeDOM, initializeMyLokum, debugLog } from './global.js';
import {loadTexts, footerText} from './contentTexts.js';

/////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async (event) => {
    await loadTexts();
    debugLog('footerText : {}', footerText);
    initializeMyLokum();
    initializeDOM();
    await functions.addCharacter();
});