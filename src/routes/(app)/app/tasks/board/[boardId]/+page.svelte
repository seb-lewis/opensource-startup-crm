<script>
  import { onMount } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import TaskModal from '$lib/components/TaskModal.svelte';
  export let data;
  
  // Process columns and tasks to ensure each task has the required id property
  let columns = data.columns.map(col => ({
    ...col,
    tasks: col.tasks.map(task => ({ ...task }))
  }));
  
  let showTaskModal = false;
  let selectedTask = null;
  let editTaskTitle = '';
  let editingTaskId = null;
  let addingTaskColumnId = null;
  let newTaskTitle = '';
  let showColumnMenuId = null;

  function openAddCard(columnId) {
    addingTaskColumnId = columnId;
    newTaskTitle = '';
    setTimeout(() => {
      const input = document.querySelector('.add-card-input:focus') || document.querySelector('.add-card-input');
      if (input) input.focus();
    }, 0);
  }

  function closeAddCard() {
    addingTaskColumnId = null;
    newTaskTitle = '';
  }

  async function handleAddCard(e, columnId) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await fetch(`?/createTask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `title=${encodeURIComponent(newTaskTitle)}&columnId=${encodeURIComponent(columnId)}`
    });
    addingTaskColumnId = null;
    newTaskTitle = '';
    location.reload();
  }

  function toggleColumnMenu(columnId) {
    showColumnMenuId = showColumnMenuId === columnId ? null : columnId;
  }

  async function handleDeleteColumn(columnId) {
    await fetch(`?/deleteColumn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `columnId=${encodeURIComponent(columnId)}`
    });
    showColumnMenuId = null;
    location.reload();
  }

  async function handleRenameColumn(columnId) {
    const newName = prompt('Rename column:');
    if (newName && newName.trim()) {
      await fetch(`?/renameColumn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `columnId=${encodeURIComponent(columnId)}&name=${encodeURIComponent(newName)}`
      });
      showColumnMenuId = null;
      location.reload();
    }
  }

  function handleTaskDragStart(e) {
    // Adding event logging
    console.log('Drag started', e);
  }

  async function handleDnd(e) {
    const { items, from, to } = e.detail;
    console.log('DND event:', e.detail);
    
    // Guard against undefined from/to
    if (!from || !to) {
      console.warn('Missing from/to in DND event', e.detail);
      return;
    }
    
    if (from.id === to.id && from.index === to.index) {
      console.log('No position change, ignoring');
      return;
    }
    
    console.log('Updating task order', {
      columnId: to.id,
      orderedTaskIds: items.map(t => t.id)
    });
    
    try {
      // Find the column index to update the UI immediately
      const colIndex = columns.findIndex(col => col.id === to.id);
      if (colIndex >= 0) {
        // Update the column's tasks directly for immediate UI feedback
        columns[colIndex].tasks = [...items];
        columns = [...columns]; // Trigger reactivity
      }
      
      // Send update to the server
      await fetch(`/app/tasks/board/${data.board.id}?/moveTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columnId: to.id,
          orderedTaskIds: items.map(t => t.id)
        })
      });
    } catch (error) {
      console.error('Failed to update task order:', error);
    }
  }

  function openTaskModal(task) {
    selectedTask = task;
    showTaskModal = true;
  }
  
  function closeTaskModal() {
    showTaskModal = false;
    selectedTask = null;
  }
  
  function startEditTask(task) {
    editingTaskId = task.id;
    editTaskTitle = task.title;
  }
  
  async function saveEditTask(task) {
    if (!editTaskTitle.trim()) return;
    await fetch(`/app/tasks/board/${data.board.id}?/editTask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, title: editTaskTitle })
    });
    editingTaskId = null;
    location.reload();
  }
  
  function cancelEditTask() {
    editingTaskId = null;
    editTaskTitle = '';
  }
</script>

<h1 class="kanban-title">{data.board?.name}</h1>

<div class="kanban-board">
  {#each columns as column (column.id)}
    <div class="kanban-column">
      <div class="kanban-column-header">
        <span>{column.name}</span>
        <button class="column-menu-btn" on:click={() => toggleColumnMenu(column.id)} aria-label="Column actions">⋮</button>
        {#if showColumnMenuId === column.id}
          <div class="column-menu">
            <button on:click={() => handleRenameColumn(column.id)}>Rename</button>
            <button on:click={() => handleDeleteColumn(column.id)}>Delete</button>
          </div>
        {/if}
      </div>
      <ul
        use:dndzone={{
          items: column.tasks,
          flipDurationMs: 150
        }}
        on:finalize={handleDnd}
      >
        {#each column.tasks as task (task.id)}
          <li class="kanban-task-card" data-id={task.id}>
            {#if editingTaskId === task.id}
              <input class="edit-task-input" bind:value={editTaskTitle} on:keydown={(e) => e.key === 'Enter' && saveEditTask(task)} />
              <button class="save-btn" on:click={() => saveEditTask(task)}>Save</button>
              <button class="cancel-btn" on:click={cancelEditTask}>Cancel</button>
            {:else}
              <button type="button" class="task-title" on:click={() => openTaskModal(task)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openTaskModal(task)} aria-label="Open task details">
                <span class="task-title-main">{task.title}</span>
                <div class="task-card-preview">
                  {#if task.assignee?.avatar}
                    <img class="task-avatar" src={task.assignee.avatar} alt={task.assignee.name} title={task.assignee.name} />
                  {/if}
                  {#if task.dueDate}
                    <span class="task-due-badge {new Date(task.dueDate) < new Date() ? 'overdue' : ''}">{new Date(task.dueDate).toLocaleDateString()}</span>
                  {/if}
                  <span class="task-status-badge {task.completed ? 'completed' : 'open'}">{task.completed ? '✔' : ''}</span>
                </div>
              </button>
              <button class="edit-btn" on:click={() => startEditTask(task)}>✏️</button>
            {/if}
          </li>
        {/each}
      </ul>
      {#if addingTaskColumnId === column.id}
        <form class="add-card-form" on:submit|preventDefault={(e) => handleAddCard(e, column.id)}>
          <input class="add-card-input" bind:value={newTaskTitle} placeholder="Enter a title for this card..." required />
          <div class="add-card-actions">
            <button type="submit">Add card</button>
            <button type="button" on:click={closeAddCard}>Cancel</button>
          </div>
        </form>
      {:else}
        <button class="add-card-btn" on:click={() => openAddCard(column.id)}>+ Add a card</button>
      {/if}
    </div>
  {/each}
  <div class="kanban-column add-column">
    <form method="POST" action="?/createColumn">
      <input name="columnName" placeholder="New column name" required />
      <button type="submit">Add Column</button>
    </form>
  </div>
</div>

{#if showTaskModal && selectedTask}
  <TaskModal task={selectedTask} boardId={data.board.id} on:close={closeTaskModal} />
{/if}

<style>
.kanban-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #172b4d;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 0 #fff;
}
.kanban-board {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1.2rem;
  background: #0079bf;
  padding: 2rem 1rem 2rem 1rem;
  min-height: 100vh;
  border-radius: 0;
  box-shadow: none;
  align-items: flex-start;
  overflow-x: auto;
}
.kanban-column {
  background: #ebecf0;
  border-radius: 12px;
  min-width: 300px;
  max-width: 340px;
  padding: 1.2rem 1rem 1.2rem 1rem;
  box-shadow: 0 1.5px 6px 0 rgba(9,30,66,.13);
  border: none;
  margin-bottom: 1rem;
  position: relative;
}
.kanban-column-header {
  font-size: 1.1rem;
  font-weight: 700;
  color: #172b4d;
  margin-bottom: 1rem;
  padding-bottom: 0.3rem;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.column-menu-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #6b778c;
  cursor: pointer;
  margin-left: 0.5rem;
  border-radius: 4px;
  padding: 0 0.3rem;
}
.column-menu-btn:hover {
  background: #dfe1e6;
}
.column-menu {
  position: absolute;
  right: 0;
  top: 2.2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.13);
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  padding: 0.5rem 0;
}
.column-menu button {
  background: none;
  border: none;
  text-align: left;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  color: #172b4d;
  cursor: pointer;
  transition: background 0.13s;
}
.column-menu button:hover {
  background: #f4f5f7;
}
.kanban-task-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1.5px 4px rgba(9,30,66,.10);
  margin-bottom: 0.7rem;
  padding: 0.7rem 0.8rem 0.5rem 0.8rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: grab;
  border: none;
  position: relative;
  transition: box-shadow 0.18s, background 0.18s;
}
.kanban-task-card:active {
  background: #e4f0f6;
  box-shadow: 0 8px 24px 0 rgba(9,30,66,.18);
}
.task-title {
  flex: 1;
  cursor: pointer;
  font-size: 1.05rem;
  color: #172b4d;
  text-align: left;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}
.task-title-main {
  margin-bottom: 0.1rem;
}
.task-card-preview {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.2rem;
}
.task-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #e2e4ea;
}
.task-due-badge {
  background: #f7d070;
  color: #7c4700;
  border-radius: 6px;
  font-size: 0.85rem;
  padding: 0.1em 0.6em;
  font-weight: 600;
}
.task-due-badge.overdue {
  background: #f87171;
  color: #fff;
}
.task-status-badge {
  font-size: 1.1rem;
  color: #22c55e;
  margin-left: 0.2em;
}
.task-status-badge.open {
  color: #b91c1c;
}
.add-card-btn {
  background: none;
  border: none;
  color: #5e6c84;
  font-size: 1rem;
  padding: 0.5rem 0.2rem;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  margin-top: 0.2rem;
  transition: background 0.13s;
}
.add-card-btn:hover {
  background: #dfe1e6;
}
.add-card-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.add-card-input {
  border-radius: 6px;
  border: 1px solid #b6bac2;
  padding: 0.5rem 0.7rem;
  font-size: 1rem;
  background: #fff;
  width: 100%;
}
.add-card-actions {
  display: flex;
  gap: 0.5rem;
}
.add-card-form button[type="submit"] {
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
.add-card-form button[type="submit"]:hover {
  background: #519839;
}
.add-card-form button[type="button"] {
  background: none;
  border: none;
  color: #b04632;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
}
.add-card-form button[type="button"]:hover {
  background: #f4f5f7;
}
.add-column {
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 260px;
  border-radius: 12px;
  margin-left: 1rem;
  box-shadow: none;
}
@media (max-width: 700px) {
  .kanban-column {
    min-width: 90vw;
    max-width: 95vw;
  }
}
</style>
