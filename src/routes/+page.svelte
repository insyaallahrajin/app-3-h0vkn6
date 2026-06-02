<script lang="ts">
  import { supabase } from '$lib/supabase';
  import type { Todo } from '$lib/types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import TodoItem from '$lib/components/TodoItem.svelte';

  let user = $state<{ id: string; email: string } | null>(null);
  let todos = $state<Todo[]>([]);
  let newTodoTitle = $state('');
  let loading = $state(true);
  let error = $state('');

  $effect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        user = { id: session.user.id, email: session.user.email ?? '' };
        fetchTodos();
      } else {
        goto('/login');
      }
      loading = false;
    };
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        user = { id: session.user.id, email: session.user.email ?? '' };
        fetchTodos();
      } else {
        user = null;
        todos = [];
        goto('/login');
      }
    });

    return () => subscription.unsubscribe();
  });

  const fetchTodos = async () => {
    const { data, error: err } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    if (err) {
      error = err.message;
    } else {
      todos = data ?? [];
    }
  };

  const addTodo = async () => {
    if (!newTodoTitle.trim() || !user) return;
    const { data, error: err } = await supabase
      .from('todos')
      .insert({ title: newTodoTitle.trim(), user_id: user.id })
      .select()
      .single();
    if (err) {
      error = err.message;
    } else if (data) {
      todos = [data, ...todos];
      newTodoTitle = '';
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error: err } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id);
    if (err) {
      error = err.message;
    } else {
      todos = todos.map(t => t.id === id ? { ...t, completed } : t);
    }
  };

  const deleteTodo = async (id: string) => {
    const { error: err } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    if (err) {
      error = err.message;
    } else {
      todos = todos.filter(t => t.id !== id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    user = null;
    todos = [];
    goto('/login');
  };
</script>

{#if loading}
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Loading...</p>
  </div>
{:else if user}
  <div class="max-w-2xl mx-auto p-4">
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">To-Do List</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{user.email}</span>
        <button
          onclick={signOut}
          class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </header>

    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <form
      onsubmit={(e) => { e.preventDefault(); addTodo(); }}
      class="flex gap-2 mb-6"
    >
      <input
        type="text"
        bind:value={newTodoTitle}
        placeholder="Add a new task..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
        disabled={!newTodoTitle.trim()}
      >
        Add
      </button>
    </form>

    {#if todos.length === 0}
      <p class="text-center text-gray-500 mt-8">No tasks yet. Add one above!</p>
    {:else}
      <ul class="space-y-2">
        {#each todos as todo (todo.id)}
          <li>
            <TodoItem
              {todo}
              onToggle={(id, completed) => toggleTodo(id, completed)}
              onDelete={(id) => deleteTodo(id)}
            />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}