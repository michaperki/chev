
// src/app/api/connect/userManagement.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function upsertUserAndToken(walletAddress: string, accessToken: string) {
  const user = await prisma.user.upsert({
    where: { wallet: walletAddress },
    update: {}, // No need to update the user data
    create: { wallet: walletAddress },
  });

  const existingToken = await prisma.token.findFirst({
    where: {
      user: {
        id: user.id,
      },
    },
  });

  if (existingToken) {
    await prisma.token.update({
      where: { id: existingToken.id },
      data: { accessToken },
    });
  } else {
    await prisma.token.create({
      data: {
        accessToken,
        userId: user.id,
      },
    });
  }

  return user;
}
