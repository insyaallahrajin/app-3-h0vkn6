<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let isSignUp = $state(false);
  let error = $state('');
  let success = $state('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    error = '';
    success = '';

    if (!email.trim() || !password.trim()) {
      error = 'Email and password are required.';
      return;
    }

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });
      if (signUpError) {
        error = signUpError.message;
      } else {
        success = 'Check your email for the confirmation link!';
        // Optionally sign in automatically (if no email confirmation)
        // For simplicity, we'll show success and let user switch to sign in.
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (signInError) {
        error = signInError.message;
      } else {
        goto('/');
      }
    }
  };
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md bg-white rounded shadow-md p-8">
    <h1 class="text-2xl font-bold text-center mb-6">
      {isSignUp ? 'Sign Up' : 'Sign In'}
    </h1>

    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    {#if success}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {success}
      </div>
    {/if}

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      {#if isSignUp}
        Already have an account?
        <button
          onclick={() => { isSignUp = false; error = ''; success = ''; }}
          class="text-blue-500 hover:underline"
        >
          Sign In
        </button>
      {:else}
        Don't have an account?
        <button
          onclick={() => { isSignUp = true; error = ''; success = ''; }}
          class="text-blue-500 hover:underline"
        >
          Sign Up
        </button>
      {/if}
    </p>
  </div>
</div>