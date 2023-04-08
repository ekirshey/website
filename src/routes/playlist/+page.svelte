<script>
// @ts-nocheck
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { getUser, getPlaylists, getPlaylistTracks, getRecommendations, createPlaylist } from '$lib/spotifyApi.js'

    let accessToken;

    let user;
    let playlistItems = [];

    /** @type {any} */
    let selectedPlaylist;

    let newPlaylistName = '';

    onMount(async () => {
        accessToken = localStorage.getItem('access-token');
        if(!accessToken) {
            goto('/playlist/login');
            return;
        }

        //await refreshAccessToken();
        user = await getUser();
        playlistItems = await getPlaylists(user);
	});

    async function handleSubmit() {
        let playlistTracks = await getPlaylistTracks(selectedPlaylist);
        let recommendations = await getRecommendations(playlistTracks);
        await createPlaylist(user, recommendations, newPlaylistName);
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
