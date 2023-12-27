import _main from '../../public/texts/main.js';
import _clickables from '../../public/texts/clickables.js';
import _moreTexts from '../../public/texts/moreTexts.js';
import _footerText from '../../public/texts/footerText.js';

export let texts = _main.split('\n');

export let clickables = _clickables.split('\n');

export let moreTexts = _moreTexts.split('\n');

export let footerText = _footerText.split('\n');

export async function loadTexts(){
    return Promise.resolve();
}
