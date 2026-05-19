/**
 * @swagger
 * /admin/tickets/{id}/category:
 *   patch:
 *     summary: Override ticket category
 *     description: |
 *       Writes a CATEGORY_CHANGED activity-log entry. When the previous value
 *       came from the AI classifier, the `after` payload includes
 *       `aiOverridden: true` so the audit trail reflects the override.
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
 *             required: [category]
 *             properties:
 *               category: { $ref: '#/components/schemas/TicketCategory' }
 *     responses:
 *       '200':
 *         description: Category updated.
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
