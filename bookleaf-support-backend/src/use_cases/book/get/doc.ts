/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Fetch one book by id
 *     description: |
 *       AUTHOR: returns one of the caller's own books. 404 if the book exists
 *       but belongs to another author — same response code as truly missing,
 *       so we don't leak existence. ADMIN: can read any book.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Mongo ObjectId of the book.
 *     responses:
 *       '200':
 *         description: Book detail.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Book' }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
export {};
