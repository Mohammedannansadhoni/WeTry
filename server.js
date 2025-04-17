const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/images'));
app.use(bodyParser.json());

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index1.html"));


});

app.post("/submit_form2.php", async (req, res) => {
  const { first_name, last_name, email } = req.body;


  if (!first_name || !last_name || !email) {
    return res.send("Missing required fields");
  }

  const fullName = `${first_name} ${last_name}`;


  const qrText = `Name: ${fullName}\nEmail: ${email}`;
  const qrImage = await QRCode.toDataURL(qrText);

  // Email the QR code
  let transporter = nodemailer.createTransport({
    service: "Gmail", // or your SMTP settings
    auth: {
      user: "annanadhoni77@gmail.com",
      pass: "Annan@1035"
    }
  });

  let mailOptions = {
    from: "The Drive Program <your.email@gmail.com>",
    to: email,
    subject: "Registration Successful",
    html: `<h3>Hello ${fullName},</h3><p>You have successfully registered for The Drive Program.</p><img src="${qrImage}" alt="QR Code">`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render("success", { name: fullName, qr: qrImage });
  } catch (err) {
    console.error(err);
    res.send("Error sending email.");
  }
  console.log("Body received:", req.body);

});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
