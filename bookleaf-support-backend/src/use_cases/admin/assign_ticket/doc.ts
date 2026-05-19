/**
 * @swagger
 * /admin/tickets/{id}/assign:
 *   patch:
 *     summary: Assign (or un-assign) a ticket
 *     description: |
 *       The assignee must exist AND have role ADMIN. Pass `assigneeId: null`
 *       to clear the `assignedTo` field.
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
 *             required: [assigneeId]
 *             properties:
 *               assigneeId:
 *                 type: string
 *                 nullable: true
 *                 description: Mongo id of an ADMIN user, or null to un-assign.
 *                 example: 65f1b2c3d4e5f6a7b8c9d0e2
 *     responses:
 *       '200':
 *         description: Ticket assignment updated.
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
