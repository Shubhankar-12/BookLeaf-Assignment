/**
 * @swagger
 * /books:
 *   get:
 *     summary: List books (author-scoped or admin-wide)
 *     description: |
 *       AUTHOR: returns ONLY the caller's own books, paginated.
 *       ADMIN: returns ALL books across every author (admin elevation on the
 *       author surface). Response includes `authorId` on every row so admin
 *       callers can attribute each book.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Page number (1-indexed).
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *         description: Items per page (1-100).
 *     responses:
 *       '200':
 *         description: Paginated list of books.
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
 *                           items: { $ref: '#/components/schemas/Book' }
 *                         total: { type: integer, example: 2 }
 *                         page:  { type: integer, example: 1 }
 *                         limit: { type: integer, example: 20 }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
export {};
