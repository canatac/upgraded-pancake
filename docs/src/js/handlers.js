import {addCharacter, addClickables, addCharacterToFooter} from './functions.js';
import * as globals from './globals.js';
import {debugLog} from './globals.js';

var absent = true;
var delay = 10;

export function handleNewLine() {
    debugLog('newline');
    globals.lineLength = 0;
}

export function handleAddNextCharacter(){
    debugLog('addNextCharacter');
    setTimeout(addCharacter, delay);
}

export function handleAddNewParagraph(){
    debugLog('addNewParagraph');
    globals.container.innerHTML += "<span class='prompt'>|</span><span>\n(Press 'Enter' to continue)</span>";
    globals.IsWaitingForEnterState(true);
    window.addEventListener('keydown', handleEnterKey);
    if (globals.moreDetailToDisplay) addClickables();

    globals.setIndex(0);
    globals.setTextIndex(globals.textIndex + 1);
    globals.setLineLength(0);
    setTimeout(addCharacter, delay);
}

export function handleMaxLineLength() {
    debugLog('maxLineLength');

    globals.container.textContent += '\\\n > ';
    globals.setLineLength(0);
    setTimeout(addCharacter, delay);
}

export function handleTryNow(){
    debugLog('tryNow');

    var tryNow = document.createElement('span');
    tryNow.textContent = 'Try now';
    tryNow.className = 'clickable';
    tryNow.onclick = function() {
        // Code to handle the 'Try now' click...
    };
    globals.container.appendChild(tryNow);
    globals.IsWaitingForEnterState(false);
}

export async function handleEnd() {
    debugLog('end');
    globals.container.innerHTML += "<span class='prompt'>|</span><span>\n</span>";
    globals.IsWaitingForEnterState(false);
    await addClickables();
    if (absent) {await addCharacterToFooter(globals.footer.textContent)};
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        globals.IsWaitingForEnterState(false);
        globals.container.innerHTML = globals.container.innerHTML.replace("<span class=\"prompt\">|</span>", "");
        globals.container.innerHTML = globals.container.innerHTML.replace("(Press 'Enter' to continue)", "");
        globals.container.innerHTML = globals.container.innerHTML.replace(" or simply ", "");
        globals.container.innerHTML = globals.container.innerHTML.replace("Try now", "");

        globals.container.textContent += '$ ';
        window.removeEventListener('keydown', handleEnterKey);
        addCharacter();
    }
}