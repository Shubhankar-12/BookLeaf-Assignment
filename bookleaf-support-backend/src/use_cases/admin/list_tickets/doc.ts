/**
 * @swagger
 * /admin/tickets:
 *   get:
 *     summary: Admin queue — list every ticket with filters
 *     description: |
 *       Paginated listing of every ticket in the system. Supports filtering by
 *       status, priority, category, assignee, plus full-text search across
 *       subject + description (uses the schema text index).
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { $ref: '#/components/schemas/TicketStatus' }
 *       - in: query
 *         name: priority
 *         schema: { $ref: '#/components/schemas/TicketPriority' }
 *       - in: query
 *         name: category
 *         schema: { $ref: '#/components/schemas/TicketCategory' }
 *       - in: query
 *         name: assignedTo
 *         schema: { type: string }
 *         description: Mongo id of an admin user.
 *       - in: query
 *         name: search
 *         schema: { type: string, minLength: 1, maxLength: 200 }
 *         description: Free-text query against subject + description.
 *     responses:
 *       '200':
 *         description: Paginated admin queue.
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
 *                         data:
 *                           type: array
 *                           items: { $ref: '#/components/schemas/Ticket' }
 *                         total: { type: integer }
 *                         page:  { type: integer }
 *                         limit: { type: integer }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
export {};
