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
      console.log('Clicked date:', date, 'Formatted:', formatted);
      selectedDate = formatted;
      selectedTasks = tasksByDate[selectedDate] || [];
    }
  }
  $: selectedTasks = tasksByDate[selectedDate] || [];
</script>

<style>
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
</style>

<h1>Task Calendar</h1>
<div>
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
</div>

<main>
  <h2>Tasks for {selectedDate}</h2>
  {#if selectedTasks.length}
    <ul>
      {#each selectedTasks as task}
        <li style="margin-bottom: 0.5rem;">
          <strong>{task.title}</strong> ({task.type})
          {#if task.type === 'CRM'}
            <span> - {task.status} [{task.priority}]</span>
          {:else}
            <span> - {task.completed ? 'Completed' : 'Open'} (Board)</span>
          {/if}
          <br />
          <span>{task.description}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No tasks for this date.</p>
  {/if}
</main>
