const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const pagination = require("../utils/pagination");
const role = require("../../constants/userRoles");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, trim: true, max: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String },
  role: { type: Number, enum: [role.Root, role.Admin, role.User], default: role.User }
});

userSchema.plugin(timestamps);
userSchema.plugin(pagination);
module.exports = mongoose.model("User", userSchema);
