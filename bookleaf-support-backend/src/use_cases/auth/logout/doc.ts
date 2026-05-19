/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Acknowledge logout (stateless)
 *     description: |
 *       JWT auth is stateless — the client must drop the token from local
 *       storage / cookies after this call. The server only clears the
 *       optional `token` cookie via Set-Cookie; no DB writes, no blacklist.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout acknowledged
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
 *                         loggedOut: { type: boolean, example: true }
 *             example:
 *               success: true
 *               message: Logged out
 *               data:
 *                 loggedOut: true
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
export {};
