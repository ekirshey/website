<script lang="ts">
    import type { PublicUser, SimplifiedPlaylist, Track } from "spotify-types";
    import { getPlaylistTracks, getPlaylists, getRecommendationGenres } from "./spotifyApi";
    import { sourceArtists, sourceGenres, sourceTracks } from "$lib/stores";

    enum SourceType {
        Empty,
        Playlist
    }

    interface Source {
        type: SourceType,
        name: string
    }

    export let user : PublicUser;

    let playlists : SimplifiedPlaylist[] = [];
    let selectedPlaylist : SimplifiedPlaylist;

    let sourceTypes : Source[] = [
        {type: SourceType.Empty, name: "Empty"}, 
        {type: SourceType.Playlist, name: "Playlists"}
    ]

    let sourceType : Source = sourceTypes[0];

    $: sourceType.type !== SourceType.Playlist && loadPlaylists();

    async function loadPlaylists() {
        if (playlists.length > 0 || !user) return;
        playlists = await getPlaylists(user);
    }

    async function handleSubmit() {
        $sourceGenres= await getRecommendationGenres();

        switch(sourceType.type) {
            case SourceType.Empty:
                break;
            case SourceType.Playlist:
                $sourceTracks = await getPlaylistTracks(selectedPlaylist);
                $sourceTracks.forEach(el => {
                    el.artists.forEach(artist => {
                        $sourceArtists = [...$sourceArtists, artist];
                    })
                });
                break;
        }
	}

</script>

<p>Define a source for seed tracks</p>
<form on:submit|preventDefault={handleSubmit}>
	<select bind:value={sourceType}>
		{#each sourceTypes as sourceType}
			<option value={sourceType}>
				{sourceType.name}
			</option>
		{/each}
	</select>

    {#if sourceType.type === SourceType.Playlist}
        <select bind:value={selectedPlaylist}>
            {#each playlists as playlist}
                <option value={playlist}>
                    {playlist.name}
                </option>
            {/each}
        </select>
    {/if}

	<button type=submit>
		Submit
	</button>
</form>