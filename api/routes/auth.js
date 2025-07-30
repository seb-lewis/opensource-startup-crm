import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @swagger
 * components:
 *   schemas:
 *     GoogleLoginRequest:
 *       type: object
 *       required:
 *         - idToken
 *       properties:
 *         idToken:
 *           type: string
 *           description: Google ID token from mobile app
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             profileImage:
 *               type: string
 *             organizations:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 */


/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     organizations:
 *                       type: array
 *       401:
 *         description: Unauthorized
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userResponse = {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      organizations: req.user.userOrganizations.map(uo => ({
        id: uo.organization.id,
        name: uo.organization.name,
        role: uo.role
      }))
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Google OAuth mobile login
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid Google token or user not found
 *       500:
 *         description: Server error
 */
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Support both web and mobile client IDs
    const audiences = [
      process.env.GOOGLE_CLIENT_ID
    ];

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: audiences
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    let user = await prisma.user.upsert({
      where: { email: payload.email },
      update: { 
        profilePhoto: payload.picture,
        lastLogin: new Date(),
        // Update name fields if they exist in the token
        ...(payload.name && { name: payload.name })
      },
      create: {
        email: payload.email,
        name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
        profilePhoto: payload.picture,
        user_id: payload.sub, // Use 'sub' field which is the stable Google user ID
        lastLogin: new Date()
      },
      include: {
        organizations: {
          include: {
            organization: true
          }
        }
      }
    });

    // Create JWT token for API access
    const JWTtoken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Format response to match SvelteKit patterns
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profilePhoto,      
    };

    res.json({ 
      success: true,
      JWTtoken, 
      user: userResponse,
      organizations: user.organizations.map(uo => ({
        id: uo.organization.id,
        name: uo.organization.name,
        role: uo.role
      }))
    });
  } catch (error) {
    console.error('Google login error:', error);
    if (error.message && error.message.includes('Invalid token')) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;