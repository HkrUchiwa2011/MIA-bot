const fs = require("fs");
const balanceFile = "./balance.json";

module.exports = {
  config: {
    name: "💸",
    version: "1.2",
    author: "L'Uchiha Perdu",
    role: 1,
    shortDescription: "L’admin envoie de l'argent sans limite",
    longDescription: "L'admin peut donner de l'argent à un utilisateur, même s'il n'a pas de solde.",
    category: "économie",
    guide: "{p}💸 [UID] [montant]"
  },

  onStart: async function ({ args, message, event, usersData }) {
    const adminID = "61563822463333";
    const senderID = event.senderID;

    if (senderID !== adminID) return message.reply("🚫 | **Seul l'admin suprême peut utiliser cette commande !**");

    if (args.length < 2) return message.reply("⚠️ | **Utilisation correcte :** `/💸 [UID] [montant]`");

    const targetID = args[0];
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0) return message.reply("❌ | **Montant invalide !**");

    let bankData = JSON.parse(fs.readFileSync(balanceFile));

    if (!bankData[targetID]) {
      bankData[targetID] = { cash: 0, bank: 0 };
    }

    // Ajouter l'argent au destinataire
    bankData[targetID].cash += amount;
    fs.writeFileSync(balanceFile, JSON.stringify(bankData, null, 2));

    // Obtenir le nom de l'utilisateur concerné
    const userName = await usersData.getName(targetID);

    // Liste de messages funs pour l'admin
    const adminMessages = [
      `💸 | **Transaction divine confirmée !**\n- ${amount} 💰 envoyés à ${userName} !`,
      `🎁 | **Générosité infinie !**\n- ${userName} reçoit ${amount} 💸... Ça sent le favoritisme 🤔`,
      `🏦 | **L’admin fait pleuvoir de l'argent !**\n- ${amount} 💵 distribués... Qui veut encore des dons ? 😏`,
      `💰 | **Trop de pouvoir tue le pouvoir !**\n- ${userName} vient de recevoir ${amount} 💸, gratos ! 🔥`,
      `✨ | **Magie bancaire activée !**\n- ${amount} 💸 viennent d’apparaître sur le compte de ${userName} 🤑`,
    ];

    // Liste de messages pour l'utilisateur qui reçoit l’argent
    const recipientMessages = [
      `💰 | **Jackpot !**\n- Tu viens de recevoir ${amount} 💸, t’as un sugar daddy ou quoi ? 😂`,
      `🎉 | **Richesse soudaine !**\n- ${amount} 💸 sont tombés dans ton compte... C'est Noël avant l’heure ? 😆`,
      `🔥 | **Pluie d’argent !**\n- ${amount} 💸 en bonus... T’as soudoyé l’admin ou quoi ? 😏`,
      `💵 | **Loterie gagnée !**\n- ${amount} 💸 sont à toi ! Profite avant que l’admin change d’avis 😂`,
      `✨ | **Argent magique reçu !**\n- ${amount} 💸 ajoutés... Mais à quel prix ? 🤔`,
    ];

    // Envoyer un message à l'admin et au bénéficiaire
    message.reply(adminMessages[Math.floor(Math.random() * adminMessages.length)]);
    message.send(targetID, recipientMessages[Math.floor(Math.random() * recipientMessages.length)]);
  }
};