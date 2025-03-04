const fs = require("fs");
const moment = require("moment-timezone");
const balanceFile = "balance.json";

module.exports = {
    config: {
        name: "daily",
        version: "1.3",
        author: "L'Uchiha Perdu",
        countDown: 5,
        role: 0,
        shortDescription: "Recevoir un bonus quotidien",
        longDescription: "Permet de récupérer une récompense quotidienne en argent et en exp.",
        category: "économie",
        guide: "{p}daily"
    },

    onStart: async function ({ message, event, usersData }) {
        const reward = 5000; // Nouveau montant
        const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
        const { senderID } = event;

        // Charger les données de la balance
        let bankData = {};
        try {
            bankData = JSON.parse(fs.readFileSync(balanceFile));
        } catch (error) {
            bankData = {};
        }

        if (!bankData[senderID]) {
            bankData[senderID] = { cash: 0, bank: 0, debt: 0, secured: false, hacker: 0 };
        }

        const userData = await usersData.get(senderID);
        if (userData.data.lastTimeGetReward === dateTime) {
            return message.reply("⚠️ Vous avez déjà récupéré votre récompense aujourd'hui !");
        }

        // Ajouter l'argent au solde
        bankData[senderID].cash += reward;
        fs.writeFileSync(balanceFile, JSON.stringify(bankData, null, 2));

        // Ajouter l'EXP
        const expReward = 20;
        userData.data.lastTimeGetReward = dateTime;
        await usersData.set(senderID, {
            money: userData.money,
            exp: userData.exp + expReward,
            data: userData.data
        });

        message.reply(`🎁 **Récompense quotidienne reçue !**\n\n💰 **+${reward} $**\n⭐ **+${expReward} EXP**`);
    }
};