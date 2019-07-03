var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // 'excerpt' is required and of type String
  excerpt: {
      type: String,
      required: true
  },

  //save article or not
  saved: {
    type: Boolean,
    required: true,
    default: false
  },

  //delete article or not
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },

  //date is set when article is added to database
  date: {
    type: Date,
    default: Date.now
  },

  // notes is an array of reference ids
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note",
    required: false
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
