const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { recordFailedLogin, clearAttempts } = require('../utils/loginAttemptTracker');
const { banUserTemporarily } = require('../utils/autoBan');
const User = require("../models/userModel");

exports.login = async (req, res) => {
  const { email, password, } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Benutzer nicht gefunden' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const failedCount = recordFailedLogin(email);
      if (failedCount >= 5) {
        if (!user.banned?.isBanned) {
          await banUserTemporarily(user._id, 'Zu viele Loginversuche', 10);
        }
        return res.status(429).json({
          message: 'Zu viele Fehlversuche. Du wurdest temporär gebannt.'
        });
      }

      return res.status(401).json({ message: 'Falsches Passwort' });
    }

    // Bei erfolgreichem Login: Versuche zurücksetzen
    clearAttempts(email);

    // Auto-Entbannung bei abgelaufenem Bann
    if (user.banned?.isBanned && user.banned.until) {
      const now = new Date();
      const banEnd = new Date(user.banned.until);

      if (banEnd < now) {
        user.banned = {
          isBanned: false,
          reason: '',
          until: null
        };
        await user.save();
        user = await User.findById(user._id);
      }
    }

// Wenn Benutzer noch gebannt ist
    if (user.banned?.isBanned) {
      const until = user.banned.until 
        ? new Date(user.banned.until).toLocaleString('de-DE') 
        : 'auf unbestimmte Zeit';
    
      return res.status(403).json({
        message: `Du bist gebannt bis: ${until}`,
        banned: user.banned
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login erfolgreich',
      token,
      refresh_token: refreshToken,
      role: user.role,
      banned: user.banned
    });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ message: 'Interner Serverfehler beim Login' });
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
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Benutzer erfolgreich registriert",
      token: token,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    res.status(500).json({
      message: "Fehler bei der Registrierung. Bitte versuche es später erneut.",
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
      return res
        .status(403)
        .json({ message: "Nur Admins dürfen Benutzer anlegen." });
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

    res
      .status(201)
      .json({ message: "Benutzer erfolgreich durch Admin erstellt" });
  } catch (error) {
    console.error("Fehler beim Admin-User-Erstellen:", error);
    res.status(500).json({ message: "Fehler beim Erstellen des Benutzers." });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { geloescht: true },
      { new: true }
    );

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

    const { isBanned, reason, until } = req.body.banned || {};

    const bannedData = isBanned
      ? {
          isBanned: true,
          reason: reason || '',
          until: until || null,
        }
      : {
          isBanned: false,
          reason: '',
          until: null,
        };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { banned: bannedData } },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: 'User nicht gefunden' });

    res.status(200).json({ message: isBanned ? 'User wurde gebannt' : 'User wurde entbannt' });
  } catch (error) {
    console.error('Fehler beim Bann:', error);
    res.status(500).json({ message: 'Interner Serverfehler beim Bann' });
  }
};

exports.checkUnbans = async (req, res) => {
  try {
    const users = await User.find({ 'banned.isBanned': true });

    let unbannedCount = 0;

    for (const user of users) {
      if (
        user.banned.until &&
        new Date(user.banned.until) < new Date()
      ) {
        user.banned.isBanned = false;
        user.banned.reason = '';
        user.banned.until = null;
        await user.save();
        unbannedCount++;
      }
    }

    res.status(200).json({
      message: `${unbannedCount} User automatisch entbannt`
    });
  } catch (error) {
    console.error('Fehler beim automatischen Entbannen:', error);
    res.status(500).json({ message: 'Fehler beim automatischen Entbannen' });
  }
};