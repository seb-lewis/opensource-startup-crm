<script>
  export let data;
  let today = new Date();
  let selectedDate = today.toISOString().slice(0, 10);

  // Group tasks by due date (YYYY-MM-DD)
  let tasksByDate = {};
  if (data) {
    for (const t of data.tasks) {
      if (!t.dueDate) continue;
      const date = (typeof t.dueDate === 'string' ? t.dueDate : t.dueDate?.toISOString?.())?.slice(0, 10);
      if (!tasksByDate[date]) tasksByDate[date] = [];
      tasksByDate[date].push({
        id: t.id,
        title: t.subject,
        description: t.description,
        type: 'CRM',
        status: t.status,
        priority: t.priority
      });
    }
    for (const t of data.boardTasks) {
      if (!t.dueDate) continue;
      const date = (typeof t.dueDate === 'string' ? t.dueDate : t.dueDate?.toISOString?.())?.slice(0, 10);
      if (!tasksByDate[date]) tasksByDate[date] = [];
      tasksByDate[date].push({
        id: t.id,
        title: t.title,
        description: t.description,
        type: 'Board',
        completed: t.completed,
        boardId: t.column.boardId
      });
    }
  }

  // Calendar logic
  let year = today.getFullYear();
  let month = today.getMonth(); // 0-indexed
  let monthStart = new Date(year, month, 1);
  let monthEnd = new Date(year, month + 1, 0);
  let startDay = monthStart.getDay(); // 0=Sun
  let daysInMonth = monthEnd.getDate();
  let calendar = [];
  for (let i = 0; i < startDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(new Date(Date.UTC(year, month, d)));
  while (calendar.length % 7 !== 0) calendar.push(null);

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }
  function isToday(date) {
    return date && formatDate(date) === today.toISOString().slice(0, 10);
  }
  function hasTasks(date) {
    return date && tasksByDate[formatDate(date)]?.length > 0;
  }
  function selectDay(date) {
    if (date) {
      const formatted = formatDate(date);
      selectedDate = formatted;
      selectedTasks = tasksByDate[selectedDate] || [];
    }
  }
  $: selectedTasks = tasksByDate[selectedDate] || [];
</script>

<style>
/* Card container for better separation */
.card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  padding: 2rem 2.5rem;
  margin: 2rem auto;
  max-width: 540px;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 2.5rem);
  gap: 0.25rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}
.day {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  background: white;
  border: 1px solid #e5e7eb;
  transition: background 0.2s, color 0.2s;
  position: relative;
}
.day.today {
  border: 2px solid #2563eb;
  color: #2563eb;
}
.day.selected {
  background: #2563eb;
  color: white;
}
.day.has-tasks {
  box-shadow: 0 0 0 2px #22c55e;
}
.day:disabled, .day.null {
  background: transparent;
  border: none;
  cursor: default;
}
.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 2.5rem);
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
}

/* Task list improvements */
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.task-item {
  background: #f1f5f9;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.badge {
  display: inline-block;
  font-size: 0.8rem;
  padding: 0.15em 0.7em;
  border-radius: 0.5em;
  margin-left: 0.5em;
  font-weight: 600;
}
.badge-crm { background: #dbeafe; color: #2563eb; }
.badge-board { background: #dcfce7; color: #16a34a; }
.badge-priority-high { background: #fee2e2; color: #dc2626; }
.badge-priority-medium { background: #fef9c3; color: #ca8a04; }
.badge-priority-low { background: #d1fae5; color: #059669; }

h1 {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

h2 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #2563eb;
}

.no-tasks {
  color: #64748b;
  text-align: center;
  margin: 2rem 0;
}
</style>

<h1>Task Calendar</h1>
<div class="card">
  <div class="calendar-header">
    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
  </div>
  <div class="calendar">
    {#each calendar as date, i}
      {#if date}
        <button
          class="day {isToday(date) ? 'today' : ''} {formatDate(date) === selectedDate ? 'selected' : ''} {hasTasks(date) ? 'has-tasks' : ''}"
          on:click={() => selectDay(date)}
        >
          {date.getDate()}
        </button>
      {:else}
        <div class="day null"></div>
      {/if}
    {/each}
  </div>

  <main>
    <h2>Tasks for {selectedDate}</h2>
    {#if selectedTasks.length}
      <ul class="task-list">
        {#each selectedTasks as task}
          <li class="task-item">
            <div>
              <strong>{task.title}</strong>
              <span class="badge {task.type === 'CRM' ? 'badge-crm' : 'badge-board'}">{task.type}</span>
              {#if task.type === 'CRM'}
                <span class="badge {task.priority === 'High' ? 'badge-priority-high' : task.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'}">{task.priority}</span>
              {/if}
            </div>
            <div style="font-size:0.95em; color:#64748b;">{task.description}</div>
            <div style="font-size:0.9em; margin-top:0.2em;">
              {#if task.type === 'CRM'}
                <span>Status: <b>{task.status}</b></span>
              {:else}
                <span>Status: <b>{task.completed ? 'Completed' : 'Open'}</b></span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="no-tasks">No tasks for this date.</p>
    {/if}
  </main>
</div>
