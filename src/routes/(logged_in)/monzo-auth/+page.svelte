<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { redirect } from "@sveltejs/kit";
  import { httpsCallable } from "firebase/functions";
  import { onMount } from "svelte";
  import { functions } from "../../../firebase";
  import checkMonzoAuthentication from "../../../lib/checkMonzoAuthentication";
  import createMonzoRedirectLink from "../../../lib/createMonzoRedirectLink";
  import monzo from "../../../stores/monzo";

  let success = false;
  let loading = true;

  onMount(() => {
    const authCode = $page.url.searchParams.get("code");
    handleCode(authCode);
  });

  async function handleCode(authCode: string | null) {
    if (!authCode) {
      console.error("No auth code found");
      loading = false;
      return;
    } else {
      console.log("Got code");
      monzo.updateCode(authCode);
    }

    // Get access token
    const response = await httpsCallable<{ code: string; redirectUri: string }, any>(
      functions,
      "exchangeCodeForMonzoAccessToken",
    )({
      code: authCode,
      redirectUri: createMonzoRedirectLink(),
    });

    const isAlreadyAuthed = await checkMonzoAuthentication();

    if (!response.data?.body?.monzoAccessToken) {
      console.error("No access token found from response");

      if (isAlreadyAuthed) {
        console.log("Already logged in");
        success = true;
        redirect(300, "/");
        return;
      } else {
        console.warn("User is not already logged in");
      }

      console.error("No access token found");
      loading = false;
      return;
    }

    await monzo.updateAccessToken(response.data.body.monzoAccessToken);
    loading = false;
    success = true;
  }
</script>

<div class="flex items-center justify-center">
  <div class="card m-16 space-y-2 rounded-md p-8">
    <h1 class="unstyled select-none text-5xl font-black lg:text-7xl">
      {loading ? "Loading..." : success ? "Authorization Successful" : "Authorization Failed"}
    </h1>
    {#if !loading}
      <p class="text-center">{success ? "Now, accept the Monzo request" : "Please try again..."}</p>
      <a
        class="btn variant-ghost w-full"
        on:click={() => {
          goto("/");
        }}>Done.</a
      >
    {/if}
  </div>
</div>
