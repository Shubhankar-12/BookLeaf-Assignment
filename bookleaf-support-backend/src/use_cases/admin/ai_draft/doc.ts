/**
 * @swagger
 * /admin/tickets/{id}/ai-draft:
 *   post:
 *     summary: Generate an AI reply draft for a ticket
 *     description: |
 *       Returns a transient AI-generated reply draft. Does NOT persist a
 *       message — the admin reviews/edits the draft and then sends it via
 *       `POST /admin/tickets/{id}/respond`. No DB writes, no activity log,
 *       no socket emit.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: AI draft generated.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         draft:
 *                           type: string
 *                           description: Plain-text reply, <=200 words.
 *                         source:
 *                           type: string
 *                           enum: [AI, FALLBACK]
 *                         model:
 *                           type: string
 *                           description: AI model identifier (when source=AI).
 *                         tokens:
 *                           type: integer
 *                           description: Total tokens used (when source=AI).
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '503': { $ref: '#/components/responses/ServiceUnavailable' }
 */
export {};
