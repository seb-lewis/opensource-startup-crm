// SvelteKit POST endpoint for adding a comment to a BoardTask (Kanban task)
import { getSessionUser } from '$lib/stores/auth.js';
import prisma from '$lib/prisma.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, locals }) {
  const user = getSessionUser({ locals });
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { boardId, taskId } = params;
  const { content } = await request.json();
  if (!content || !content.trim()) {
    return new Response(JSON.stringify({ error: 'Comment cannot be empty' }), { status: 400 });
  }
  try {
    // Find the BoardTask and its column/board for org context (optional, for security)
    const task = await prisma.boardTask.findUnique({
      where: { id: taskId },
      include: { column: { include: { board: true } } }
    });
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }
    // Optionally, check if user is a board member or has access
    // Create the comment as a BoardTaskActivity
    const activity = await prisma.boardTaskActivity.create({
      data: {
        taskId,
        authorId: user.id,
        type: 'comment',
        content,
      }
    });
    return new Response(JSON.stringify({ success: true, activity }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
