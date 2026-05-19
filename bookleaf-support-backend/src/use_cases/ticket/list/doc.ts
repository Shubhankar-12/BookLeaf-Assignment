/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: List tickets (author-scoped or admin-wide)
 *     description: |
 *       AUTHOR sees ONLY their own tickets; ADMIN sees ALL tickets. Newest first.
 *     tags: [Tickets]
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
 *     responses:
 *       '200':
 *         description: Paginated list of tickets.
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
 */
export {};
