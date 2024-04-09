import { User } from "../models/userModel.js";

export const deleteUnverifiedUsers = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const unverifiedUsers = await User.find({
    createdAt: { $lte: threeDaysAgo },
    verify: false,
  });

  await Promise.all(
    unverifiedUsers.map(async (user) => {
      await User.findByIdAndDelete(user._id);
    })
  );
};
