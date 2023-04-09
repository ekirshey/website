<script lang="ts">
    import RecommendationSeeds from "$lib/RecommendationSeeds.svelte";
    import type { SimplifiedTrack } from "spotify-types";
    import { getRecommendations } from "./spotifyApi";
    import { seeds } from "./stores";
    import { getSimplifiedArtistsName } from "./trackUtility";
    import RecommendationSettingsDisplay from "./RecommendationSettingsDisplay.svelte";
    import type { Property } from "./recommendationSettings";

    let recommendations : SimplifiedTrack[] = [];
    let recommendationProperties : Property[] = []

    async function getRecommendationsClicked() {
        let newTracks = await getRecommendations($seeds, recommendationProperties);
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
    <div class="wrapperDiv">
        <div class="item">
            <RecommendationSeeds />
        </div>
        <div class="item">
            <RecommendationSettingsDisplay bind:recommendationProperties />
        </div>
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
                        {recommendation.name} by {getSimplifiedArtistsName(recommendation.artists)}
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
</div>

<style>
    .wrapperDiv {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .item {
        padding-right: 50px;
        align-self: stretch;
    }
</style>