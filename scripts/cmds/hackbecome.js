const fs = require("fs");
const balanceFile = "balance.json";
const hackersFile = "hackers.json";

module.exports = {
    config: {
        name: "hackbecome",
        version: "1.1",
        author: "L'Uchiha Perdu",
        role: 0,
        shortDescription: "Réponds correctement et deviens hackeur",
        longDescription: "Une seule question pour devenir hackeur et utiliser /hack2.",
        category: "économie",
        guide: "{p}hackbecome réponse"
    },

    onStart: async function ({ args, message, event }) {
        const userID = event.senderID;
        const correctAnswer = "L'Uchiha Perdu";

        if (args.length === 0) {
            return message.reply("🤖 **Deviens hackeur en répondant à cette question !**\n\n💬 **Qui est le créateur de l'univers ?**\n\n⚠️ Réponds comme ceci :\n`/hackbecome votre_réponse`");
        }

        const userAnswer = args.join(" ").toLowerCase();
        if (userAnswer !== correctAnswer.toLowerCase()) {
            return message.reply("❌ **Mauvaise réponse !**\nRéessaye... Qui est le créateur de l'univers ?");
        }

        // Charger balance.json
        let bankData = {};
        try {
            if (fs.existsSync(balanceFile)) {
                bankData = JSON.parse(fs.readFileSync(balanceFile));
            }
        } catch (error) {
            console.error("Erreur lecture balance.json", error);
        }

        // Charger hackers.json
        let hackers = {};
        try {
            if (fs.existsSync(hackersFile)) {
                hackers = JSON.parse(fs.readFileSync(hackersFile));
            }
        } catch (error) {
            console.error("Erreur lecture hackers.json", error);
        }

        // Vérifier si l'utilisateur est déjà hackeur
        if (bankData[userID]?.hacker || hackers[userID]) {
            return message.reply("⚠️ **Tu es déjà hackeur !** Pas besoin de refaire le test.");
        }

        // Ajouter l'utilisateur comme hackeur dans balance.json
        if (!bankData[userID]) {
            bankData[userID] = { cash: 0, bank: 0, debt: 0, secured: false, hacker: true };
        } else {
            bankData[userID].hacker = true;
        }
        fs.writeFileSync(balanceFile, JSON.stringify(bankData, null, 2));

        // Ajouter l'utilisateur comme hackeur dans hackers.json
        hackers[userID] = true;
        fs.writeFileSync(hackersFile, JSON.stringify(hackers, null, 2));

        return message.reply("🎉 **Félicitations !** Tu es maintenant un hackeur !\nUtilise `/hack2` pour pirater des banques. 😈");
    }
};