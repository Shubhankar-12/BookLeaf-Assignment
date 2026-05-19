/**
 * @swagger
 * /admin/tickets/{id}/respond:
 *   post:
 *     summary: Admin public reply (visible to author)
 *     description: |
 *       Posts a message with `internalOnly: false` — visible to the author via
 *       `GET /tickets/{id}`. Functionally identical to
 *       `POST /tickets/{id}/messages` when the caller is an admin.
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
 *             required: [body]
 *             properties:
 *               body:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *     responses:
 *       '201':
 *         description: Response sent.
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
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
export {};
