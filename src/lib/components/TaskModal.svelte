<script>
  import { createEventDispatcher, onMount } from 'svelte';
  export let task;
  export let boardId;
  const dispatch = createEventDispatcher();
  let details = null;
  let comments = [];
  let newComment = '';
  let loading = true;
  let error = '';
  let dueDateInput = '';
  let users = [];
  let assigneeInput = '';

  $:
    dueDateInput = details && details.dueDate
      ? new Date(details.dueDate).toISOString().slice(0, 10)
      : '';

  async function fetchDetails() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`/app/tasks/board/${boardId}/task/${task.id}`);
      if (!res.ok) throw new Error('Failed to load task details');
      const data = await res.json();
      details = data.task;
      // For Kanban tasks, comments come from BoardTaskActivity
      comments = (data.comments || []).map(c => ({
        author: c.author,
        content: c.content,
        createdAt: c.createdAt
      }));
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch(`/app/tasks/board/${boardId}/users`);
      if (!res.ok) throw new Error('Failed to load users');
      users = await res.json();
    } catch (e) {
      error = e.message;
    }
  }

  async function addComment() {
    if (!newComment.trim()) return;
    const res = await fetch(`/app/tasks/board/${boardId}/task/${task.id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment })
    });
    if (res.ok) {
      newComment = '';
      await fetchDetails();
    }
  }

  async function updateDueDate(e) {
    const newDate = e.target.value;
    if (!newDate) return;
    try {
      const res = await fetch(`/app/tasks/board/${boardId}/task/${task.id}/due-date`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: newDate })
      });
      if (!res.ok) throw new Error('Failed to update due date');
      await fetchDetails();
    } catch (e) {
      error = e.message;
    }
  }

  async function updateAssignee(e) {
    const userId = e.target.value;
    if (!userId) return;
    try {
      const res = await fetch(`/app/tasks/board/${boardId}/task/${task.id}/assignee`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigneeId: userId })
      });
      if (!res.ok) throw new Error('Failed to update assignee');
      await fetchDetails();
    } catch (e) {
      error = e.message;
    }
  }

  onMount(() => {
    fetchDetails();
    fetchUsers();
  });
</script>

<button type="button" class="modal-backdrop" on:click={() => dispatch('close')} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch('close')} aria-label="Close modal" tabindex="0"></button>
<div class="modal">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <h2>{details.title}</h2>
    <p>{details.description}</p>
    <div style="margin-bottom: 0.5rem;">
      <label for="due-date"><b>Due:</b></label>
      <input id="due-date" type="date" bind:value={dueDateInput} on:change={updateDueDate} />
      <span style="margin-left: 0.5em; color: #888; font-size: 0.95em;">{details.dueDate ? new Date(details.dueDate).toLocaleString() : '—'}</span>
    </div>
    <div style="margin-bottom: 0.5rem;">
      <label for="assignee"><b>Assigned to:</b></label>
      <select id="assignee" bind:value={assigneeInput} on:change={updateAssignee}>
        <option value="">Unassigned</option>
        {#each users as user}
          <option value={user.id}>{user.name} ({user.email})</option>
        {/each}
      </select>
      <span style="margin-left: 0.5em; color: #888; font-size: 0.95em;">{details.assignee?.name || 'Unassigned'}</span>
    </div>
    <h3>Activity & Comments</h3>
    <ul class="comments">
      {#each comments as c}
        <li><b>{c.author.name}:</b> {c.content} <span class="date">{new Date(c.createdAt).toLocaleString()}</span></li>
      {/each}
    </ul>
    <form on:submit|preventDefault={addComment}>
      <textarea bind:value={newComment} placeholder="Add a comment..." rows="2"></textarea>
      <button type="submit">Comment</button>
    </form>
    <button class="close" on:click={() => dispatch('close')}>Close</button>
  {/if}
</div>

<style>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
}
.modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #f4f5f7;
  padding: 2.5rem 2.2rem 2rem 2.2rem;
  border-radius: 14px;
  z-index: 1001;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: 0 8px 32px 0 rgba(9,30,66,.22), 0 1.5px 4px rgba(9,30,66,.10);
  border: 1.5px solid #e2e4ea;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.modal h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #172b4d;
  margin-bottom: 0.2rem;
}
.modal p {
  color: #344563;
  margin-bottom: 0.2rem;
}
.modal h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #253858;
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
}
.comments {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 1px 3px rgba(9,30,66,.07);
  border: 1px solid #e2e4ea;
}
.comments li {
  margin-bottom: 0.5rem;
  padding: 0.6rem 1rem 0.4rem 1rem;
  border-bottom: 1px solid #f4f5f7;
  font-size: 0.98rem;
}
.comments li:last-child {
  border-bottom: none;
}
.date {
  color: #888;
  font-size: 0.85em;
  margin-left: 0.5em;
}
form textarea {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #b6bac2;
  padding: 0.5rem 0.7rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  background: #fff;
  resize: vertical;
  min-height: 40px;
}
form button[type="submit"] {
  background: #5aac44;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
form button[type="submit"]:hover {
  background: #519839;
}
.close {
  margin-top: 1rem;
  background: #e0e0e0;
  color: #253858;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  align-self: flex-end;
}
.close:hover {
  background: #b6bac2;
}
.error {
  color: #c00;
}
</style>
