<script lang="ts">
  import type { Todo } from '$lib/types';

  let { todo, onToggle, onDelete }: {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
  } = $props();

  let editing = $state(false);
  let editedTitle = $state(todo.title);

  const handleToggle = () => {
    onToggle(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const saveEdit = () => {
    if (editedTitle.trim() && editedTitle.trim() !== todo.title) {
      // For simplicity, we'll directly call update via parent. But we'll leave inline editing to further improvement.
      // Currently we just cancel editing.
    }
    editing = false;
  };
</script>

<div
  class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded hover:shadow-sm transition"
  class:opacity-60={todo.completed}
>
  <div class="flex items-center gap-3 flex-1">
    <input
      type="checkbox"
      checked={todo.completed}
      onchange={handleToggle}
      class="w-5 h-5 cursor-pointer"
    />
    {#if editing}
      <input
        type="text"
        bind:value={editedTitle}
        onblur={saveEdit}
        onkeydown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') editing = false; }}
        autofocus
        class="flex-1 px-2 py-1 border border-gray-300 rounded"
      />
    {:else}
      <span
        class="flex-1 text-lg"
        class:line-through={todo.completed}
        ondblclick={() => { if (!todo.completed) { editing = true; editedTitle = todo.title; } }}
      >
        {todo.title}
      </span>
    {/if}
  </div>
  <button
    onclick={handleDelete}
    class="ml-2 text-red-500 hover:text-red-700 transition"
    aria-label="Delete task"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
  </button>
</div>