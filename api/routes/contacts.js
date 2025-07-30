import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, requireOrganization } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyToken);
router.use(requireOrganization);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts for organization
 *     tags: [Contacts]
 *     parameters:
 *       - in: header
 *         name: X-Organization-ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get('/', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { organizationId: req.organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
          select: { id: true, name: true }
        },
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json({ contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: header
 *         name: X-Organization-ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               accountId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 */
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, accountId } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    if (accountId) {
      const account = await prisma.account.findFirst({
        where: {
          id: accountId,
          organizationId: req.organizationId
        }
      });

      if (!account) {
        return res.status(400).json({ error: 'Account not found in your organization' });
      }
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        accountId,
        organizationId: req.organizationId,
        ownerId: req.userId
      },
      include: {
        account: {
          select: { id: true, name: true }
        },
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;