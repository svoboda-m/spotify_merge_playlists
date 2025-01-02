import { renderUI, renderLoginPage } from './ui.js';
import { fillUserData, fillPlaylists, getPlaylists } from './control.js';
import { testAPIConnection, tokenValidityCheck } from './tokens.js';



if (await testAPIConnection()) {
    
    if(!await tokenValidityCheck()) { // TODO: zajistit nacasovani validace
        renderLoginPage();
    } else {
        document.getElementById('spotify-login').style.display = 'none';
        await fillUserData();
        await fillPlaylists();
    
        renderUI(getPlaylists());
    }

} else {
    renderLoginPage();
}