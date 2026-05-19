/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: File a new support ticket
 *     description: |
 *       AUTHOR: ticket is filed against the caller. `bookId` (if provided)
 *       must belong to the caller (404 otherwise — no existence leak).
 *       ADMIN: ticket is filed against the admin's own user id; `bookId` only
 *       needs to exist.
 *
 *       AI classification runs fire-and-forget after the response — `category`
 *       and `priority` come back `null` until it completes.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subject, description]
 *             properties:
 *               subject:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: ISBN is missing on Amazon listing
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *                 example: My book Whispers of the Ganges (BK001) shows no ISBN on the Amazon product page.
 *               bookId:
 *                 type: string
 *                 description: Optional Mongo id of the related book.
 *                 example: 65f1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       '201':
 *         description: Ticket created.
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
