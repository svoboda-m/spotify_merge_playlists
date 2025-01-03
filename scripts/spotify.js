import { renderUI, renderLoginPage, setupEventListneres } from './ui.js';
import { fillUserData, fillPlaylists, getPlaylists, filterPlaylists, setDefaultValues } from './control.js';
import { testAPIConnection, tokenValidityCheck } from './tokens.js';



if (await testAPIConnection()) {
    
    if(!await tokenValidityCheck()) { // TODO: zajistit nacasovani validace
        renderLoginPage();
    } else {
        await fillUserData();
        await fillPlaylists();
    
        setupEventListneres({
            onGetPlaylists: getPlaylists,
            onFilterPlaylists: filters => {
                filterPlaylists(filters);
            }
        });

        renderUI(getPlaylists());
        setDefaultValues();
    }

} else {
    renderLoginPage();
}