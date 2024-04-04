export const emailLetter = (verificationCode, BASE_URL) => {
  return `
        <div style="max-width:400px;margin:20px auto; background-color:#eaf2ff;border-radius: 10px; padding: 20px; box-shadow: 0 4px 14px 0 rgba(64, 123, 255, 0.3);">
            <div style="text-align: center;">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NZtVnDbZ48UBIKicGG9fwjjUIHb4rZeNE86X35bFh2gWAx0fZ6egkvPq6oY7fN_RvmzLIQ-fLVtOx-uuD2u5jpEAnzIJeVS11RGsVP5Q-txMxqR8BgIDmyLVruKmu1jnQM96KC_cj76e2EqymgajY5r-wzIbtUnsAT9xXv8sdOYdnLlakc0Y7snsd4jx_WkLsuPDpsp02GzEuSA7LhFhx0_VROReXtxdQyIIuHlBN1SRaU=s0-d-e1-ft#https://res.cloudinary.com/doj55bihz/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1704651372/img/Logo-890d13ba_to7trg.jpg?_s=public-apps"
                    alt="">
            </div>
            <h2 style="text-align: center; color: #407bff;">Welcome to our Water Tracker</h2>
            <div
                style="max-width:400px; background-color:#eaf2ff;border-radius:10px; padding: 10px; box-shadow: 0 4px 14px 0 rgba(64, 123, 255, 0.3); margin-bottom: 10px;">
                <p>Hello,</p>
                <p>Welcome to WaterTracker, your personal hydration companion! 🌊 We're thrilled to have you on board.
                    Staying
                    hydrated is
                    essential for a healthy lifestyle, and we're here to help you on your journey.</p>

            </div>
            <div
                style="max-width:400px; background-color:#eaf2ff;border-radius:10px; padding: 10px; box-shadow: 0 4px 14px 0 rgba(64, 123, 255, 0.3); margin-bottom: 10px;">
                <p>Here's what you can do with WaterTracker:</p>
                <ul>
                    <li>Track Your Water Intake: Log your daily water consumption effortlessly.</li>
                    <li>Set Hydration Goals: Customize your daily water goals based on your needs.</li>
                    <li>Stay Consistent: Receive friendly reminders to keep sipping throughout the day.</li>
                    <li>Visualize Your Progress: Monitor your hydration trends with insightful charts.</li>
                </ul>

            </div>
            <p style="text-align: center; color: rgba(64, 123, 255, 0.7); font-size: 13px; margin-bottom: 5px;">Ready to get
                started? Log in now
                and take the
                first step towards a healthier,
                more hydrated you!</p>
            <div style="text-align: center;"><a
                    style="background-color:#407bff;color:#ffffff;padding:10px 20px;text-decoration:none;font-weight:bold;border-radius:5px;display:inline-block;font-size:16px"
                    href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank" rel="noreferrer">Log in now</a></div>
        </div>
    `;
};
