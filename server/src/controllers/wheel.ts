import { Request, Response } from "express";
import { getConnection } from "../../data-source";
import { User } from "../entity";

const prizes = [
  {
    value: 10,
    probability: 0.3,
  },
  {
    value: 20,
    probability: 0.25,
  },
  {
    value: 50,
    probability: 0.15,
  },
  {
    value: 100,
    probability: 0.05,
  },
  {
    value: 500,
    probability: 0.01,
  },
  {
    value: 0,
    probability: 0.24,
  },
];

const verifyHelper = async (user: User): Promise<boolean> => {
  const connection = await getConnection();
  const result = await connection.manager.findOne(User, {
    where: { id: user.id },
  });

  return result.verified;
};

const getPrize = () => {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const prize of prizes) {
    cumulativeProbability += prize.probability;
    if (random < cumulativeProbability) {
      return prize.value;
    }
  }

  return 0; // Fallback, though probabilities should sum to 1
};

export const verify = async (req: Request, res: Response) => {
  try {
    const user = req.credentials.user;
    const isVerified = await verifyHelper(user);

    if (isVerified) {
      return res.status(200).json({ verified: true });
    } else {
      return res.status(403).json({ error: "User not verified." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
};

export const verifyAndSpin = async (req: Request, res: Response) => {
  try {
    const user = req.credentials.user;

    // Verify the user
    const isVerified = await verifyHelper(user);
    if (!isVerified) {
      return res.status(403).json({ error: "User not verified." });
    }

    // Determine the prize
    const prize = getPrize();

    // TODO log the spin to the database here:
    // const connection = await getConnection();
    // await connection.manager.save(SpinLog, { userId: user.id, prize });

    return res.status(200).json({ prize });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
};
const exceptionController = { verify };
export default exceptionController;
