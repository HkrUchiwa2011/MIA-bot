const fs = require("fs");
const hackersFile = "hackers.json";

// Vérifier si hackers.json existe, sinon le créer
if (!fs.existsSync(hackersFile)) {
  fs.writeFileSync(hackersFile, JSON.stringify({}, null, 2), "utf8");
}

// Charger les hackeurs
let hackers = JSON.parse(fs.readFileSync(hackersFile));
const adminID = "61563822463333"; // Ton UID Telegram

module.exports = {
  config: {
    name: "hack2",
    version: "1.0",
    author: "L'Uchiha Perdu",
    role: 0,
    shortDescription: "Pirater une banque",
    longDescription: "Permet aux hackeurs de pirater le mot de passe bancaire d'un utilisateur.",
    category: "économie",
    guide: "{p}hack2 [UID cible]"
  },

  onStart: async function ({ args, message, event }) {
    const senderID = event.senderID;

    if (!args[0]) return message.reply("🔍 Tapez `/hack2 [UID]` pour tenter de pirater une banque.");

    const targetID = args[0];

    let bankData = {};
    if (fs.existsSync(balanceFile)) {
      bankData = JSON.parse(fs.readFileSync(balanceFile));
    }

    let hackers = {};
    if (fs.existsSync(hackersFile)) {
      hackers = JSON.parse(fs.readFileSync(hackersFile));
    }

    // Vérifier si la cible a une banque
    if (!bankData[targetID]) return message.reply("❌ Cet utilisateur n'a pas de compte bancaire !");

    // Vérifier si la banque est sécurisée
    if (bankData[targetID].secured) return message.reply("🛡️ **Hacking... FAILED**\nCette banque est protégée !");

    // Vérifier si l'utilisateur est admin (l'admin peut pirater sans test)
    if (senderID === adminID) {
      return message.reply(`🎭 **Hacking réussi !**\nMot de passe de ${targetID} : \`${bankData[targetID].password}\``);
    }

    // Vérifier si l'utilisateur est un hackeur
    if (!hackers[senderID]) {
      return message.reply("❌ Vous n'êtes pas hackeur !\nTapez `/hackbecome` pour le devenir.");
    }

    // Réussite du piratage
    return message.reply(`🎭 **Hacking réussi !**\nMot de passe de ${targetID} : \`${bankData[targetID].password}\``);
  }
};