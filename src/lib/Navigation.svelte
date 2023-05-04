<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<nav class="flex flex-col gap-2 p-4 lg:gap-0 lg:p-0">
  <button
    class="flex items-center justify-center p-4 rounded-token lg:flex-col lg:!rounded-none lg:hover:bg-primary-hover-token {$page
      .url.pathname === '/'
      ? '!bg-primary-active-token'
      : ''}"
    on:click={() => {
      goto("/");
      dispatch("click");
    }}><Icon icon="akar-icons:home-alt1" /><span class="text-sm">Home</span></button
  >
  <button
    class="flex items-center justify-center p-4 rounded-token lg:flex-col lg:!rounded-none lg:hover:bg-primary-hover-token {$page
      .url.pathname === '/config'
      ? '!bg-primary-active-token'
      : ''}"
    on:click={() => {
      goto("/config");
      dispatch("click");
    }}><Icon icon="akar-icons:settings-horizontal" /><span class="text-sm">Config</span></button
  >
</nav>
