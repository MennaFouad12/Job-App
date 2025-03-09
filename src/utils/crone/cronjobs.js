import cron from "node-cron";
import {UserModel} from "../../DB/Models/user.model.js";

// Schedule a job to run every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("⏳ Running CRON Job: Deleting expired OTPs...");

  try {
    // Find users with expired OTPs
    const now = new Date();
    const users = await UserModel.find({ "otp.expiresIn": { $lt: now } });
    console.log(users);

    for (const user of users) {
      // Filter out expired OTPs
      user.otp = user.otp.filter((otp) => otp.expiresIn > now);

      // Save the updated user document
      await user.save();
    }

    console.log(`✅ Expired OTPs deleted for ${users.length} users.`);
  } catch (error) {
    console.error("❌ Error deleting expired OTPs:", error);
  }
});
