const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const pagination = require("../utils/pagination");

const Schema = mongoose.Schema;

const dossierSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, trim: true, required: true },
  slug: { type: String, required: true, index: true, trim: true, unique: true },
  description: { type: String, trim: true },
  image: { type: String }
});

dossierSchema.plugin(timestamps);
dossierSchema.plugin(pagination);
module.exports = mongoose.model("Dossier", dossierSchema);
