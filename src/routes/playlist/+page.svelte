<script>
// @ts-nocheck
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { refreshAccessToken } from "../../spotifyApi";

    let accessToken;

    let user;
    let playlistItems = [];

    /** @type {any} */
    let selectedPlaylist;

    let newPlaylistName = '';

    async function getPlaylistTracks() {
        const tracksRequest = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
        };

        const tracksResponse = await fetch(selectedPlaylist.tracks.href, tracksRequest)
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

    async function getRecommendations(tracks) {
        const recommendationsRequest = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
        };

        tracks = tracks.sort((a, b) => 0.5 - Math.random());
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

            recommendationsResponse.tracks.forEach(element => {
                recommendations.push(element.uri);
            });
            idx += 5;
        }
        
        return recommendations;
    }

    async function createPlaylist(recommendations) {
        let playlistCreateRequest = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                name: newPlaylistName
            })
        };

        const playlistCreateResponse = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, playlistCreateRequest)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            });
     
        let addItemsRequest = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                uris: recommendations
            })
        };

        const addItemsResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistCreateResponse.id}/tracks`, addItemsRequest)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            });
    }

    async function getUser() {
        const userRequest = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
        };

        user = await fetch('https://api.spotify.com/v1/me', userRequest)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })
    }

    async function getPlaylists() {
        const playlistRequest = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        };

        const playlists = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists?offset=0&limit=40`, playlistRequest)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })
        
        playlistItems = playlists.items;
    }

    onMount(async () => {
        accessToken = localStorage.getItem('access-token');
        if(!accessToken) {
            goto('/playlist/login');
            return;
        }

        //await refreshAccessToken();
        await getUser();
        await getPlaylists();
	});

    async function handleSubmit() {
        let playlistTracks = await getPlaylistTracks();
        let recommendations = await getRecommendations(playlistTracks);
        await createPlaylist(recommendations);
        alert("Playlist " + newPlaylistName + " has been created!");
	}

</script>

<h1>Playlist Builder</h1>

<form on:submit|preventDefault={handleSubmit}>
	<select bind:value={selectedPlaylist}>
		{#each playlistItems as playlist}
			<option value={playlist}>
				{playlist.name}
			</option>
		{/each}
	</select>

	<input bind:value={newPlaylistName}>

	<button disabled={!newPlaylistName} type=submit>
		Submit
	</button>
</form>
