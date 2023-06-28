<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { doc, setDoc } from "firebase/firestore";
  import { onMount } from "svelte";
  import { auth, firestore } from "../../../firebase";
  import dayCount from "../../../stores/dayCount";
  import debits from "../../../stores/debits";
  import internalNote from "../../../stores/internalNote";
  import money from "../../../stores/money";
  import monzo from "../../../stores/monzo";
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
    if (!auth.currentUser?.uid) {
      console.warn("User not logged in");
      return;
    }

    isSaving = true;

    $money = inputMoney;
    $debits = inputDebits;
    $startDate = new Date(inputDate);
    $dayCount = inputDayCount;
    $internalNote = inputInternalNote;

    setDoc(doc(firestore, "data", auth.currentUser.uid), {
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
      <span>I currently have...</span>
      <div class="input-group input-group-divider grid-cols-[auto_1fr]">
        <div class="input-group-shim">£</div>
        <input
          bind:value={inputMoney}
          class="input"
          type="number"
          step="0.01"
          disabled={$monzo.isAuthenticated}
        />
      </div>
    </label>
    <label class="label">
      <span>excluding...</span>
      <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
        <div class="input-group-shim">£</div>
        <input bind:value={inputDebits} class="input" type="number" step="0.01" />
        <div class="input-group-shim">debits</div>
      </div>
    </label>
    <label class="label">
      <span>to spend over...</span>
      <div class="input-group input-group-divider grid-cols-[1fr_auto]">
        <input bind:value={inputDayCount} type="number" class="input" />
        <div class="input-group-shim"><span>days</span></div>
      </div>
    </label>
    <label class="label">
      <span>days, starting from...</span>
      <input type="date" class="input" bind:value={inputDate} />
    </label>
    <label class="label">
      <span>Notes</span>
      <textarea class="textarea" rows="4" bind:value={inputInternalNote} placeholder="Notes" />
    </label>
    <button class="btn variant-filled" type="submit" disabled={isSaving}>
      <Icon icon="akar-icons:save" />
      <span>{isSaving ? "Saving..." : "Save"}</span>
    </button>
  </form>
</div>
