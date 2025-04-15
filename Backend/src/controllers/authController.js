const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "E-Mail und Passwort sind erforderlich" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Benutzer nicht gefunden" });
    }

    if (user.banned?.isBanned === true) {
      return res
        .status(403)
        .json({ message: "Ihr Konto wurde gesperrt. Bitte wenden Sie sich an den Support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Falsches Passwort" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      access_token: token,
      refresh_token: process.env.JWT_REFRESH_SECRET_KEY,
      role: user.role,
    });
  } catch (error) {
    console.error("Fehler beim Login:", error);
    res.status(500).json({
      message: "Fehler beim Login. Bitte versuchen Sie es später erneut.",
    });
  }
};

exports.register = async (req, res) => {
  const {
    vorname,
    nachname,
    spitzname,
    email,
    password,
    role,
    securityQuestion,
    securityAnswer,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).send("Benutzer existiert bereits.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

    const newUser = new User({
      vorname,
      nachname,
      spitzname,
      email,
      password: hashedPassword,
      role,
      securityQuestion,
      securityAnswer: hashedSecurityAnswer,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role,},
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role,},
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({
        message: "Benutzer erfolgreich registriert",
        token: token,
        refresh_token: refreshToken,
      });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    res
      .status(500)
      .json({
        message:
          "Fehler bei der Registrierung. Bitte versuche es später erneut.",
      });
  }
};

exports.createUserByAdmin = async (req, res) => {
  const {
    vorname,
    nachname,
    spitzname,
    email,
    password,
    role,
    securityQuestion,
    securityAnswer,
  } = req.body;

  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Nur Admins dürfen Benutzer anlegen." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Benutzer existiert bereits." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

    const newUser = new User({
      vorname,
      nachname,
      spitzname,
      email,
      password: hashedPassword,
      role,
      securityQuestion,
      securityAnswer: hashedSecurityAnswer,
    });

    await newUser.save();

    res.status(201).json({ message: "Benutzer erfolgreich durch Admin erstellt" });
  } catch (error) {
    console.error("Fehler beim Admin-User-Erstellen:", error);
    res.status(500).json({ message: "Fehler beim Erstellen des Benutzers." });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Soft-Delete aufgerufen mit ID:', userId);

    const user = await User.findByIdAndUpdate(userId, { geloescht: true }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.status(200).json({ message: "Benutzer wurde als gelöscht markiert" });
  } catch (error) {
    console.error("Fehler beim Soft-Delete:", error);
    res.status(500).json({ message: "Interner Serverfehler beim Löschen" });
  }
};

exports.banUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { ban } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, { ban }, { new: true });

    if (!updatedUser) return res.status(404).json({ message: 'User nicht gefunden' });

    res.status(200).json({ message: 'User wurde gebannt' });
  } catch (error) {
    console.error('Fehler beim Bann:', error);
    res.status(500).json({ message: 'Interner Serverfehler beim Bann' });
  }
};