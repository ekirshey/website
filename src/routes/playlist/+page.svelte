<script lang="ts">
    import Sources from "$lib/Sources.svelte";
    import Recommender from "$lib/Recommender.svelte";
    import {sourceTracks} from "$lib/stores"

    export let data;
</script>

<h1>Playlist Builder</h1>

{#if $sourceTracks.length == 0 && data.user}
    <Sources user={data.user} />
{:else}
    <Recommender />
{/if}

