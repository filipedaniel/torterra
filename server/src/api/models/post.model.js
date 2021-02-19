const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const pagination = require("../utils/pagination");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, index: true, unique: true },
  description: { type: String, trim: true },
  featureImage: { type: String, trim: true },
  images: [{
    url: { type: String, trim: true },
  }],
  content: { type: String },
  date: { type: Date },
  author: { type: String, trim: true },
  dossier: { type: Schema.Types.ObjectId, ref: "Dossier" }
});

postSchema.plugin(timestamps);
postSchema.plugin(pagination);
module.exports = mongoose.model("Post", postSchema);
