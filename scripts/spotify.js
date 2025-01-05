import { testAPIConnection, tokenValidityCheck } from './tokens.js';
import {
    renderUI, 
    renderLoginPage, 
    setupEventListeneres,
    updatePlaylists 
} from './ui.js';
import {
    fillInitData,
    getAllPlaylists,
    getPlaylists,
    toggleFilters,
    toggleSource,
    toggleTarget,
    setDefaultValues,
    mergePlaylists
} from './control.js';


// TODO: stylovani
// TODO: presunout Login listener do setupEventListeneres + zobrazovat tlacitko na zaklade testAPIConnection a tokenValidityCheck (zrusit renderLoginPage)
// TODO: predelat kontrolu accessToken v endpointech na metodu
// TODO: doplnit chybove hlasky - neni zadny zdroj, neni vybran cil
// TODO: doplnit upozorneni pred spustenim slouceni (vypsat zdroje a cile)


if (await testAPIConnection()) {
    
    if(!await tokenValidityCheck()) { // TODO: zajistit nacasovani validace
        renderLoginPage();
    } else {
        await fillInitData();
    
        setupEventListeneres({
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
            },
            onMergePlaylists: async () => {
                const result = await mergePlaylists();
                updatePlaylists(getPlaylists());
                return result;
            }
        });

        setDefaultValues();
        renderUI(getPlaylists());
    }

} else {
    renderLoginPage();
}