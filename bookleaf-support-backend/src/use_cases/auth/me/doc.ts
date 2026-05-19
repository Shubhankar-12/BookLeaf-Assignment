/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     description: |
 *       Returns the user identified by the Bearer JWT. `name` is hydrated from
 *       the User document on every call (so renaming a user is reflected
 *       without re-issuing the token).
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Current user
 *               data:
 *                 id: 65f1b2c3d4e5f6a7b8c9d0e1
 *                 email: author@example.com
 *                 name: Jane Author
 *                 role: AUTHOR
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
export {};
