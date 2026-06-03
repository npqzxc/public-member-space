import db from "../db.js";
export function getDashboard() {
  const workspaceTotal = (db.prepare("SELECT COUNT(*) AS count FROM workspaces").get() as { count: number }).count;
  const activeItems = (db.prepare("SELECT COUNT(*) AS count FROM work_items WHERE stage IN ('active','review')").get() as { count: number }).count;
  const urgentItems = (db.prepare("SELECT COUNT(*) AS count FROM work_items WHERE priority = 'urgent'").get() as { count: number }).count;
  const upcoming = db.prepare(`SELECT workspace_code, title, due_date, stage FROM work_items ORDER BY due_date ASC LIMIT 5`).all();
  return { workspaceTotal, activeItems, urgentItems, upcoming };
}
