import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from '$env/static/public'
import type { AccessToken, PublicUser, Recommendations, SimplifiedPlaylist, SimplifiedTrack, Track } from 'spotify-types';
import { SeedType, type Seed, type Property } from './recommendationSettings';

function createGetRequest() {
    let accessToken = localStorage.getItem('access-token');
    return {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        },
    };
}

function createPostRequest(body : any) {
    let accessToken = localStorage.getItem('access-token');
    return {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + accessToken
        },
        body: JSON.stringify(body)
    };
}

function createPutRequest(body : any) {
    let accessToken = localStorage.getItem('access-token');
    return {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + accessToken
        },
        body: JSON.stringify(body)
    };
}


async function sendRequest(url : string, request: RequestInit | undefined) {
    return await fetch(url, request)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
}

export async function requestAccessToken(code: string) : Promise<AccessToken> {
    let codeVerifier = localStorage.getItem('code-verifier');

    // @ts-ignore
    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: PUBLIC_REDIRECT_URI,
        client_id: PUBLIC_CLIENT_ID,
        code_verifier: codeVerifier
    });

    const response = await sendRequest('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    return response;
}

export async function refreshAccessToken() {
    let token = localStorage.getItem('access-token');

    // @ts-ignore
    let body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id: PUBLIC_CLIENT_ID,
    });

    const response = await sendRequest('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    localStorage.setItem('access-token', response.access_token);
}

export async function getPlaylistTracks(playlist : SimplifiedPlaylist) : Promise<Track[]>{
    const tracksRequest = createGetRequest();

    const tracksResponse = await sendRequest(playlist.tracks.href, tracksRequest);

    let tracksList : Track[] = [];

    tracksList = tracksResponse.items.map( (item: { track: Track; }) => item.track);

    return tracksList;
}

export async function getRecommendations(seeds : Seed[], recommendationProperties : Property[]) {
    const recommendationsRequest = createGetRequest();

    let recommendations : string[] = [];

    let genreSeeds : string[] = [];
    let trackSeeds : string[] = [];
    let artistSeeds : string[] = [];

    seeds.forEach(seed => {
        switch(seed.type) {
            case SeedType.Genre:
                genreSeeds.push(seed.id);
                break;
            case SeedType.Track:
                trackSeeds.push(seed.id);
                break;
            case SeedType.Artist:
                artistSeeds.push(seed.id);
                break;
        }
    });

    let recommendationParams : any = {
        seed_genres: genreSeeds.join(","),
        seed_tracks: trackSeeds.join(","),
        seed_artists: artistSeeds.join(",")
    };

    for(const property of recommendationProperties) {
        recommendationParams[property.name] = property.value;
    }

    const searchParams = new URLSearchParams(recommendationParams);

    let searchParamsString = searchParams.toString();

    const recommendationsResponse : Recommendations = await sendRequest(`https://api.spotify.com/v1/recommendations?${searchParamsString}`, 
                                                                        recommendationsRequest);

    console.log(recommendationsResponse);
    return recommendationsResponse.tracks;
}

export async function createPlaylist(user : PublicUser, recommendations : string[], newPlaylistName : string) {
    let playlistCreateRequest = createPostRequest({
        name: newPlaylistName
    });

    const playlistCreateResponse = await sendRequest(`https://api.spotify.com/v1/users/${user.id}/playlists`, playlistCreateRequest);
 
    let addItemsRequest = createPostRequest({
        uris: recommendations
    });

    await sendRequest(`https://api.spotify.com/v1/playlists/${playlistCreateResponse.id}/tracks`, addItemsRequest);
}

export async function getUser() : Promise<PublicUser>  {
    return await sendRequest('https://api.spotify.com/v1/me', createGetRequest());
}

export async function getPlaylists(user : PublicUser) : Promise<SimplifiedPlaylist[]> {
    const playlists = await sendRequest(`https://api.spotify.com/v1/users/${user.id}/playlists?offset=0&limit=40`, createGetRequest());
    
    return playlists.items;
}

export async function getRecommendationGenres() : Promise<string[]> {
    const genresResponse = await sendRequest(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, createGetRequest());
    
    return genresResponse.genres;
}