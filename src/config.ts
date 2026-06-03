import path from "node:path";
export const config = {
  port: Number(process.env.PORT || 3000),
  dbPath: process.env.DB_PATH || path.join(process.cwd(), "data", "member-canvas.sqlite3"),
  title: "Member Canvas",
  domain: "会员协作",
};
