<script lang="ts">
    import { setupCanvas } from "./maptest";
    import { onMount } from 'svelte';

    "use client";

    let canvas: HTMLCanvasElement | null = null;
    let data: any = null;

    const url = 'https://2kzy6vjjm1.execute-api.us-west-2.amazonaws.com/-dev-665d038/Grub%20Fantasy%20Realm?map=true';

    onMount(() => {
        // Fetch data only on the client side
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(json => {
                data = json;
                console.log("Data fetched:", data);
                if (canvas) {
                    console.log("Setting up canvas with data:", data);
                    setupCanvas(canvas, data, 'Grub Fantasy Realm');
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    });
</script>

<div style="width: 100%; height: 100vh; overflow: hidden;">
    <canvas bind:this={canvas} style="margin-left: auto; margin-right: auto;"></canvas>
</div>