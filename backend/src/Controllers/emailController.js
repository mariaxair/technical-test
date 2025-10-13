import EmailModel from "../Models/emailModel.js";


// POST send bulk emails
export const sendBulk = async (req, res) => {
  try {
    const { templateId, recipientIds } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    const model = new EmailModel(req.app.locals.db);
    const results = await model.sendBulk(templateId, recipientIds);

    res.json({
      message: "Bulk email sending completed",
      ...results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST test email
// export const testEmail = async (req, res) => {
//   try {
//     const { templateId, testEmail } = req.body;

//     if (!templateId || !testEmail) {
//       return res
//         .status(400)
//         .json({ error: "Template ID and test email are required" });
//     }

//     const model = new EmailModel(req.app.locals.db);
//     const template = await model.getTemplate(templateId);

//     if (!template) {
//       return res.status(404).json({ error: "Template not found" });
//     }

//     await model.transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: testEmail,
//       subject: `[TEST] ${template.subject}`,
//       html: template.body,
//     });

//     res.json({ message: "Test email sent successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };