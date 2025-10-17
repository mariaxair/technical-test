import EmailModel from "../Models/emailModel.js";


// POST send bulk emails
export const sendBulk = async (req, res) => {
  try {
    const { templateId, recipientIds } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    const model = new EmailModel(req.app.locals.db);
    const results = await model.sendBulk(templateId, {recipientIds});

    res.json({
      message: "Bulk email sending completed",
      ...results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
