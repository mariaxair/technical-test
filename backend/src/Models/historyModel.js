export default class HistoryModel {
  constructor(db) {
    this.db = db;
  }

  async getAllv1(limit) {
    const [rows] = await this.db.query(
      `select
        t.name as template_name,
        t.subject as template_subject,
        r.email as recipient_email, 
        r.name as recipient_name, 
        h.status , 
        h.error_message, 
        h.sent_at
      from history h, templates t, recipients r
      where h.template_id = t.id and h.recipient_id = r.id
      order by h.sent_at desc
      limit ?`,
      [limit]
    );
    return rows;
  }

  async getAllv2(limit) {
    //cette version garde mm les lignes supprimees avec des NULL dans les colonnes des tables jointes (templates et recipients)
    const [rows] = await this.db.query(
      `select
        t.name as template_name,
        t.subject as template_subject,
        r.email as recipient_email, 
        r.name as recipient_name, 
        h.status , 
        h.error_message, 
        h.sent_at
      from history h 
      left join templates t on h.template_id = t.id
      left join recipients r on h.recipient_id = r.id  
      order by h.sent_at desc
      limit ?`,
      [limit]
    );
    return rows;
  }

  async getById(id) {
    const [rows] = await this.db.query(
      `SELECT 
        eh.*,
        t.name as template_name,
        t.subject as template_subject,
        t.body as template_body,
        r.email as recipient_email,
        r.name as recipient_name
      FROM email_history eh
      LEFT JOIN templates t ON eh.template_id = t.id
      LEFT JOIN recipients r ON eh.recipient_id = r.id
      WHERE eh.id = ?`,
      [id]
    );
    return rows[0];
  }

  async getByTemplate(templateId) {
    // (LEFT JOIN templates t ON h.template_id = t.id)  pour le lien logique
    // (WHERE h.template_id = ?) pour le filtre
    const [rows] = await this.db.query(
      `select 
        h.id,
        h.status,
        h.error_message,
        h.sent_at,
        t.name as template_name,
        t.subject as template_subject,
        t.body as template_body,
        r.email as recipient_email,
        r.name as recipient_name
      FROM history h
      LEFT JOIN recipients r ON h.recipient_id = r.id
      LEFT JOIN templates t ON h.template_id = t.id  
      WHERE h.template_id = ?
      ORDER BY h.sent_at DESC`,
      [templateId]
    );
    return rows;
  }

  async getStatistics() {
    const [stats] = await this.db.query(
      `select 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM email_history`
    );
    return stats[0];
  }
}
