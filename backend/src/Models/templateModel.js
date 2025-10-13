export default class TemplateModel {
  constructor(db) {
    this.db = db;
  }

  async getAll({ limit, offset }) {
    const [rows] = await this.db.query(
      "SELECT * FROM templates ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const [[{ total }]] = await this.db.query(
      "SELECT COUNT(*) AS total FROM templates"
    );

    return { templates: rows, total };
  }

  async getById(id) {
    const [rows] = await this.db.query("SELECT * FROM templates WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  async create(data) {
    const { name, subject, body, variables } = data;
    const [result] = await this.db.query(
      "INSERT INTO templates (name, subject, body, variables) VALUES (?, ?, ?, ?)",
      [name, subject, body, JSON.stringify(variables || [])] // (variables || []) permet de mettre un tableau vide si variables est undefined
    );
    return { id: result.insertId, ...data }; //result.insertId est l'id autogeneré du template inséré
  }

  async update(id, data) {
    const { name, subject, body, variables } = data;
    await this.db.query(
      "UPDATE templates SET name = ?, subject = ?, body = ?, variables = ? WHERE id = ?",
      [name, subject, body, JSON.stringify(variables || []), id]
    );
    return this.getById(id);
  }

  async delete(id) {
    await this.db.query("DELETE FROM templates WHERE id = ?", [id]);
    return { success: true };
  }
}
