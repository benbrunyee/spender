<script lang="ts">
  // Order is important here
  import "@skeletonlabs/skeleton/themes/theme-crimson.css";

  import "@skeletonlabs/skeleton/styles/all.css";

  import "../app.postcss";

  import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
  import { Toast, storePopup } from "@skeletonlabs/skeleton";
  import { onAuthStateChanged } from "firebase/auth";
  import { onMount } from "svelte";
  import { auth } from "../firebase";
  import initializing from "../stores/initializing";

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      $initializing = false;
    });
  });
</script>

{#if !$initializing}
  <slot />
{/if}
<Toast />
