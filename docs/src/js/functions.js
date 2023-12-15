import * as globals from './globals.js';
import {debugLog} from './globals.js';
import * as handlers from './handlers.js';
import { clickables, moreTexts, footerText } from './contentTexts.js';

export async function addCharacter() {
    if (globals.isWaitingForEnter) return;
    var char = globals.lokum[globals.textIndex][globals.index];
// This is the maximum length of a line. 
// When lineLength reaches this value, the text moves to the next line.

    globals.container.textContent += globals.lokum[globals.textIndex][globals.index];
    globals.setIndex(globals.index + 1);
    globals.setLineLength(globals.lineLength + 1);

    var state = {
        newLine: false,
        maxLineLength: false,
        addNextCharacter: false,
        addNewParagraph: false,
        tryNow: false,
        end: false,
        continue: false
    };

    if (char === '\n') {
        state.newLine = true;
    } else if (globals.lineLength >= globals.maxLineLength && char === ' ') {
        state.maxLineLength = true;
    }

    if (globals.index < globals.lokum[globals.textIndex].length) {
        state.addNextCharacter = true;
    } else if (globals.textIndex < globals.lokum.length - 1) {
        state.addNewParagraph = true;
    } else if ((globals.textIndex === (globals.lokum.length - 1)) && globals.moreDetailToDisplay) {
        state.tryNow = true;
    } else if ((globals.textIndex === (globals.lokum.length - 1)) && !globals.moreDetailToDisplay) {
        state.end   = true;
    } else {
        state.continue = true;
    }

    var keys = Object.keys(state);

loop:  for (var i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case 'newLine':
                if (state[keys[i]]) {
                    handlers.handleNewLine();
                    break loop;
                }
            case 'maxLineLength':
                if (state[keys[i]]) {
                    handlers.handleMaxLineLength();
                    break loop;
                }
            case 'addNextCharacter':
                if (state[keys[i]]) {
                    handlers.handleAddNextCharacter();
                    break loop;
                }
            case 'addNewParagraph':
                if (state[keys[i]]) {
                    handlers.handleAddNewParagraph();
                    break loop;
                }
            case 'tryNow':
                if (state[keys[i]]) {
                    handlers.handleTryNow();
                    break loop;
                }
            case 'end':
                if (state[keys[i]]) {
                    await handlers.handleEnd();
                    break loop;
                }
            case 'continue':
                if (state[keys[i]]) {
                    debugLog('continue');
                    break loop;
                }
        }
    }
}   

export async function addClickables() {
    globals.IsWaitingForEnterState(false);
    
    // Add a 'Try now' link to each message in 'moreTexts[]'
    if (globals.moreDetailToDisplay){
        var simply = document.createElement('span');
        simply.textContent = ' or simply ';

        var tryNow = document.createElement('span');
        tryNow.textContent = 'Try now';
        tryNow.className = 'clickable';
        tryNow.onclick = function() {
            // Code to handle the 'Try now' click...
        };
        globals.container.appendChild(simply);
        globals.container.appendChild(tryNow);
        globals.IsWaitingForEnterState(true);

        return;
    }

    clickables.forEach(function(clickable) {
        var span = document.createElement('span');
        span.textContent = clickable;
        span.className = 'clickable';
        span.onclick = function() {
            if (clickable === "Learn More") {
                globals.setLokum([]);
                for (var i = 0; i < moreTexts.length; i++) {  
                    globals.lokum.push(moreTexts[i]);
                }
                globals.container.textContent = '\n$ ';
                globals.isMoreDetailToDisplay(true);
                globals.setTextIndex(0);
                globals.setIndex(0);
                addCharacter();
            }
        };
        globals.container.appendChild(span);
    });

    return;
}

export async function addCharacterToFooter() {
    // Initialisation des variables
    var index = 0;
    var delay = 50; // Vous pouvez ajuster ce délai selon vos besoins

    // Fonction interne pour ajouter un caractère à la fois
    function addCharacterBis() {
        return new Promise((resolve) => {
            
            function helper() {
                if (index < footerText[0].length) {
                    globals.footer.textContent += footerText[0][index];
                    index++;
                    setTimeout(helper, delay);
                } else {
                    resolve();
                }
            }
            helper();
        });
    }

    // Commence à ajouter des caractères
    let ret = await addCharacterBis();
    return;
}

// This array contains the texts that will be displayed on the screen.
// Each element of the array represents a separate paragraph.

