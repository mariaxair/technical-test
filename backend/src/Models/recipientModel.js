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

  async create(data) {
    const { email, name, metadata } = data;

    // wait for validation before inserting
    const isValid = await this.validateEmail(email);

    const [result] = await this.db.query(
      "INSERT INTO recipients (email, name, metadata, is_valid) VALUES (?, ?, ?, ?)",
      [email, name, JSON.stringify(metadata || {}), isValid ? 1 : 0]
    );

    return {
      id: result.insertId,
      ...data,
      is_valid: isValid,
    };
  }

  // if we bring them from a csv file
  async bulkCreate(recipients) {
    const values = [];

    for (const r of recipients) {
      const isValid = await this.validateEmail(r.email);
      values.push([
        r.email,
        r.name || "",
        JSON.stringify(r.metadata || {}),
        isValid ? 1 : 0,
      ]);
    }

    const placeholders = values.map(() => "(?, ?, ?, ?)").join(",");
    const flatValues = values.flat();

    const [result] = await this.db.query(
      `INSERT INTO recipients (email, name, metadata, is_valid) VALUES ${placeholders}`,
      flatValues
    );

    return { insertedCount: result.affectedRows };
  }

  async update(id, data) {
    const { email, name, metadata } = data;

    // Await the email validation before using it
    const isValid = await this.validateEmail(email);

    await this.db.query(
      "UPDATE recipients SET email = ?, name = ?, metadata = ?, is_valid = ? WHERE id = ?",
      [email, name, JSON.stringify(metadata || {}), isValid ? 1 : 0, id]
    );

    return this.getById(id);
  }

  async delete(id) {
    await this.db.query("DELETE FROM recipients WHERE id = ?", [id]);
    return { success: true };
  }

  //from gpt
  async validateEmail(email) {
    // Step 1: basic regex check (fast local filter)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      console.warn(`❌ Invalid email format: ${email}`);
      return false;
    }

    // Step 2: optional Kickbox verification
    try {
      const res = await axios.get(`https://api.kickbox.com/v2/verify`, {
        params: {
          email,
          apikey: process.env.KICKBOX_API_KEY,
        },
      });

      // Possible results: "deliverable", "undeliverable", "risky", "unknown"
      if (res.data.result === "deliverable") {
        console.log(`✅ Email deliverable: ${email}`);
        return true;
      } else {
        console.warn(`⚠️ Email not deliverable (${res.data.result}): ${email}`);
        return false;
      }
    } catch (err) {
      console.error("⚠️ Kickbox verification failed:", err.message);
      // You can choose what to do if Kickbox API fails:
      // return false;  → reject if uncertain
      // return true;   → accept temporarily
      return true;
    }
  }
}
