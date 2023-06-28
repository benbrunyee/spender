<script lang="ts">
  import Icon from "@iconify/svelte";
  import {
    AppBar,
    AppRail,
    AppShell,
    Avatar,
    Drawer,
    drawerStore,
    popup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";

  import { goto } from "$app/navigation";
  import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
  import { onMount } from "svelte";
  import Navigation from "../../compontents/Navigation.svelte";
  import { auth, firestore } from "../../firebase";
  import dayCount from "../../stores/dayCount";
  import daysPast from "../../stores/daysPast";
  import daysRemaining from "../../stores/daysRemaining";
  import debits from "../../stores/debits";
  import internalNote from "../../stores/internalNote";
  import loading from "../../stores/loading";
  import money from "../../stores/money";
  import monzo from "../../stores/monzo";
  import startDate from "../../stores/startDate";
  import tilePage from "../../stores/tilePage";

  const userMenuPoppup: PopupSettings = {
    event: "click",
    target: "user-menu",
  };

  // daysRemaining = Start date + dayCount - current date + 1
  $: $daysRemaining =
    Math.floor(
      ($startDate.valueOf() + 1000 * 60 * 60 * 24 * $dayCount - new Date().valueOf()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  // daysPast = Days past of the current month
  $: $daysPast = Math.floor((new Date().valueOf() - $startDate.valueOf()) / (1000 * 60 * 60 * 24));

  onMount(async () => {
    if (!auth.currentUser) {
      goto("/login");
      return;
    }

    $loading = true;

    let docRef: DocumentSnapshot | undefined;
    try {
      docRef = await getDoc(doc(firestore, "data", auth.currentUser.uid));
    } catch (e) {
      console.error(e);
    }

    if (!docRef?.exists()) {
      $loading = false;
      return;
    }

    const data = docRef.data();

    $money = data.money ?? 0;

    $startDate = data.startDate ? new Date(data.startDate) : new Date();
    $debits = data.debits ?? 0;
    $dayCount = data.dayCount ?? 0;
    $internalNote = data.internalNote ?? "";
    $monzo.accessToken = data.monzoAccessToken ?? "";

    $loading = false;
  });
</script>

<AppShell slotSidebarLeft="hidden lg:block">
  <svelte:fragment slot="header">
    <AppBar slotLead="lg:hidden">
      <svelte:fragment slot="lead">
        <button
          class="btn-icon variant-soft"
          on:click={() => {
            drawerStore.open();
          }}><Icon icon="mdi:hamburger" /></button
        >
        <Drawer
          ><Navigation
            on:click={() => {
              drawerStore.close();
            }}
          /></Drawer
        >
      </svelte:fragment>
      <strong>Big Spender</strong>
      <svelte:fragment slot="trail">
        <div class="relative ml-auto">
          {#if auth.currentUser}
            <button use:popup={userMenuPoppup}>
              <Avatar
                initials={auth.currentUser?.email?.charAt(0).toUpperCase() ?? "?"}
                cursor="cursor-pointer"
                class="border-4 border-surface-300-600-token hover:!border-primary-500"
              />
            </button>
            <div class="card p-4" data-popup="user-menu">
              {#if auth.currentUser}
                <button
                  class="btn variant-soft"
                  on:click={() => {
                    auth.signOut();
                    goto("/login");
                  }}>Logout</button
                >
              {:else}
                <a class="btn variant-soft" href="/login">Login</a>
              {/if}
            </div>
          {/if}
        </div>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <AppRail selected={tilePage}>
      <Navigation />
    </AppRail>
  </svelte:fragment>
  <svelte:fragment slot="pageFooter" />
  {#if !$loading && auth.currentUser}
    <slot />
  {/if}
  {#if !auth.currentUser}
    <div class="flex h-full items-center justify-center">
      <span>You are being redirected</span>
    </div>
  {/if}
</AppShell>
