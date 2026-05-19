/**
 * @swagger
 * /admin/tickets/{id}/priority:
 *   patch:
 *     summary: Override ticket priority
 *     description: |
 *       Writes a PRIORITY_CHANGED activity-log entry. When the previous value
 *       came from the AI classifier, the `after` payload includes
 *       `aiOverridden: true`.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [priority]
 *             properties:
 *               priority: { $ref: '#/components/schemas/TicketPriority' }
 *     responses:
 *       '200':
 *         description: Priority updated.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Ticket' }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
export {};
