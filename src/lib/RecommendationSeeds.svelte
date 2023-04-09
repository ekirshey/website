<script lang="ts">
    import { SeedType, type Seed } from '$lib/recommendationSettings';
  import type { Artist } from 'spotify-types';
    import { sourceArtists, sourceGenres, sourceTracks, seeds } from './stores';
  import { getArtistsName } from './trackUtility';
    
    function addSeed() {
        $seeds.push({
            type: SeedType.Genre,
            id: $sourceGenres[0]
        });
        $seeds = $seeds;
    }

    function removeSeed(index: number) {
        $seeds.splice(index, 1)
        $seeds = $seeds;
    }

</script>

<!-- I suppose I should use css instead of a table -->
<div>
    <table>
        {#each $seeds as seed, index}
            <tr>
                <td>
                    <select bind:value={seed.type}>
                        <option value={SeedType.Genre}>
                            Genre
                        </option>
                        <option value={SeedType.Track}>
                            Track
                        </option>
                        <option value={SeedType.Artist}>
                            Artist
                        </option>
                    </select>
                </td>
                <td>
                    {#if seed.type === SeedType.Genre}
                        <select bind:value={seed.id}>
                            {#each $sourceGenres as genre}
                                <option value={genre}>
                                    {genre}
                                </option>
                            {/each}
                        </select>
                    {:else if seed.type === SeedType.Track}
                        <select bind:value={seed.id}>
                            {#each $sourceTracks as track}
                                <option value={track.id}>
                                    {track.name} by {getArtistsName(track.artists)}
                                </option>
                            {/each}
                        </select>
                    {:else if seed.type === SeedType.Artist}
                        <select bind:value={seed.id}>
                            {#each $sourceArtists as artist}
                                <option value={artist.id}>
                                    {artist.name}
                                </option>
                            {/each}
                        </select>
                    {/if}
                </td>
                <td>
                    <button on:click={() => removeSeed(index)}>X</button>
                </td>
            </tr>
        {/each}
    </table>
</div>
<div>
    <button disabled={$seeds.length === 5} on:click={addSeed}>Add Seed</button>
</div>