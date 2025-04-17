import prisma from '$lib/prisma.js';
import { json } from '@sveltejs/kit';

export async function PATCH({ params, request }) {
  const { boardId, taskId } = params;
  const { dueDate } = await request.json();
  if (!dueDate) {
    return json({ error: 'Missing dueDate' }, { status: 400 });
  }
  try {
    // Log params for debugging
    console.log('PATCH BoardTask due-date params:', params);
    // Check if the board task exists and belongs to the board
    const boardTask = await prisma.boardTask.findFirst({
      where: {
        id: taskId,
        // Ensure the boardId matches
        column: {
          board: {
            id: boardId
          }
        }
      }
    });
    console.log('Found boardTask:', boardTask);
    if (!boardTask) {
      return json({ error: 'BoardTask not found' }, { status: 404 });
    }
    const updated = await prisma.boardTask.update({
      where: { id: taskId },
      data: { dueDate: new Date(dueDate) }
    });
    return json({ success: true, task: updated });
  } catch (e) {
    console.error('Due date update error:', e);
    return json({ error: 'Failed to update due date', details: e.message }, { status: 500 });
  }
}
