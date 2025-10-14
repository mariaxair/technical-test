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

  async getAllv2({ limit, offset, search = "" }) {
    const searchTerm = `%${search}%`;

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
      where t.name like ? or t.subject like ? or r.name like ? or r.email like ?
      order by h.sent_at desc
      limit ? offset ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset]
    );

    const [countRows] = await this.db.query(
      `SELECT COUNT(*) AS total
     FROM history h
     LEFT JOIN templates t ON h.template_id = t.id
     LEFT JOIN recipients r ON h.recipient_id = r.id
     WHERE
       t.name LIKE ? OR
       t.subject LIKE ? OR
       r.name LIKE ? OR
       r.email LIKE ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const total = countRows[0].total;

    return { history: rows, total };
  }

  async getStatistics() {
    const [stats] = await this.db.query(
      `select 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM history`
    );
    return stats[0];
  }
}
