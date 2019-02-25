var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var trackSchema = new Schema({
  title: String,
  description: String,
  elapsed: Number,
  runningSince: Number,
  updateDate: String
});
trackSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {    }
});
module.exports = mongoose.model('Track', trackSchema);