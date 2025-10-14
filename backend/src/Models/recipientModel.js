export default class RecipientModel {
  constructor(db) {
    this.db = db;
  }

  async getAll({ limit, offset, search = "" }) {
    const searchTerm = `%${search}%`;

    const [rows] = await this.db.query(
      `SELECT * FROM recipients 
      where email like ? or name like ? 
      ORDER BY created_at DESC
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
    // const searchTerm = `%${search}%`;

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
    const [result] = await this.db.query(
      "INSERT INTO recipients (email, name, metadata, is_valid) VALUES (?, ?, ?, ?)",
      [email, name, JSON.stringify(metadata || {}), this.validateEmail(email)]
    );
    return {
      id: result.insertId,
      ...data,
      is_valid: this.validateEmail(email),
    };
  }

  // if we bring them from a csv file
  async bulkCreate(recipients) {
    const values = recipients.map((r) => [
      r.email,
      r.name || "",
      JSON.stringify(r.metadata || {}),
      this.validateEmail(r.email),
    ]);

    const placeholders = values.map(() => "(?, ?, ?, ?)").join(","); //reserver les places pour inserer les donnees
    const flatValues = values.flat(); //.flat pour "deplier" pour que MySQL recoive une seule liste de valeurs et les inserer dans les placeholders

    const [result] = await this.db.query(
      `INSERT INTO recipients (email, name, metadata, is_valid) VALUES ${placeholders}`,
      flatValues
    );

    return { insertedCount: result.affectedRows }; //donne le nombre de lignes inserees
  }

  async update(id, data) {
    const { email, name, metadata } = data;
    await this.db.query(
      "UPDATE recipients SET email = ?, name = ?, metadata = ?, is_valid = ? WHERE id = ?",
      [
        email,
        name,
        JSON.stringify(metadata || {}),
        this.validateEmail(email),
        id,
      ]
    );
    return this.getById(id);
  }

  async delete(id) {
    await this.db.query("DELETE FROM recipients WHERE id = ?", [id]);
    return { success: true };
  }

  //from gpt
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
