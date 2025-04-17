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
      <div class="kanban-column-header">{column.name}</div>
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
              <button type="button" class="task-title" on:click={() => openTaskModal(task)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openTaskModal(task)} aria-label="Open task details">{task.title}</button>
              <button class="edit-btn" on:click={() => startEditTask(task)}>✏️</button>
            {/if}
          </li>
        {/each}
      </ul>
      <form method="POST" action="?/createTask">
        <input name="title" placeholder="New task title" required />
        <input type="hidden" name="columnId" value={column.id} />
        <button type="submit">Add Task</button>
      </form>
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
  gap: 2rem;
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: 2rem;
  background: #e5e7ef;
  min-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(9,30,66,.10);
}
.kanban-column {
  background: #f4f5f7;
  border-radius: 12px;
  min-width: 320px;
  max-width: 360px;
  padding: 1.2rem 1.2rem 2rem 1.2rem;
  box-shadow: 0 2px 8px 0 rgba(9,30,66,.13);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.18s;
  border: 1.5px solid #e2e4ea;
}
.kanban-column-header {
  font-size: 1.15rem;
  font-weight: 800;
  color: #253858;
  margin-bottom: 1.1rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #dfe1e6;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kanban-column ul {
  min-height: 40px;
  margin-bottom: 1.2rem;
  padding: 0;
  list-style: none;
}
.kanban-task-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1.5px 4px rgba(9,30,66,.10);
  margin-bottom: 0.8rem;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: grab;
  transition: box-shadow 0.18s, background 0.18s;
  border: 1px solid #e2e4ea;
  position: relative;
}
.kanban-task-card:hover {
  background: #e9f2ff;
  box-shadow: 0 6px 18px 0 rgba(9,30,66,.18);
  border-color: #b3d4fc;
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
  transition: color 0.15s;
}
.task-title:focus {
  color: #0052cc;
}
.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  margin-left: 0.5rem;
  color: #6b778c;
  transition: color 0.15s;
}
.edit-btn:hover {
  color: #0052cc;
}
.edit-task-input {
  flex: 1;
  font-size: 1rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #b6bac2;
  margin-right: 0.5rem;
}
.save-btn, .cancel-btn {
  background: #0079bf;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.2rem 0.7rem;
  font-size: 0.95rem;
  margin-left: 0.3rem;
  cursor: pointer;
  transition: background 0.15s;
}
.cancel-btn {
  background: #b04632;
}
.save-btn:hover {
  background: #026aa7;
}
.cancel-btn:hover {
  background: #933b27;
}
.kanban-column form {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.kanban-column form input[name="title"] {
  flex: 1;
  border-radius: 4px;
  border: 1px solid #b6bac2;
  padding: 0.4rem 0.7rem;
  font-size: 1rem;
  background: #fff;
}
.kanban-column form button[type="submit"] {
  background: #5aac44;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.kanban-column form button[type="submit"]:hover {
  background: #519839;
}
.add-column {
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  min-height: 120px;
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(9,30,66,.10);
  border: 2px dashed #b6bac2;
}
.add-column form {
  display: flex;
  gap: 0.5rem;
}
.add-column input[name="columnName"] {
  border-radius: 4px;
  border: 1px solid #b6bac2;
  padding: 0.4rem 0.7rem;
  font-size: 1rem;
  background: #fff;
}
.add-column button[type="submit"] {
  background: #0079bf;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.add-column button[type="submit"]:hover {
  background: #026aa7;
}
::-webkit-scrollbar {
  height: 10px;
  background: #e5e7ef;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb {
  background: #b6bac2;
  border-radius: 8px;
}
</style>
