import Database from "better-sqlite3";
import fs from "node:fs";
import { config } from "./config.js";
fs.mkdirSync("data", { recursive: true });
const db = new Database(config.dbPath);
db.exec(`
CREATE TABLE IF NOT EXISTS workspaces (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL,
  owner TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS work_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_code TEXT NOT NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL,
  priority TEXT NOT NULL,
  due_date TEXT NOT NULL,
  details TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_item_id INTEGER NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`);
const count = db.prepare("SELECT COUNT(*) AS count FROM workspaces").get() as { count: number };
if (count.count === 0) {
  db.prepare("INSERT INTO workspaces (code, name, summary, status, owner) VALUES (?, ?, ?, ?, ?)").run("NORTH", "North 会员分组", "负责核心会员协作的周计划和复盘。", "active", "mia");
  db.prepare("INSERT INTO workspaces (code, name, summary, status, owner) VALUES (?, ?, ?, ?, ?)").run("SOUTH", "South 会员分组", "处理跨团队协同、外部资源和延期事项。", "review", "riley");
  db.prepare("INSERT INTO workspaces (code, name, summary, status, owner) VALUES (?, ?, ?, ?, ?)").run("EAST", "East 会员分组", "聚焦排期风险、依赖同步和总结输出。", "active", "joel");
  const insertItem = db.prepare("INSERT INTO work_items (workspace_code, title, stage, priority, due_date, details) VALUES (?, ?, ?, ?, ?, ?)");
  insertItem.run("NORTH", "Refresh weekly intake rules", "draft", "high", "2026-06-06", "需要更新 intake 规则，避免重复分配到同一个 owner。");
  insertItem.run("NORTH", "Audit unresolved notes", "active", "medium", "2026-06-08", "梳理近两周未关闭的备注和风险项。");
  insertItem.run("SOUTH", "Align sponsor handoff pack", "review", "high", "2026-06-04", "补齐 handoff 文档，减少跨团队交接信息缺失。");
  insertItem.run("EAST", "Backfill recap timeline", "blocked", "urgent", "2026-05-30", "历史 recap 缺少结构化时间线，需要修复。");
}
export default db;
