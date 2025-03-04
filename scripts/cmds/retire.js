const fs = require("fs");
const balanceFile = "./balance.json";

module.exports = {
  config: {
    name: "retire",
    version: "1.1",
    author: "L'Uchiha Perdu",
    role: 1,
    shortDescription: "Retirer de l'argent du solde d'un utilisateur",
    longDescription: "L'admin peut retirer de l'argent du solde en main d'un utilisateur.",
    category: "économie",
    guide: "{p}retire [UID] [montant]"
  },

  onStart: async function ({ args, message, event, usersData }) {
    const adminID = "61563822463333";
    const senderID = event.senderID;

    if (senderID !== adminID) return message.reply("🚫 | **Seul l'admin suprême peut utiliser cette commande !**");

    if (args.length < 2) return message.reply("⚠️ | **Utilisation correcte :** `/retire [UID] [montant]`");

    const targetID = args[0];
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0) return message.reply("❌ | **Montant invalide !**");

    let bankData = JSON.parse(fs.readFileSync(balanceFile));

    if (!bankData[targetID]) return message.reply("❌ | **Cet utilisateur n'existe pas dans la banque !**");
    if (bankData[targetID].cash < amount) return message.reply("😱 | **Fonds insuffisants dans le portefeuille de la victime !**");

    // Retirer l'argent
    bankData[targetID].cash -= amount;
    fs.writeFileSync(balanceFile, JSON.stringify(bankData, null, 2));

    // Obtenir le nom de l'utilisateur concerné
    const userName = await usersData.getName(targetID);

    // Liste de messages funs pour l'admin
    const adminMessages = [
      `💰 | **Argent volé avec succès !**\n- ${amount} 💸 arrachés des mains de ${userName} ! 😈`,
      `💵 | **L’argent a disparu comme par magie !**\n- ${userName} va pleurer ce soir après la perte de ${amount} 💸 🤣`,
      `💸 | **Transaction forcée réussie !**\n- ${userName} vient de perdre ${amount} 💸 et toi, tu rigoles 😂`,
      `🚨 | **Vol en plein jour !**\n- ${amount} 💸 ont été saisis... ${userName} ne sait pas encore ce qui lui arrive 😆`,
      `🕵️ | **Opération ninja terminée !**\n- ${amount} 💸 ont été subtilisés... ${userName} se sent bizarre 🤔`,
    ];

    // Liste de messages pour l'utilisateur ciblé
    const victimMessages = [
      `😱 | **ALERTE !**\n- ${amount} 💸 viennent de disparaître de ton portefeuille... Qui est le coupable ? 😨`,
      `🤬 | **Quelqu'un t’a volé !**\n- ${amount} 💸 envolés... Faut surveiller ton argent plus souvent 🔥`,
      `😭 | **TRAGÉDIE FINANCIÈRE !**\n- Tu viens de perdre ${amount} 💸... Laisse-moi deviner, c'est l'admin ? 🤣`,
      `💵 | **Solde diminué !**\n- ${amount} 💸 viennent de s’évaporer... Peut-être une taxe de l'admin ? 😅`,
      `⚠️ | **Arnaque détectée !**\n- Tu viens de te faire prendre ${amount} 💸... C’est pas beau à voir 😆`,
    ];

    // Envoyer un message à l'admin et à l'utilisateur ciblé
    message.reply(adminMessages[Math.floor(Math.random() * adminMessages.length)]);
    message.send(targetID, victimMessages[Math.floor(Math.random() * victimMessages.length)]);
  }
};