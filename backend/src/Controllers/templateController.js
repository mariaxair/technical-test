import TemplateModel from "../Models/templateModel.js";

// GET all templates
export const getAllTemplates = async (req, res) => {
  try {
    //pour pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    //pour filtre
    const search = req.query.search || "";

    //appel au modele
    const model = new TemplateModel(req.app.locals.db);
    const { templates, total } = await model.getAll({ limit, offset, search });
    res.json({
      data: templates,
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

export const getTemplateForSelection = async (req, res) => {
  try {
    const model = new TemplateModel(req.app.locals.db);
    const templates = await model.getAllForSelection();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create new template
export const createTemplate = async (req, res) => {
  try {
    const { name, subject, body, variables } = req.body;

    if (!name || !subject || !body) {
      return res
        .status(400)
        .json({ error: "Name, subject, and body are required" });
    }

    const model = new TemplateModel(req.app.locals.db);
    const template = await model.create({ name, subject, body, variables });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update template
export const updateTemplate = async (req, res) => {
  try {
    const { name, subject, body, variables } = req.body;

    if (!name || !subject || !body) {
      return res
        .status(400)
        .json({ error: "Name, subject, and body are required" });
    }

    const model = new TemplateModel(req.app.locals.db);
    const template = await model.update(req.params.id, {
      name,
      subject,
      body,
      variables,
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE template
export const deleteTemplate = async (req, res) => {
  try {
    const model = new TemplateModel(req.app.locals.db);
    await model.delete(req.params.id);
    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
