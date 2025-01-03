import { testAPIConnection, tokenValidityCheck } from './tokens.js';
import {
    renderUI, 
    renderLoginPage, 
    setupEventListneres,
    updatePlaylists 
} from './ui.js';
import {
    fillUserData,
    fillPlaylists,
    getAllPlaylists,
    getPlaylists,
    toggleFilters,
    toggleSource,
    toggleTarget,
    setDefaultValues
} from './control.js';

// TODO: zajistit, ze target muze byt jen jeden
// TODO: zajistit, ze jeden playlist nemuze byt zdroj a cil zaroven
// TODO: nacist pisne z oznacenych playlistu
// TODO: nahrat nactene pisne do vybraneho playlistu
// TODO: stylovani


if (await testAPIConnection()) {
    
    if(!await tokenValidityCheck()) { // TODO: zajistit nacasovani validace
        renderLoginPage();
    } else {
        await fillUserData();
        await fillPlaylists();
    
        setupEventListneres({
            onGetAllPlaylists: getAllPlaylists,
            onToggleFilters: filters => {
                toggleFilters(filters);
                updatePlaylists(getPlaylists());
            },
            onToggleSource: playlistID => {
                toggleSource(playlistID);
                updatePlaylists(getPlaylists());
            },
            onToggleTarget: playlistID => {
                toggleTarget(playlistID);
                updatePlaylists(getPlaylists());
            }
        });

        renderUI(getPlaylists());
        setDefaultValues();
    }

} else {
    renderLoginPage();
}