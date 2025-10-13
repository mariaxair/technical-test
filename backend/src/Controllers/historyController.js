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

// // GET history by ID
// export const getHistoryByRecipientNameOrId = async (req, res) => {
//   const { id, name } = req.params;
//   const model = new HistoryModel(req.app.locals.db);

//   try {
//     let history;
//     if (id) {
//       history = await model.getByRecipientIdOrName(id);
//     } else if (name) {
//       history = await model.getByRecipientIdOrName(name);
//     } else {
//       return res
//         .status(400)
//         .json({ error: "Please provide either id or name" });
//     }

//     if (!history || history.length === 0) {
//       return res.status(404).json({ error: "No history found" });
//     }

//     res.json(history);
//   } catch (error) {
//     console.error("Error fetching history:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // GET email history by template
// export const getHistoryByTemplate = async (req, res) => {
//   try {
//     const model = new HistoryModel(req.app.locals.db);
//     const history = await model.getByTemplate(req.params.name);

//     if (!history || history.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No history found for this template" });
//     }

//     res.json(history);
//   } catch (error) {
//     console.error("Error fetching history by template:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

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
