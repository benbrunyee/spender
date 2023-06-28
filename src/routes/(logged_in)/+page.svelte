<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import createMonzoAuthLink from "../../lib/createMonzoAuthLink";
  import fetchMonzo from "../../lib/fetchMonzo";
  import daysPast from "../../stores/daysPast";
  import daysRemaining from "../../stores/daysRemaining";
  import debits from "../../stores/debits";
  import loading from "../../stores/loading";
  import money from "../../stores/money";
  import monzo from "../../stores/monzo";

  let error = "";
  const table = [
    ["Days past", $daysPast.toString()],
    ["Days Remaining", $daysRemaining.toString()],
  ];

  $: perDayAmount = Math.floor((($money - $debits) / $daysRemaining) * 100) / 100;

  onMount(() => {
    if ($monzo.accessToken) {
      loadMonzoBalance();
    }
  });

  async function loadMonzoBalance() {
    const accountId = await loadMonzoAccountId();

    if (!accountId) {
      error = "No account found";
      return;
    }
    console.debug("Account ID", accountId);

    const balance = await loadMonzoAccountBalance(accountId);

    if (!balance) {
      error = "Failed to load balance";
      return;
    }
    console.debug("Balance", balance);

    money.updateMoney(balance);
  }

  async function loadMonzoAccountId() {
    if (!$monzo.accessToken) {
      error = "No access token found";
      return;
    }

    let accountsResponse: any;

    try {
      accountsResponse = await fetchMonzo("accounts", $monzo.accessToken);
    } catch (e) {
      console.error(e);
      error = "Failed to load account";
      return;
    }

    if (!accountsResponse.ok) {
      error = "Failed to load account";
      return;
    }

    const accounts = await accountsResponse.json();
    const firstAccount = accounts.accounts.find(
      (account: any) => account.type === "uk_retail" && account.closed === false,
    );

    if (!firstAccount) {
      error = "No account found";
      return;
    }

    return firstAccount.id;
  }

  async function loadMonzoAccountBalance(accountId: string) {
    let accountBalanceResponse: any;
    try {
      accountBalanceResponse = await fetchMonzo("balance", $monzo.accessToken, {
        account_id: accountId,
      });
    } catch (e) {
      console.error(e);
      error = "Failed to load balance";
      return;
    }

    if (!accountBalanceResponse.ok) {
      error = "Failed to load balance";
      return;
    }

    const accountBalance = await accountBalanceResponse.json();

    if (!accountBalance.balance) {
      error = "Failed to load balance";
      return;
    }

    const balance = accountBalance.balance / 100;
    return balance;
  }
</script>

<div class="flex h-full flex-col items-center p-2">
  <a class="btn variant-ghost mt-2 w-full" href={createMonzoAuthLink()}>
    <Icon icon="akar-icons:bank" />
    <span>Authorize Monzo</span></a
  >

  <div class="my-8 flex items-end gap-2 p-4">
    <h1 class="unstyled select-none text-5xl font-black lg:text-7xl {error ? 'text-red-500' : ''}">
      {error ? error : $loading ? "Loading..." : `£${isNaN(perDayAmount) ? 0 : perDayAmount}`}
    </h1>
    {#if !error && !$loading}
      <span class="select-none">Per day</span>
    {/if}
  </div>

  <div class="table-container">
    <table class="table-compact table">
      <tbody>
        {#each table as row}
          <tr>
            {#each row as cell}
              <td>{cell}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <a class="btn variant-ghost mt-2 w-full" href="/config">
    <Icon icon="akar-icons:pencil" />
    <span>Configure</span></a
  >
</div>
