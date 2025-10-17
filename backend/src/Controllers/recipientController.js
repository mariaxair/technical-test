import RecipientModel from "../Models/recipientModel.js";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

// GET all recipients
export const getAllRecipients = async (req, res) => {
  try {
    //pour pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    //pour filtre
    const search = req.query.search || "";

    const model = new RecipientModel(req.app.locals.db);
    const { recipients, total } = await model.getAll({ limit, offset, search });
    res.json({
      data: recipients,
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

// GET valid recipients only
export const getValidRecipients = async (req, res) => {
  try {
    const model = new RecipientModel(req.app.locals.db);
    const recipients = await model.getValid();
    res.json(recipients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // GET recipient by ID
// export const getRecipientById = async (req, res) => {
//   try {
//     const model = new RecipientModel(req.app.locals.db);
//     const recipient = await model.getById(req.params.id);

//     if (!recipient) {
//       return res.status(404).json({ error: "Recipient not found" });
//     }

//     res.json(recipient);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// POST create new recipient
export const createRecipient = async (req, res) => {
  try {
    const { email, name, metadata } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const model = new RecipientModel(req.app.locals.db);

    // Validate email before creating
    try {
      await model.validateEmail(email);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // If validation passes, create the recipient
    const recipient = await model.create({ email, name, metadata });

    res.status(201).json(recipient);
  } catch (error) {
    console.error("❌ Error creating recipient:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// POST bulk import from CSV
export const importRecipientsFromCSV = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const recipients = [];

      // Lecture du fichier CSV
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (row) => {
          recipients.push({
            email: row.email || row.Email,
            name: row.name || row.Name || "",
            metadata: row, // compatibilité traitée dans le model (JSON.stringify)
          });
        })
        .on("end", async () => {
          const model = new RecipientModel(req.app.locals.db);

          try {
            const result = await model.bulkCreate(recipients);

            // Supprimer le fichier après lecture
            fs.unlinkSync(req.file.path);

            // ✅ Réponse améliorée : inclut les emails invalides ignorés
            res.status(200).json({
              message: result.message,
              insertedCount: result.insertedCount,
              skipped: result.skipped || [],
            });
          } catch (error) {
            console.error("❌ Error during bulk import:", error.message);
            res.status(500).json({
              error: "Error during bulk import",
              details: error.message,
            });
          }
        })
        .on("error", (err) => {
          console.error("❌ Error parsing CSV:", err.message);
          res.status(500).json({
            error: `Error parsing CSV: ${err.message}`,
          });
        });
    } catch (error) {
      console.error(
        "❌ General error in importRecipientsFromCSV:",
        error.message
      );
      res.status(500).json({
        error: "Server error",
        details: error.message,
      });
    }
  },
];

// PUT update recipient
export const updateRecipient = async (req, res) => {
  try {
    const { email, name, metadata } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const model = new RecipientModel(req.app.locals.db);
    const recipient = await model.update(req.params.id, {
      email,
      name,
      metadata,
    });

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    res.json(recipient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE recipient
export const deleteRecipient = async (req, res) => {
  try {
    const model = new RecipientModel(req.app.locals.db);
    await model.delete(req.params.id);
    res.json({ message: "Recipient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
