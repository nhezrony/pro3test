const path = require("path");
const public = path.join(__dirname, "../public")

module.exports = function (app) {
    app.get("/", (req, res) => res.sendFile(`${public}/index.html`));
    app.get("/profile", (req, res) => res.sendFile(`${public}/userProfile.html`));
    // app.get("*", (req, res) => res.sendFile(`${public}/index.html`));
}