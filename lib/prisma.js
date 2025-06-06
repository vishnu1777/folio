import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

// Initialize prisma client
const prisma = globalForPrisma.prisma || new PrismaClient();

// In development, preserve the connection between hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };