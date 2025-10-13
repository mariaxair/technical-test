import nodemailer from "nodemailer";

export default class EmailModel {
  constructor(db) {
    this.db = db;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      logger: true,
      debug: true,
    });
  }

  async sendBulk(templateId, recipientIds) {
    const template = await this.getTemplate(templateId);
    const recipients = await this.getRecipients(recipientIds);

    const results = {
      total: recipients.length,
      sent: 0,
      failed: 0,
      details: [],
    };

    for (const recipient of recipients) {
      try {
        // ✅ Étape 1 : récupérer les variables dynamiques
        let metadata = {};
        try {
          if (recipient.metadata) {
            if (typeof recipient.metadata === "string") {
              metadata = JSON.parse(recipient.metadata);
            } else if (typeof recipient.metadata === "object") {
              metadata = recipient.metadata;
            }
          }
        } catch (err) {
          console.warn("⚠️ Invalid metadata for recipient:", recipient.email);
          metadata = {};
        }

        // ✅ Étape 2 : compléter les infos de base
        metadata = {
          ...metadata,
          name: recipient.name || metadata.name || "Valued Customer",
          email: recipient.email,
        };

        // ✅ Étape 3 : générer le corps de l’email
        const personalizedBody = this.replaceVariables(template.body, metadata);

        // ✅ Étape 4 : envoi
        await this.transporter.sendMail({
          from: process.env.SMTP_USER,
          to: recipient.email,
          subject: this.replaceVariables(template.subject, metadata),
          html: personalizedBody,
        });

        await this.logEmail(templateId, recipient.id, "sent", null);
        results.sent++;
        results.details.push({ email: recipient.email, status: "sent" });
      } catch (error) {
        console.error("❌ Error sending email:", error);
        await this.logEmail(
          templateId,
          recipient.id,
          "failed",
          error.message || JSON.stringify(error)
        );
        results.failed++;
        results.details.push({
          email: recipient.email,
          status: "failed",
          error: error.message,
        });
      }
    }

    return results;
  }

  async getTemplate(templateId) {
    const [rows] = await this.db.query("SELECT * FROM templates WHERE id = ?", [
      templateId,
    ]);
    return rows[0];
  }

  async getRecipients(recipientIds) {
    if (recipientIds && recipientIds.length > 0) {
      const placeholders = recipientIds.map(() => "?").join(",");
      const [rows] = await this.db.query(
        `SELECT * FROM recipients WHERE id IN (${placeholders}) AND is_valid = 1`,
        recipientIds
      );
      return rows;
    }

    const [rows] = await this.db.query(
      "SELECT * FROM recipients WHERE is_valid = 1"
    );
    return rows;
  }

  replaceVariables(text, variables) {
    if (!text || typeof text !== "string") return text;

    // ✅ remplace toutes les {{clé}} présentes dans le texte
    return text.replace(/{{(.*?)}}/g, (_, key) => {
      const value = variables[key.trim()];
      return value !== undefined ? value : "";
    });
  }

  async logEmail(templateId, recipientId, status, error) {
    await this.db.query(
      "INSERT INTO history (template_id, recipient_id, status, error_message) VALUES (?, ?, ?, ?)",
      [templateId, recipientId, status, error]
    );
  }
}
