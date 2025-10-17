import nodemailer from "nodemailer";

export default class EmailModel {
  constructor(db) {
    this.db = db;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      logger: true,
      debug: true,
    });
  }

  async sendBulk(templateId, { recipientIds }) {
    const template = await this.getTemplate(templateId);
    const recipients = await this.getRecipients({ recipientIds });

    const results = {
      total: recipients.length,
      sent: 0,
      failed: 0,
      details: [],
    };

    for (const recipient of recipients) {
      try {
        //récupérer les variables dynamiques
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

        //compléter les infos de base
        metadata = {
          ...metadata,
          name: recipient.name || metadata.name || "Valued Customer",
          email: recipient.email,
        };

        //générer le corps de l’email
        const personalizedBody = this.replaceVariables(template.body, metadata);

        // envoi
        await this.transporter.sendMail({
          from: `"SEAAL" <no-reply@gmail.com>`,
          to: recipient.email,
          subject: this.replaceVariables(template.subject, metadata),
          html: personalizedBody,
        });

        await this.logEmail(
          templateId,
          template.name,
          template.subject,
          recipient.id,
          recipient.name,
          recipient.email,
          "sent",
          null
        );
        results.sent++;
        results.details.push({ email: recipient.email, status: "sent" });
      } catch (error) {
        console.error("❌ Error sending email:", error);
        await this.logEmail(
          templateId,
          template.name,
          template.subject,
          recipient.id,
          recipient.name,
          recipient.email,
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

  async getRecipients({ recipientIds, recipientName }) {
    if (recipientIds && recipientIds.length > 0) {
      const placeholders = recipientIds.map(() => "?").join(",");
      const [rows] = await this.db.query(
        `SELECT * FROM recipients WHERE id IN (${placeholders}) AND is_valid = 1`,
        recipientIds
      );
      return rows;
    }

    if (recipientName) {
      const [rows] = await this.db.query(
        "SELECT * FROM recipients WHERE name LIKE ? AND is_valid = 1",
        [`%${recipientName}%`]
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

  async logEmail(
    templateId,
    templateName,
    templateSubject,
    recipientId,
    recipientName,
    recipientEmail,
    status,
    error
  ) {
    await this.db.query(
      "INSERT INTO history (template_id, template_name, template_subject, recipient_id, recipient_name, recipient_email, status, error_message) VALUES (?, ?,?, ?, ?, ?, ?, ?)",
      [
        templateId,
        templateName,
        templateSubject,
        recipientId,
        recipientName,
        recipientEmail,
        status,
        error,
      ]
    );
  }
}
