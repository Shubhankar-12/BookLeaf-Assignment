/**
 * @swagger
 * /tickets/{id}/messages:
 *   post:
 *     summary: Append a reply to a ticket
 *     description: |
 *       AUTHOR posts as senderType=AUTHOR (must own the ticket — 404 otherwise).
 *       ADMIN posts as senderType=ADMIN on any ticket. Admins can also use
 *       `POST /admin/tickets/{id}/respond` — both URLs are accepted by design.
 *     tags: [Tickets]
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
 *             required: [body]
 *             properties:
 *               body:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *                 example: Thanks — I have re-checked the ISBN entry.
 *     responses:
 *       '201':
 *         description: Message appended.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Message' }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
export {};
