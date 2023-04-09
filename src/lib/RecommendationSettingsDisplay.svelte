<script lang="ts">
    import { availableProperties, type Property } from "./recommendationSettings";


    let selectedProperty : Property;

    function handleAddProperty() {
        recommendationProperties = [...recommendationProperties, selectedProperty];
    }

    function imposeMinMax(property : Property) {
        if(property.min && property.value < property.min) {
            property.value = property.min;
        }
        else if(property.max && property.value > property.max) {
            property.value = property.max;
        }
    }

    export let recommendationProperties : Property[];
</script>


<div>
    <div>
        <form on:submit|preventDefault={handleAddProperty}>
            <select bind:value={selectedProperty}>
                {#each availableProperties as property}
                    <option value={property}>
                        {property.name}
                    </option>
                {/each}
            </select>
            <button disabled={recommendationProperties.includes(selectedProperty)} type=submit>Add Prop</button>
        </form>
    </div>
    <div>
        {#each recommendationProperties as property}
            <div>
                <label for={property.name}>{property.name}</label>
                <input name={property.name} 
                       type=number 
                       step={property.integer ? 1 : null} 
                       min={property.min !== undefined ? property.min : null} 
                       max={property.max !== undefined ? property.max : null} bind:value={property.value}
                       on:input={() => imposeMinMax(property)}
                       on:blur={() => imposeMinMax(property)}>
            </div>
        {/each}
    </div>
</div>