<script lang="ts">
    import RecommendationSeeds from "$lib/RecommendationSeeds.svelte";
    import type { SimplifiedTrack } from "spotify-types";
    import { getRecommendations } from "./spotifyApi";
    import { seeds } from "./stores";

    let recommendations : SimplifiedTrack[] = [];

    async function getRecommendationsClicked() {
        let newTracks = await getRecommendations($seeds);
        recommendations = recommendations.concat(newTracks);
    }

    function removeRecommendation(index : number) {
        recommendations.splice(index, 1);
        recommendations = recommendations;
    }
    
    function clearRecommendations() {
        recommendations = [];
    }

</script>

<div>
    <RecommendationSeeds/>
</div>
<div>
    <button disabled={$seeds.length === 0} on:click={getRecommendationsClicked}>Get Recommendations</button>
    <button disabled={$seeds.length === 0} on:click={clearRecommendations}>Clear Recommendations</button>
</div>
<div>
    <table>
        {#each recommendations as recommendation, index}
            <tr>
                <td>
                    {recommendation.name}
                </td>
                <td>
                    <a href={recommendation.external_urls.spotify}>Play</a>
                </td>
                <td>
                    <button on:click={() => removeRecommendation(index)}>X</button>
                </td>
            </tr>
        {/each}
    </table>
</div>

