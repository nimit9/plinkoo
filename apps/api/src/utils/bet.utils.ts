import type { User, Game } from '@prisma/client';
import db from '@repo/db';
import { BadRequestError } from '../errors';
import { userManager } from '../features/user/user.service';

export interface BetValidationOptions {
  betAmount: number;
  userId: string;
}

export interface BetTransactionOptions {
  userId: string;
  betAmount: number;
  game: Game;
  gameState: any;
  payoutAmount?: number;
  active?: boolean;
}

export interface BetTransactionResult {
  betId: string;
  newBalance: string;
  balanceChange: number;
}

/**
 * Validates bet amount and user balance
 */
export const validateBetAmount = async ({
  betAmount,
  userId,
}: BetValidationOptions): Promise<{
  betAmountInCents: number;
  userBalanceInCents: number;
  userInstance: any;
}> => {
  // Validate bet amount range
  if (betAmount <= 0) {
    throw new BadRequestError('Bet amount must be greater than 0');
  }

  // Get user instance
  const userInstance = await userManager.getUser(userId);

  // Convert to cents for precision
  const betAmountInCents = Math.round(betAmount * 100);
  const userBalanceInCents = userInstance.getBalanceAsNumber();

  // Check sufficient balance
  if (userBalanceInCents < betAmountInCents) {
    throw new BadRequestError('Insufficient balance');
  }

  return {
    betAmountInCents,
    userBalanceInCents,
    userInstance,
  };
};

/**
 * Creates a bet transaction and updates user balance
 */
export const createBetTransaction = async ({
  userId,
  betAmount,
  game,
  gameState,
  payoutAmount = 0,
  active = false,
}: BetTransactionOptions): Promise<BetTransactionResult> => {
  const userInstance = await userManager.getUser(userId);
  const userBalance = userInstance.getBalanceAsNumber();
  const balanceChange = payoutAmount - betAmount;
  const newBalance = (userBalance + balanceChange).toString();

  const { balance, id } = await db.$transaction(async tx => {
    // Create bet record
    const bet = await tx.bet.create({
      data: {
        active,
        betAmount,
        betNonce: userInstance.getNonce(),
        game,
        payoutAmount,
        provablyFairStateId: userInstance.getProvablyFairStateId(),
        state: gameState,
        userId,
      },
    });

    // Update user nonce
    await userInstance.updateNonce(tx);

    // Update user balance
    const userWithNewBalance = await tx.user.update({
      where: { id: userId },
      data: {
        balance: newBalance,
      },
    });

    return {
      balance: userWithNewBalance.balance,
      id: bet.id,
    };
  });

  // Update user instance with new balance
  userInstance.setBalance(balance);

  return {
    betId: id,
    newBalance: balance,
    balanceChange,
  };
};

/**
 * Validates and creates a complete bet transaction
 */
export const validateAndCreateBet = async ({
  betAmount,
  userId,
  game,
  gameState,
  payoutAmount = 0,
  active = false,
}: BetValidationOptions &
  Omit<
    BetTransactionOptions,
    'betAmount' | 'userId'
  >): Promise<BetTransactionResult> => {
  // Validate bet
  await validateBetAmount({ betAmount, userId });

  // Create transaction
  return createBetTransaction({
    userId,
    betAmount,
    game,
    gameState,
    payoutAmount,
    active,
  });
};

/**
 * Converts a major currency unit (e.g., dollars, euros) to its minor unit (e.g., cents, pence).
 * Use for currency-agnostic calculations.
 */
export const amountToMinor = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Converts a minor currency unit (e.g., cents, pence) to its major unit (e.g., dollars, euros).
 * Use for currency-agnostic calculations.
 */
export const minorToAmount = (minor: number): number => {
  return minor / 100;
};

/**
 * Calculates payout multiplier
 */
export const calculatePayoutMultiplier = (
  payoutInCents: number,
  betAmountInCents: number
): number => {
  if (betAmountInCents === 0) return 0;
  return payoutInCents / betAmountInCents;
};
