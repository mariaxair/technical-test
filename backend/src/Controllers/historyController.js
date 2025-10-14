import HistoryModel from "../Models/historyModel.js";

// GET all email history
export const getAllHistory = async (req, res) => {
  try {
    //pour pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    //pour filtre
    const search = req.query.search || "";

    const model = new HistoryModel(req.app.locals.db);
    const {history, total} = await model.getAllv2({ limit, offset, search });
    res.json({
      data: history,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
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
