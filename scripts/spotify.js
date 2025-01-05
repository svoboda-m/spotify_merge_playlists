import { setupEventListeneres, updatePlaylists } from './ui.js';
import {
    getAllPlaylists,
    getPlaylists,
    toggleFilters,
    toggleSource,
    toggleTarget,
    mergePlaylists,
    initApp
} from './control.js';


// TODO: stylovani
// TODO: presunout Login listener do setupEventListeneres + zobrazovat tlacitko na zaklade testAPIConnection a tokenValidityCheck (zrusit renderLoginPage)
// TODO: predelat kontrolu accessToken v endpointech na metodu
// TODO: doplnit chybove hlasky - neni zadny zdroj, neni vybran cil
// TODO: doplnit informaci o vysledku zpracovani
// TODO: doplnit upozorneni pred spustenim slouceni (vypsat zdroje a cile)




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

await initApp();
