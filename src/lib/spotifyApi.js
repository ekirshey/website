import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public'

function createGetRequest() {
    let accessToken = localStorage.getItem('access-token');
    return {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        },
    };
}

/**
 * @param {any} body
 */
function createPostRequest(body) {
    let accessToken = localStorage.getItem('access-token');
    return {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + accessToken
        },
        body: JSON.stringify(body)
    };
}


// @ts-ignore
export async function requestAccessToken(code) {
    let codeVerifier = localStorage.getItem('code-verifier');

    // @ts-ignore
    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: PUBLIC_REDIRECT_URI,
        client_id: PUBLIC_CLIENT_ID,
        code_verifier: codeVerifier
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })

    localStorage.setItem('access-token', response.access_token);
}

// @ts-ignore
export async function refreshAccessToken() {
    let token = localStorage.getItem('access-token');

    // @ts-ignore
    let body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id: PUBLIC_CLIENT_ID,
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })

    localStorage.setItem('access-token', response.access_token);
}

/**
 * @param {{ tracks: { href: RequestInfo | URL; }; }} playlist
 */
export async function getPlaylistTracks(playlist) {
    const tracksRequest = createGetRequest();

    const tracksResponse = await fetch(playlist.tracks.href, tracksRequest)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
    
    let tracksList = [];

    for(let item of tracksResponse.items) {
        tracksList.push(item.track.id);
    }

    return tracksList;
}

/**
 * @param {any[]} tracks
 */
export async function getRecommendations(tracks) {
    const recommendationsRequest = createGetRequest();

    tracks = tracks.sort((a, b) => 0.5 - Math.random());
    /**
     * @type {any[]}
     */
    let recommendations = [];
    let idx = 0;
    while( (idx < tracks.length) && (recommendations.length < 100) ) {
        
        let seedTracks = tracks.slice(idx, Math.min(idx+5, tracks.length - idx));
        const recommendationsResponse = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}`, recommendationsRequest)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })

        recommendationsResponse.tracks.forEach((/** @type {{ uri: any; }} */ element) => {
            recommendations.push(element.uri);
        });
        idx += 5;
    }
    
    return recommendations;
}

/**
 * @param {any} user
 * @param {any} recommendations
 * @param {any} newPlaylistName
 */
export async function createPlaylist(user, recommendations, newPlaylistName) {
    let playlistCreateRequest = createPostRequest({
        name: newPlaylistName
    });

    const playlistCreateResponse = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, playlistCreateRequest)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        });
 
    let addItemsRequest = createPostRequest({
        uris: recommendations
    });

    await fetch(`https://api.spotify.com/v1/playlists/${playlistCreateResponse.id}/tracks`, addItemsRequest)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        });
}

export async function getUser() {
    const userRequest = createGetRequest();

    return await fetch('https://api.spotify.com/v1/me', userRequest)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
}

/**
 * @param {{ id: any; } | undefined} [user]
 */
export async function getPlaylists(user) {
    const playlistRequest = createGetRequest();

    // @ts-ignore
    const playlists = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists?offset=0&limit=40`, playlistRequest)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
    
    return playlists.items;
}
