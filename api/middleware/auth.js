import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userOrganizations: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

export const requireOrganization = async (req, res, next) => {
  try {
    const organizationId = req.header('X-Organization-ID');
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required in X-Organization-ID header.' });
    }

    const userOrg = req.user.userOrganizations.find(
      uo => uo.organizationId === organizationId
    );

    if (!userOrg) {
      return res.status(403).json({ error: 'Access denied to this organization.' });
    }

    req.organizationId = organizationId;
    req.userRole = userOrg.role;
    req.organization = userOrg.organization;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
};

export const requireSuperAdmin = (req, res, next) => {
  if (!req.user.email.endsWith('@micropyramid.com')) {
    return res.status(403).json({ error: 'Super admin access required.' });
  }
  next();
};