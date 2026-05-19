/**
 * @swagger
 * /admin/tickets/{id}/internal-note:
 *   post:
 *     summary: Admin private note (admins only — never returned to author)
 *     description: |
 *       Posts a message with `internalOnly: true`. The note is filtered out
 *       at the query layer (`messageQueries.listByTicket`), so no
 *       author-facing endpoint can return it. Socket emit goes ONLY to the
 *       `admins` room — author room is excluded.
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
 *         description: Internal note added.
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
