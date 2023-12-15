export let texts = [];

export let clickables = [];

export let moreTexts = [];

export let footerText = [];

export async function loadTexts(){
    return Promise.all([
        loadTextFile('./../../public/texts/main.txt')
        .then(text => {
            text = text.replace(/\r/g, '');
            texts = text.split('\n');
        }),
        loadTextFile('./../../public/texts/clickables.txt')
        .then(text => {
            text = text.replace(/\r/g, '');
            clickables = text.split('\n');
        }),
        loadTextFile('./../../public/texts/moreTexts.txt')
        .then(text => {
            text = text.replace(/\r/g, '');
            moreTexts = text.split('\n');
        }),
        loadTextFile('./../../public/texts/footerText.txt')
        .then(text => {
            text = text.replace(/\r/g, '');
            footerText = text.split('\n');
        })])
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

async function loadTextFile(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`An error occurred while loading the file: ${response.statusText}`);
    }
    return response.text();
}