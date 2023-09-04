const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const tepi = require("trilium-etapi").default;

dotenv.config();

const widget = path.join(__dirname, "..", "src", "widget.js");

tepi.token(process.env.TRILIUM_ETAPI_TOKEN);
tepi.putNoteContentById(process.env.NOTE_ID, fs.readFileSync(widget).toString());