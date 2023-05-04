<script lang="ts">
  import Icon from "@iconify/svelte";
  import daysPast from "../../stores/daysPast";
  import daysRemaining from "../../stores/daysRemaining";
  import debits from "../../stores/debits";
  import loading from "../../stores/loading";
  import money from "../../stores/money";

  let error = "";

  $: perDayAmount = Math.floor((($money - $debits) / $daysRemaining) * 100) / 100;

  const table = [
    ["Days past", $daysPast.toString()],
    ["Days Remaining", $daysRemaining.toString()],
  ];
</script>

<div class="flex h-full flex-col items-center p-2">
  <div class="my-8 flex items-end gap-2 p-4">
    <h1
      class="unstyled select-none bg-gradient-to-tr from-primary-400 to-secondary-300 box-decoration-clone bg-clip-text text-5xl font-black text-transparent lg:text-7xl {error
        ? 'text-red-500'
        : ''}"
    >
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
