import * as globals from './globals.js';
import { debugLog } from './globals.js';
import * as handlers from './handlers.js';
import { clickables, moreTexts } from './contentTexts.js';

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
            var emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.placeholder = 'Your email address';
            emailInput.style.display = 'none';

            emailInput.style.backgroundColor = '#282828'; 
            emailInput.style.color = 'lime'; 
            emailInput.style.border = 'none'; 
            emailInput.style.padding = '5px'; 
            emailInput.style.marginLeft = '10px'; 
            emailInput.style.fontFamily = 'Courier New';

            var subscribeButton = document.createElement('button');
            subscribeButton.textContent = 'Subscribe';
            subscribeButton.style.display = 'none';

            globals.container.appendChild(emailInput);
            globals.container.appendChild(subscribeButton);


            subscribeButton.style.backgroundColor = '#282828'; 
            subscribeButton.style.color = 'lime'; 
            subscribeButton.style.border = 'none'; 
            subscribeButton.style.padding = '5px'; 
            subscribeButton.style.marginLeft = '10px'; 
            subscribeButton.style.fontFamily = 'Courier New'; 
        
            
            emailInput.style.display = 'inline-block';
            subscribeButton.style.display = 'inline-block';
            emailInput.focus();

            emailInput.oninput = function() {
                // Supprimez le message d'erreur s'il existe
                var errorDialog = document.getElementById('errorDialog');
                if (errorDialog) {
                    errorDialog.parentNode.removeChild(errorDialog);
                }
            };

            subscribeButton.onclick = function() {
                var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if (!emailRegex.test(emailInput.value)) {
                    var errorDialog = document.createElement('div');
                    errorDialog.id = 'errorDialog'; 
                    errorDialog.textContent = 'Please enter a valid email address.';
                    errorDialog.style.backgroundColor = '#282828'; 
                    errorDialog.style.color = 'red'; 
                    errorDialog.style.padding = '10px'; 
                    errorDialog.style.marginTop = '10px'; 
                    errorDialog.style.fontFamily = 'Courier New'; 
                    globals.container.appendChild(errorDialog);
                    return;
                }
                while (globals.container.firstChild) {
                    globals.container.removeChild(globals.container.firstChild);
                }
                var successDialog = document.createElement('div');
                successDialog.textContent = 'Thank you ' + emailInput.value + '! We send you an email to verify your account.';
                successDialog.style.backgroundColor = '#282828'; 
                successDialog.style.color = 'lime'; 
                successDialog.style.padding = '10px'; 
                successDialog.style.marginTop = '10px'; 
                successDialog.style.fontFamily = 'Courier New'; 
                globals.container.appendChild(successDialog);        

                window.removeEventListener('keydown', handlers.handleEnterKey);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '{{baseUrl}}:8000/subscribe', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                /*
                xhr.send(JSON.stringify({
                    email: emailInput.value
                }));
                */
            };
        };
        globals.container.appendChild(simply);
        globals.container.appendChild(tryNow);
        globals.IsWaitingForEnterState(true);

        return;
    }

    clickables.forEach(function(clickable) {
        var simply = createClickableSpan(clickable,function() {
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
        });
        globals.container.appendChild(simply);
    });

    return;
}

export async function addCharacterToFooter(text) {
    for (let i = 0; i < text.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                globals.footer.textContent += text[i];
                resolve();
            }, globals.typingSpeed);
        });
    }
}

// This array contains the texts that will be displayed on the screen.
// Each element of the array represents a separate paragraph.

function createClickableSpan(clickable, onClick) {
    var span = document.createElement('span');
    span.textContent = clickable;
    span.className = 'clickable';
    span.addEventListener('click', onClick);
    return span;
}