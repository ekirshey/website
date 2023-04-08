<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import type { PublicUser, SimplifiedPlaylist } from "spotify-types";
    import { createPlaylist, getPlaylistTracks, getPlaylists, getRecommendations, getUser  } from "$lib/spotifyApi";

    let accessToken;

    let user : PublicUser;
    let playlistItems : SimplifiedPlaylist[] = [];

    let selectedPlaylist : SimplifiedPlaylist;

    let newPlaylistName : string = '';

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
