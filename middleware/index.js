var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  // Is user logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampGround) {
      if (err) {
        res.redirect("back");
      } else {
        // If logged in, does user own campground
        if (foundCampGround.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  // Is user logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // If logged in, does user own comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
