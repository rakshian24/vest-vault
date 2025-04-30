import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear);

export const generateToken = async (user: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "365d",
        }
      );
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

export const calculateVestingSchedule = (
  grantDate: string,
  grantAmount: number,
  stockPrice: number
): {
  totalUnits: number;
  vestingSchedule: { vestDate: Date; grantedQty: number; vestedQty: number }[];
} => {
  const today = dayjs();
  const roundedPrice = Math.round(stockPrice);
  const totalUnits = Math.round(grantAmount / roundedPrice);

  const firstQty = Math.round(totalUnits * 0.25);
  const remainingQty = totalUnits - firstQty;

  const vestingSchedule: {
    vestDate: Date;
    grantedQty: number;
    vestedQty: number;
  }[] = [];

  // First 25% at 1 year mark
  const firstVestDate = dayjs(grantDate).add(1, "year");
  const isFirstVested =
    firstVestDate.isBefore(today) || firstVestDate.isSame(today, "day");

  vestingSchedule.push({
    vestDate: firstVestDate.toDate(),
    grantedQty: firstQty,
    vestedQty: isFirstVested ? firstQty : 0,
  });

  // Distribute remaining over 12 quarters using 5 & 6 pattern
  const quarters = 12;
  const lowQty = Math.floor(remainingQty / quarters);
  const highQty = lowQty + 1;

  const numHigh = remainingQty % quarters;

  // Create mixed list of 5s and 6s
  const grantChunks: number[] = [];

  for (let i = 0; i < numHigh; i++) grantChunks.push(highQty); // 6s
  for (let i = 0; i < quarters - numHigh; i++) grantChunks.push(lowQty); // 5s

  // Mix up the chunks to avoid grouping all 6s or all 5s
  // Alternate 5 and 6 as much as possible (simple round-robin shuffle)
  const mixedChunks: number[] = [];
  const sixes = grantChunks.filter((q) => q === highQty);
  const fives = grantChunks.filter((q) => q === lowQty);

  for (let i = 0; i < quarters; i++) {
    if (i % 2 === 0 && fives.length) {
      mixedChunks.push(fives.pop()!);
    } else if (sixes.length) {
      mixedChunks.push(sixes.pop()!);
    } else if (fives.length) {
      mixedChunks.push(fives.pop()!);
    }
  }

  // Generate vesting events
  let current = firstVestDate;

  for (let i = 0; i < quarters; i++) {
    current = current.add(3, "month");
    const qty = mixedChunks[i];
    const isVested = current.isBefore(today) || current.isSame(today, "day");

    vestingSchedule.push({
      vestDate: current.toDate(),
      grantedQty: qty,
      vestedQty: isVested ? qty : 0,
    });
  }

  return {
    totalUnits,
    vestingSchedule,
  };
};
