import db from "../db.js";
export function listWorkspaces(search = "") {
  const token = `%${search.toLowerCase()}%`;
  return db.prepare(`
    SELECT w.code, w.name, w.summary, w.status, w.owner, COUNT(i.id) AS item_count
    FROM workspaces w
    LEFT JOIN work_items i ON i.workspace_code = w.code
    WHERE LOWER(w.name) LIKE ? OR LOWER(w.summary) LIKE ? OR LOWER(w.code) LIKE ?
    GROUP BY w.code
    ORDER BY w.name ASC
  `).all(token, token, token);
}
export function getWorkspace(code: string) {
  const workspace = db.prepare("SELECT code, name, summary, status, owner FROM workspaces WHERE code = ?").get(code);
  if (!workspace) return null;
  const items = db.prepare(`SELECT id, workspace_code, title, stage, priority, due_date FROM work_items WHERE workspace_code = ? ORDER BY due_date ASC`).all(code);
  return { workspace, items };
}
export function createWorkItem(payload: Record<string, string>) {
  for (const key of ["workspace_code", "title", "stage", "priority", "due_date", "details"]) {
    if (!payload[key]?.trim()) throw new Error(`缺少字段: ${key}`);
  }
  db.prepare("INSERT INTO work_items (workspace_code, title, stage, priority, due_date, details) VALUES (?, ?, ?, ?, ?, ?)")
    .run(payload.workspace_code, payload.title, payload.stage, payload.priority, payload.due_date, payload.details);
}
