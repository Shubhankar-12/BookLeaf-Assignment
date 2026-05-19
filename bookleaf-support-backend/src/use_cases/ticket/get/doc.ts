/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Fetch one ticket plus its public message thread
 *     description: |
 *       AUTHOR: must own the ticket — 404 covers both "missing" and "not yours"
 *       so existence doesn't leak. ADMIN: can read any ticket.
 *
 *       Internal admin notes (`internalOnly: true`) are filtered out at the
 *       query layer and NEVER returned here, even for ADMIN — use
 *       `/admin/tickets/{id}` for admin-only views.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Mongo ObjectId of the ticket.
 *     responses:
 *       '200':
 *         description: Ticket detail with messages.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Ticket'
 *                         - type: object
 *                           properties:
 *                             messages:
 *                               type: array
 *                               items: { $ref: '#/components/schemas/Message' }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
export {};
