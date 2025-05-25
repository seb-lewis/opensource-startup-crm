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

  function handleSubmit(e) {
    e.preventDefault();
    addComment();
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

<button type="button" class="modal-backdrop" onclick={() => dispatch('close')} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch('close')} aria-label="Close modal" tabindex="0"></button>
<div class="modal">
  {#if loading}
    <div class="modal-loading">
      <span class="loader"></span>
      <span>Loading...</span>
    </div>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <div class="modal-header">
      <h2>{details.title}</h2>
      <span class="status-badge {details.completed ? 'completed' : 'open'}">{details.completed ? 'Completed' : 'Open'}</span>
      <button class="close-icon" onclick={() => dispatch('close')} aria-label="Close">×</button>
    </div>
    <p class="modal-description">{details.description}</p>
    <div class="modal-section">
      <label for="due-date"><b>Due:</b></label>
      <input id="due-date" type="date" bind:value={dueDateInput} onchange={updateDueDate} />
      <span class="date-info">{details.dueDate ? new Date(details.dueDate).toLocaleDateString() : '—'}</span>
    </div>
    <div class="modal-section">
      <label for="assignee"><b>Assigned to:</b></label>
      <select id="assignee" bind:value={assigneeInput} onchange={updateAssignee}>
        <option value="">Unassigned</option>
        {#each users as user}
          <option value={user.id}>{user.name} ({user.email})</option>
        {/each}
      </select>
      <span class="assignee-info">{details.assignee?.name || 'Unassigned'}</span>
    </div>
    <h3 class="modal-section-title">Activity & Comments</h3>
    <ul class="comments">
      {#each comments as c}
        <li class="comment-item">
          {#if c.author.avatar}
            <img src={c.author.avatar} alt={c.author.name} class="comment-avatar" />
          {/if}
          <div class="comment-content">
            <b>{c.author.name}:</b> {c.content}
            <span class="date">{new Date(c.createdAt).toLocaleString()}</span>
          </div>
        </li>
      {/each}
    </ul>
    <form class="comment-form" onsubmit={handleSubmit}>
      <textarea bind:value={newComment} placeholder="Add a comment..." rows="2"></textarea>
      <button type="submit">Comment</button>
    </form>
    <button class="close" onclick={() => dispatch('close')}>Close</button>
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
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.status-badge {
  font-size: 0.95rem;
  padding: 0.2em 0.8em;
  border-radius: 0.7em;
  font-weight: 600;
  background: #e0e7ff;
  color: #3730a3;
  margin-left: 0.5em;
}
.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}
.status-badge.open {
  background: #fee2e2;
  color: #b91c1c;
}
.close-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  margin-left: auto;
  margin-right: -0.5rem;
  margin-top: -0.5rem;
  transition: color 0.15s;
}
.close-icon:hover {
  color: #2563eb;
}
.modal-description {
  color: #344563;
  margin-bottom: 0.7rem;
  font-size: 1.05rem;
}
.modal-section {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.date-info, .assignee-info {
  margin-left: 0.5em;
  color: #888;
  font-size: 0.95em;
}
.modal-section-title {
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #253858;
}
.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
  padding: 0.6rem 1rem 0.4rem 1rem;
  border-bottom: 1px solid #f4f5f7;
  font-size: 0.98rem;
}
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 2px;
}
.comment-content {
  flex: 1;
}
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.comment-form textarea {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #b6bac2;
  padding: 0.5rem 0.7rem;
  font-size: 1rem;
  background: #fff;
  resize: vertical;
  min-height: 40px;
}
.comment-form button[type="submit"] {
  align-self: flex-end;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.comment-form button[type="submit"]:hover {
  background: #1d4ed8;
}
.modal-loading {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: center;
  min-height: 120px;
}
.loader {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.modal-loading span {
  color: #2563eb;
}
.error {
  color: #c00;
}
</style>
