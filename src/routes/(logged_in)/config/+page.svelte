<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { doc, setDoc } from "firebase/firestore";
  import { onMount } from "svelte";
  import { firestore } from "../../../firebase";
  import dayCount from "../../../stores/dayCount";
  import debits from "../../../stores/debits";
  import internalNote from "../../../stores/internalNote";
  import money from "../../../stores/money";
  import startDate from "../../../stores/startDate";

  let isSaving = false;

  let inputMoney = 0;
  let inputDate = new Date().toISOString().slice(0, 10);
  let inputDebits = 0;
  let inputDayCount = 0;
  let inputInternalNote = "";

  onMount(async () => {
    inputMoney = $money;
    inputDate = new Date($startDate).toISOString().slice(0, 10);
    inputDebits = $debits;
    inputDayCount = $dayCount;
    inputInternalNote = $internalNote;
  });

  function submit() {
    isSaving = true;

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
        goto("/");
      });
  }
</script>

<div class="flex flex-col p-2">
  <form class="card flex flex-col gap-2 p-4" on:submit={submit}>
    <label class="label">
      <span>Amount</span>
      <input bind:value={inputMoney} class="input" type="number" step="0.01" />
    </label>
    <label class="label">
      <span>Debits</span>
      <input bind:value={inputDebits} class="input" type="number" step="0.01" />
    </label>
    <label class="label">
      <span>Start date</span>
      <input type="date" class="input" bind:value={inputDate} />
    </label>
    <label class="label">
      <span>Day Count</span>
      <input bind:value={inputDayCount} type="number" class="input" />
    </label>
    <label class="label">
      <span>Internal Note</span>
      <textarea class="textarea" rows="4" bind:value={inputInternalNote} placeholder="Notes" />
    </label>
    <button class="btn variant-filled" type="submit" disabled={isSaving}>
      <Icon icon="akar-icons:save" />
      <span>{isSaving ? "Saving..." : "Save"}</span>
    </button>
  </form>
</div>
