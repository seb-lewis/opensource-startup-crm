<script lang="ts">
  export let form;
</script>

<svelte:head>
  <title>New User</title>
</svelte:head>

<div class="container">
  <h1>Add New User</h1>

  {#if form?.success}
    <p class="success">User added successfully!</p>
  {/if}

  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}

  <form method="POST" action="?/addUser">
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required value={form?.data?.email ?? ''} />
      {#if form?.errors?.email}
        <p class="error">{form.errors.email}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required value={form?.data?.name ?? ''} />
      {#if form?.errors?.name}
        <p class="error">{form.errors.name}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="role">Role:</label>
      <select id="role" name="role">
        <option value="USER" selected={form?.data?.role === 'USER' || !form?.data?.role}>USER</option>
        <option value="ADMIN" selected={form?.data?.role === 'ADMIN'}>ADMIN</option>
      </select>
      {#if form?.errors?.role}
        <p class="error">{form.errors.role}</p>
      {/if}
    </div>

    <button type="submit">Add User</button>
  </form>
</div>

<style>
  .container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.25rem;
  }
  input[type="email"],
  input[type="text"],
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  button[type="submit"] {
    background-color: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button[type="submit"]:hover {
    background-color: #0056b3;
  }
  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  .success {
    color: green;
    margin-bottom: 1rem;
  }
</style>
