/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Exchange credentials for a JWT
 *     description: |
 *       Authenticates a user with email + password and returns a JWT plus the
 *       user profile. Same error message for "user not found" and "bad password"
 *       by design, to avoid user enumeration. Rate-limited.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@bookleaf.com
 *               password:
 *                 type: string
 *                 minLength: 1
 *                 example: Admin@123
 *     responses:
 *       '200':
 *         description: Authentication succeeded
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
 *                         token:
 *                           type: string
 *                           description: "JWT — pass as `Authorization: Bearer <token>` on every other request."
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Logged in
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   id: 65f1b2c3d4e5f6a7b8c9d0e1
 *                   email: admin@bookleaf.com
 *                   name: BookLeaf Admin
 *                   role: ADMIN
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401':
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *             example:
 *               success: false
 *               error: Invalid email or password
 *       '429': { $ref: '#/components/responses/RateLimited' }
 */
export {};
