import HistoryModel from "../Models/historyModel.js";

// GET all email history
export const getAllHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const model = new HistoryModel(req.app.locals.db);
    const history = await model.getAllv2(limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET history by ID
export const getHistoryById = async (req, res) => {
  try {
    const model = new HistoryModel(req.app.locals.db);
    const history = await model.getById(req.params.id);

    if (!history) {
      return res.status(404).json({ error: "History entry not found" });
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET email history by template
export const getHistoryByTemplate = async (req, res) => {
  try {
    const model = new HistoryModel(req.app.locals.db);
    const history = await model.getByTemplate(req.params.templateId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET statistics
export const getHistoryStats = async (req, res) => {
  try {
    const model = new HistoryModel(req.app.locals.db);
    const stats = await model.getStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
