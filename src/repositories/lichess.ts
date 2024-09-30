
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * This function checks if the user has a Lichess token.
 * If they do, it returns the token. If not, it returns null.
 */
export async function checkAndReturnLichessToken(walletAddress: string) {
  try {
    // Fetch the user by wallet address
    const user = await prisma.user.findUnique({
      where: { wallet: walletAddress },
      select: {
        lichessAccessToken: true, // Only fetch the Lichess token
      },
    });

    // Return the Lichess token or null if not found
    return user?.lichessAccessToken || null;
  } catch (error) {
    console.error('Error fetching Lichess token:', error);
    throw new Error('Failed to check Lichess token');
  }
}
