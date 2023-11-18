<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { Tab, TabGroup, toastStore } from "@skeletonlabs/skeleton";
  import {
    createUserWithEmailAndPassword,
    getRedirectResult,
    signInWithEmailAndPassword,
    signInWithRedirect,
  } from "firebase/auth";
  import { onMount } from "svelte";
  import { auth, googleProvider } from "../../firebase";

  let email = "";
  let password = "";

  let type: "login" | "signup" = "login";

  let errors = {
    email: "",
    password: "",
  };
  let isSubmitting = false;

  function validate() {
    if (!email) {
      errors.email = "Email is required";
    } else {
      errors.email = "";
    }

    if (!password) {
      errors.password = "Password is required";
    } else {
      errors.password = "";
    }

    return Object.values(errors).every((error) => !error);
  }

  async function submit() {
    const valid = validate();

    if (!valid) {
      // return;
    }

    if (type === "login") {
      try {
        const authUser = await signInWithEmailAndPassword(auth, email, password);

        if (!authUser.user.email) {
          throw new Error("No user found");
        }

        goto("/");
        return;
      } catch (e) {
        console.error(e);
        toastStore.trigger({
          message: "Error logging in",
          background: "variant-filled-error",
        });
      }
    } else {
      try {
        const authUser = await createUserWithEmailAndPassword(auth, email, password);

        if (!authUser.user.email) {
          throw new Error("No user found");
        }

        goto("/");
        return;
      } catch (e) {
        console.error(e);
        toastStore.trigger({
          message: "Error creating account",
          background: "variant-filled-error",
        });
      }
    }
  }

  async function googleSignIn() {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (e) {
      console.error(e);
      toastStore.trigger({
        message: "Error signing in with Google",
        background: "variant-filled-error",
      });
    }
  }

  onMount(async () => {
    // After returning from the redirect when your app initializes you can obtain the result
    const result = await getRedirectResult(auth);
    if (result) {
      if (!result.user.email) {
        throw new Error("No user found");
      }

      goto("/");
    } else {
      console.log("No redirect result");
    }
  });
</script>

<div class="flex h-full items-center justify-center">
  <form
    class="card flex flex-col gap-2 p-4"
    on:submit={() => {
      isSubmitting = true;
      submit().finally(() => {
        isSubmitting = false;
      });
    }}
  >
    <TabGroup justify="justify-center">
      <Tab bind:group={type} name="login" value="login">Login</Tab>
      <Tab bind:group={type} name="signup" value="signup">Sign Up</Tab>
    </TabGroup>
    <label class="label">
      <span>Email</span>
      <input
        disabled={isSubmitting}
        class="input {errors.email && 'input-error'}"
        type="email"
        bind:value={email}
        placeholder="email@address.com"
        autocomplete="email"
      />
    </label>
    <label class="label">
      <span>Password</span>
      <input
        disabled={isSubmitting}
        class="input {errors.password && 'input-error'}"
        type="password"
        bind:value={password}
        placeholder="**********"
        autocomplete="current-password"
      />
    </label>
    <div class="flex gap-2">
      <button
        class="btn variant-ghost"
        type="button"
        on:click={() => {
          googleSignIn();
        }}
      >
        <Icon icon="akar-icons:google-fill" />
      </button>
      <button disabled={isSubmitting} class="btn variant-filled flex-1" type="submit"
        >{isSubmitting ? "Loading..." : type === "login" ? "Login" : "Sign Up"}</button
      >
    </div>
  </form>
</div>
