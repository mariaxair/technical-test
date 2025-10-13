import TemplateModel from "../Models/templateModel.js";

// GET all templates
export const getAllTemplates = async (req, res) => {
  try {
    const model = new TemplateModel(req.app.locals.db);
    const templates = await model.getAll();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET template by ID
export const getTemplateById = async (req, res) => {
  try {
    const model = new TemplateModel(req.app.locals.db);
    const template = await model.getById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json(template);
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