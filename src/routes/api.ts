import { Router } from "express";
import { getDashboard } from "../services/dashboardService.js";
import { getWorkspace, listWorkspaces } from "../services/workspaceService.js";
const router = Router();
router.get("/dashboard", (_req, res) => res.json(getDashboard()));
router.get("/workspaces", (req, res) => res.json({ items: listWorkspaces(String(req.query.query || "")) }));
router.get("/workspaces/:code", (req, res) => {
  const detail = getWorkspace(req.params.code);
  if (!detail) return res.status(404).json({ error: "not_found" });
  return res.json(detail);
});
export default router;
