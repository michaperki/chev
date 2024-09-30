
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAccessTokenForUser(userId: number) {
  const userWithToken = await prisma.user.findUnique({
    where: { id: userId },
    include: { tokens: true },
  });

  if (!userWithToken || !userWithToken.tokens[0]?.accessToken) {
    return null;
  }

  return userWithToken.tokens[0].accessToken;
}
