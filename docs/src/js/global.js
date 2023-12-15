import { texts } from './contentTexts.js';

export const DEBUG = false;
export function debugLog(message) {
    if (DEBUG) {
        console.log(message);
    }
}

export let maxLineLength = 80;

export let lokum = [];
export function setLokum(value){
    lokum = value;
}
export function initializeMyLokum() {
    for (var i = 0; i < texts.length; i++) {
        lokum.push(texts[i]);
    }
}

export let isWaitingForEnter = false;
export function IsWaitingForEnterState(state){
    isWaitingForEnter = state;
}

export let moreDetailToDisplay = false;
export function isMoreDetailToDisplay(state){
    moreDetailToDisplay = state;
}

export let index = 0;
// This is an index that points to the current character of the text being displayed.
export function setIndex(value){
    index = value;
}
// This is the HTML element where the text will be displayed. 
// 'content' is the ID of this element in the HTML file.
export let textIndex = 0;
export function setTextIndex(value){
    textIndex = value;
}

// This is a variable that counts the number of characters in the current line. 
// It is used to determine when to move to the next line.
export let lineLength = 0;
export function setLineLength(value){
    lineLength = value;
}

export let container;
export let footer;
export function initializeDOM() {
    container = document.getElementById('content');
    footer = document.getElementById('footer');
}

