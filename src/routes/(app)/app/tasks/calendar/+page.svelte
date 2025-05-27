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
.badge-priority-high { background: #fee2e2; color: #dc2626; }
.badge-priority-medium { background: #fef9c3; color: #ca8a04; }
.badge-priority-low { background: #d1fae5; color: #059669; }
</style>

<h1 class="text-center mt-8 mb-2">Task Calendar</h1>
<div class="bg-white rounded-3xl shadow-lg p-8 mx-auto mt-8 max-w-lg">
  <div class="grid grid-cols-7 mb-1 text-sm text-slate-500 text-center" style="grid-template-columns: repeat(7, 2.5rem);">
    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
  </div>
  <div class="grid grid-cols-7 gap-1 bg-slate-50 p-4 rounded-2xl mb-8" style="grid-template-columns: repeat(7, 2.5rem);">
    {#each calendar as date, i}
      {#if date}
        <button
          class="aspect-square flex items-center justify-center rounded-lg cursor-pointer font-medium transition-all duration-200 relative
            {formatDate(date) === selectedDate 
              ? 'bg-blue-600 text-white border-2 border-blue-600' 
              : isToday(date) 
                ? 'bg-white border-2 border-blue-600 text-blue-600' 
                : 'bg-white border border-gray-200 hover:bg-gray-50'}
            {hasTasks(date) ? 'ring-2 ring-green-500' : ''}"
          onclick={() => selectDay(date)}
        >
          {date.getDate()}
        </button>
      {:else}
        <div class="aspect-square"></div>
      {/if}
    {/each}
  </div>

  <main>
    <h2 class="mt-6 mb-4 text-xl text-blue-600">Tasks for {selectedDate}</h2>
    {#if selectedTasks.length}
      <ul class="task-list">
        {#each selectedTasks as task}
          <li class="task-item">
            <a href="/app/tasks/{task.id}" style="text-decoration: none; color: inherit;">
              <div>
                <strong>{task.title}</strong>
                <span class="badge badge-crm">{task.type}</span>
                <span class="badge {task.priority === 'High' ? 'badge-priority-high' : task.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'}">{task.priority}</span>
              </div>
              <div style="font-size:0.95em; color:#64748b;">{task.description}</div>
              <div style="font-size:0.9em; margin-top:0.2em;">
                <span>Status: <b>{task.status}</b></span>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-slate-500 text-center my-8">No tasks for this date.</p>
    {/if}
  </main>
</div>
