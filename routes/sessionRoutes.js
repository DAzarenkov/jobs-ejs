const express = require("express");
const passport = require("passport");
const csrf = require("host-csrf"); // <-- добавляем импорт
const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(registerDo);

router
  .route("/logon")
  .get(logonShow)
  .post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("/sessions/logon");

      req.logIn(user, (err) => {
        if (err) return next(err);

        // Create a new CSRF token for the new session
        csrf.refreshToken(req, res);

        return res.redirect("/");
      });
    })(req, res, next);
  });

router.route("/logoff").post(logoff);

module.exports = router;
