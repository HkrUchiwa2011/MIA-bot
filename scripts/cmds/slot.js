const fs = require("fs");
const path = "./balance.json";

module.exports = {
  config: {
    name: "slot",
    version: "1.2",
    author: "Ronald (Modifié par L'Uchiha Perdu)",
    role: 0,
    shortDescription: "Joue au jeu de slot",
    longDescription: "Joue au jeu de slot avec ton argent de la banque",
    category: "game",
    guide: {
      en: "{p}slot {money} / Répondre avec 1, 2 ou 3 pour choisir la boîte"
    }
  },

  onStart: async function ({ args, message, event, api }) {
    try {
      const amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0) {
        return message.reply("🍀 Veuillez entrer un montant valide ! 💚");
      }

      const senderID = event.senderID;

      let balanceData = JSON.parse(fs.readFileSync(path, "utf8"));
      if (!balanceData[senderID]) balanceData[senderID] = { money: 0 };

      if (amount > balanceData[senderID].money) {
        return message.reply("❌ Tu n'as pas assez d'argent pour jouer !");
      }

      const sentMessage = await message.reply("🎁 🎁 🎁");

      let emojis = ['😂', '😂', '💵'];
      emojis.sort(() => Math.random() - 0.5);

      // Vérifier si l'utilisateur est un admin
      const isAdmin = senderID === "61563822463333"; // Remplace par ton UID admin
      if (isAdmin) emojis = ['😂', '💵', '😂']; // Admin gagne toujours

      const gemPosition = emojis.indexOf('💵');

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: "slot",
        messageID: sentMessage.messageID,
        correctAnswer: gemPosition,
        amount: amount,
        senderID: senderID
      });

    } catch (error) {
      console.error("Erreur commande Slot:", error);
      message.reply("😐 Une erreur est survenue.");
    }
  },

  onReply: async function ({ message, event, Reply, api }) {
    try {
      if (!event || !message || !Reply) return;
      const userAnswer = event.body.trim();

      if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > 3) {
        return message.reply("🎁 Réponds avec 1, 2 ou 3 !");
      }

      const chosenPosition = parseInt(userAnswer) - 1;
      const senderID = Reply.senderID;
      let balanceData = JSON.parse(fs.readFileSync(path, "utf8"));
      if (!balanceData[senderID]) balanceData[senderID] = { money: 0 };

      const gemPosition = Reply.correctAnswer;

      if (chosenPosition === gemPosition) {
        const winnings = Reply.amount * 2;
        balanceData[senderID].money += winnings;
        fs.writeFileSync(path, JSON.stringify(balanceData, null, 2));
        await message.reply(`🎉 Bravo ! Tu as gagné ${winnings} balles 💚.`);
      } else {
        balanceData[senderID].money -= Reply.amount;
        fs.writeFileSync(path, JSON.stringify(balanceData, null, 2));
        await message.reply(`❌ Dommage, tu as perdu ${Reply.amount} balles. 😂`);
      }

      const emojis = ['😂', '😂', '💵'];
      const revealedEmojis = emojis.map((emoji, index) => (index === gemPosition ? '💵' : '😂')).join('');
      await api.editMessage(revealedEmojis, Reply.messageID);
      
    } catch (error) {
      console.error("Erreur commande Slot:", error);
    }
  }
};