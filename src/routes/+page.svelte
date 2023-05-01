<script>
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { onMount } from "svelte";
  import { firestore } from "../firebase";
  import dayCount from "../stores/dayCount";
  import debits from "../stores/debits";
  import internalNote from "../stores/internalNote";
  import money from "../stores/money";
  import startDate from "../stores/startDate";

  let loading = true;
  let error = "";
  let isSaving = false;

  let inputMoney = 0;
  let inputDate = new Date().toISOString().slice(0, 10);
  let inputDebits = 0;
  let inputDayCount = 0;
  let inputInternalNote = "";

  // daysPast = Days past of the current month
  $: daysPast = Math.floor((new Date().valueOf() - $startDate.valueOf()) / (1000 * 60 * 60 * 24));

  // daysRemaining = Start date + dayCount - current date + 1
  $: daysRemaining =
    Math.floor(
      ($startDate.valueOf() + 1000 * 60 * 60 * 24 * $dayCount - new Date().valueOf()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  $: perDayAmount = Math.floor((($money - $debits) / daysRemaining) * 100) / 100;

  onMount(async () => {
    const docRef = await getDoc(doc(firestore, "data", "data"));

    if (!docRef.exists()) {
      error = "Could not find data";
      loading = false;
      return;
    }

    const data = docRef.data();

    $money = data.money ?? 0;
    inputMoney = data.money ?? 0;

    $startDate = data.startDate ? new Date(data.startDate) : new Date();
    inputDate = data.startDate
      ? new Date(data.startDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    $debits = data.debits ?? 0;
    inputDebits = data.debits ?? 0;

    $dayCount = data.dayCount ?? 0;
    inputDayCount = data.dayCount ?? 0;

    $internalNote = data.internalNote ?? "";
    inputInternalNote = data.internalNote ?? "";

    loading = false;
  });
</script>

<div
  class="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-tr from-neutral-950 to-neutral-900 text-white"
>
  <div class="flex items-end gap-2">
    <h1 class="text-7xl font-black {error ? 'text-red-500' : ''}">
      {error ? error : loading ? "Loading..." : `£${perDayAmount}`}
    </h1>
    {#if !error && !loading}
      <span>Per day</span>
    {/if}
  </div>
  {#if !loading}
    <div class="flex flex-col gap-2">
      <form
        class="flex flex-col items-center gap-2"
        on:submit={() => {
          isSaving = true;
          error = "";

          $money = inputMoney;
          $debits = inputDebits;
          $startDate = new Date(inputDate);
          $dayCount = inputDayCount;
          $internalNote = inputInternalNote;

          setDoc(doc(firestore, "data", "data"), {
            money: inputMoney,
            debits: inputDebits,
            startDate: new Date(inputDate).toUTCString(),
            dayCount: inputDayCount,
            internalNote: inputInternalNote,
          })
            .catch((err) => {
              err = "Failed to save data";
            })
            .finally(() => {
              isSaving = false;
            });
        }}
      >
        <div class="grid grid-cols-2 items-center gap-1 text-center">
          <span>Amount:</span>
          <input
            bind:value={inputMoney}
            class="rounded-sm bg-neutral-800 py-1 text-center"
            type="number"
            step="0.01"
          />
          <span>Debits</span>
          <input
            bind:value={inputDebits}
            class="rounded-sm bg-neutral-800 py-1 text-center"
            type="number"
            step="0.01"
          />
          <span>Start date:</span>
          <input
            type="date"
            class="rounded-sm bg-neutral-800 py-1 text-center"
            bind:value={inputDate}
          />
          <span>Day Count</span>
          <input
            bind:value={inputDayCount}
            type="number"
            class="rounded-sm bg-neutral-800 py-1 text-center"
          />
          <span>Internal Note</span>
          <input
            class="rounded-sm bg-neutral-800 py-1 text-center"
            bind:value={inputInternalNote}
          />
        </div>
        <button
          class="w-full rounded-sm bg-gradient-to-tr from-neutral-900 to-neutral-800 px-4 py-1"
          type="submit">{isSaving ? "..." : "Set"}</button
        >
      </form>
      <div class="grid grid-cols-2 items-center gap-1 text-center">
        <span>Days past</span>
        <span>{daysPast}</span>
        <span>Days remaining (inc. today)</span>
        <span>{daysRemaining}</span>
      </div>
    </div>
  {/if}
</div>
