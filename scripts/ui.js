// This file handles all UI rendering

export function renderPlaylists(playlists, userID, listOnlyUserOwned) {
    document.getElementById('playlists').textContent = '';
    
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'filter-owned';
    input.checked = listOnlyUserOwned;
    document.getElementById('playlists').appendChild(input);

    let label = document.createElement("label");
    label.textContent = 'Zobraz pouze vlastní playlisty';
    label.setAttribute('for', 'filter-owned');
    document.getElementById('playlists').appendChild(label);
    
    playlists.items.forEach(playlist => {
        if (listOnlyUserOwned) {
            if (playlist.owner.uri.includes(userID)) {
                renderLine(playlist.name);
            }
        }
        else {
            renderLine(playlist.name);
        }
    });
}

function renderLine(playlistName) {
    let p = document.createElement('p');
    p.textContent = playlistName;
    document.getElementById('playlists').appendChild(p);
}