import { Router } from "express";
import { getDashboard } from "../services/dashboardService.js";
import { createWorkItem, getWorkspace, listWorkspaces } from "../services/workspaceService.js";
const router = Router();
router.get("/", (_req, res) => res.render("dashboard", { dashboard: getDashboard() }));
router.get("/workspaces", (req, res) => res.render("workspaces", { workspaces: listWorkspaces(String(req.query.query || "")), query: String(req.query.query || "") }));
router.get("/workspaces/:code", (req, res) => {
  const detail = getWorkspace(req.params.code);
  if (!detail) return res.status(404).render("workspace_detail", { detail: null });
  return res.render("workspace_detail", { detail });
});
router.get("/work-items/new", (_req, res) => res.render("new_item", { error: null }));
router.post("/work-items", (req, res) => {
  try {
    createWorkItem(req.body);
    return res.redirect(`/workspaces/${req.body.workspace_code}`);
  } catch (error) {
    return res.status(400).render("new_item", { error: error instanceof Error ? error.message : "unknown" });
  }
});
export default router;
