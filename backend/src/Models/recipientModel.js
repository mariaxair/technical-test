import axios from "axios";

export default class RecipientModel {
  constructor(db) {
    this.db = db;
  }

  async getAll({ limit, offset, search = "" }) {
    const searchTerm = `%${search}%`;

    const [rows] = await this.db.query(
      `SELECT * FROM recipients 
      where email like ? or name like ? 
      ORDER BY name ASC
      LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, limit, offset]
    );

    const [[{ total }]] = await this.db.query(
      `SELECT COUNT(*) AS total FROM recipients
      where name like ? or email like ?`,
      [searchTerm, searchTerm]
    );

    return { recipients: rows, total };
  }

  async getValid() {
    const [rows] = await this.db.query(
      "SELECT * FROM recipients WHERE is_valid = 1"
    );
    return rows;
  }

  async getById(id) {
    const [rows] = await this.db.query(
      "SELECT * FROM recipients WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  async create({ email, name, metadata }) {
    // Validate email before inserting
    const isValid = await this.validateEmail(email);
    if (!isValid) {
      throw new Error(`Email not deliverable: ${email}`);
    }

    const [result] = await this.db.query(
      "INSERT INTO recipients (email, name, metadata, is_valid) VALUES (?, ?, ?, ?)",
      [email, name, JSON.stringify(metadata || {}), isValid ? 1 : 0]
    );

    return { id: result.insertId, email, name, metadata };
  }

  // if we bring them from a csv file
  async bulkCreate(recipients) {
    const validValues = [];
    const invalidEmails = [];

    for (const r of recipients) {
      try {
        const isValid = await this.validateEmail(r.email);

        if (isValid) {
          validValues.push([
            r.email,
            r.name || "",
            JSON.stringify(r.metadata || {}),
            1, // is_valid = true
          ]);
        } else {
          invalidEmails.push(r.email);
        }
      } catch (error) {
        console.warn(`⚠️ Error validating email ${r.email}: ${error.message}`);
        invalidEmails.push(r.email);
      }
    }

    // If no valid emails, return message early
    if (validValues.length === 0) {
      return {
        insertedCount: 0,
        skipped: invalidEmails,
        message: "No valid recipients found — all skipped.",
      };
    }

    // Prepare query
    const placeholders = validValues.map(() => "(?, ?, ?, ?)").join(",");
    const flatValues = validValues.flat();

    const [result] = await this.db.query(
      `INSERT INTO recipients (email, name, metadata, is_valid) VALUES ${placeholders}`,
      flatValues
    );

    return {
      insertedCount: result.affectedRows,
      skipped: invalidEmails,
      message: `${result.affectedRows} valid recipients added, ${invalidEmails.length} skipped.`,
    };
  }

  async delete(id) {
    await this.db.query("DELETE FROM recipients WHERE id = ?", [id]);
    return { success: true };
  }

  //from gpt
  async validateEmail(email) {
    // Step 1: Basic regex check (local validation)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      console.warn(`❌ Invalid email format: ${email}`);
      throw new Error(`Invalid email format: ${email}`); // ❗ Use throw instead of return false
    }

    // Step 2: Kickbox verification
    try {
      const res = await axios.get("https://api.kickbox.com/v2/verify", {
        params: { email, apikey: process.env.KICKBOX_API_KEY },
      });

      if (res.data.result !== "deliverable") {
        console.warn(`⚠️ Email not deliverable (${res.data.result}): ${email}`);
        return false; // ✅ Return false instead of throwing
      }

      console.log(`✅ Email deliverable: ${email}`);
      return true;
    } catch (err) {
      console.error("⚠️ Kickbox verification failed:", err.message);
      return false; // safer — don’t insert if uncertain
    }
  }
}
