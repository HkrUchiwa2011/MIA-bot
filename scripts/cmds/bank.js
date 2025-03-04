const fs = require('fs');
const balanceFile = 'balance.json';
const userDataFile = 'users.json';

// Stockage des cooldowns en mémoire
const cooldowns = {};

// Fonction pour charger les données des utilisateurs
function loadUserData() {
    if (!fs.existsSync(userDataFile)) {
        fs.writeFileSync(userDataFile, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(userDataFile));
}

// Fonction pour sauvegarder les données des utilisateurs
function saveUserData(data) {
    fs.writeFileSync(userDataFile, JSON.stringify(data, null, 2));
}

// Fonction pour ajouter un utilisateur dans `users.json`
function registerUser(userID, userName) {
    let users = loadUserData();
    if (!users[userID]) {
        users[userID] = { name: userName };
        saveUserData(users);
    }
}

module.exports = {
    config: {
        name: "bank",
        version: '4.0.2',
        role: 0,
        category: 'Économie',
        author: 'Uchiha Perdu',
        shortDescription: 'Gestion bancaire ultra sécurisée',
        longDescription: 'Gérez votre banque avec un mot de passe obligatoire pour chaque transaction.',
    },

    onStart: async function ({ message, event, args }) {
        const userID = event.senderID;
        // Utiliser un nom par défaut ou récupérer le vrai nom via l'API FB si disponible
        registerUser(userID, `Utilisateur_${userID}`);

        if (!fs.existsSync(balanceFile)) {
            fs.writeFileSync(balanceFile, JSON.stringify({}, null, 2));
        }

        const balance = JSON.parse(fs.readFileSync(balanceFile));
        if (!balance[userID]) {
            balance[userID] = { bank: 0, cash: 0, debt: 0, password: null };
        }

        function saveData() {
            fs.writeFileSync(balanceFile, JSON.stringify(balance, null, 2));
        }

        function caseMessage(content) {
            return `
╔══════════════╗
${content.title}
╚══════════════╝
${content.message}
`;
        }

        function checkPassword(inputPassword) {
            if (!balance[userID].password) {
                return caseMessage({
                    title: "🏦 SÉCURITÉ 🏦",
                    message: `❌ Vous devez définir un mot de passe avant d'utiliser la banque.\nUtilisez : /bank setpassword [motdepasse]`
                });
            }
            if (!inputPassword) {
                return caseMessage({
                    title: "🏦 SÉCURITÉ 🏦",
                    message: `❌ Veuillez entrer votre mot de passe après la commande.`
                });
            }
            if (balance[userID].password !== inputPassword) {
                return caseMessage({
                    title: "🏦 SÉCURITÉ 🏦",
                    message: `❌ Mot de passe incorrect !`
                });
            }
            return true;
        }

        const command = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        const inputPassword = args[args.length - 1];

        if (!command) {
            return message.reply(caseMessage({
                title: "🏦 𝐁𝐀𝐍𝐐𝐔𝐄 🏦",
                message: `
📲 | Choisissez une option :
✰ 𝐒𝐎𝐋𝐃𝐄 → Voir votre solde
✰ 𝐑𝐄𝐓𝐈𝐑𝐄𝐑 → Retirer de l'argent
✰ 𝐃𝐄𝐏𝐎𝐒𝐄𝐑 → Déposer de l'argent
✰ 𝐏𝐑𝐄𝐓 → Emprunter (max: 100000)
✰ 𝐃𝐄𝐓𝐓𝐄 → Voir votre dette
✰ 𝐑𝐄𝐌𝐁𝐎𝐔𝐑𝐒𝐄𝐑 → Rembourser une dette
✰ 𝐓𝐎𝐏 → Classement des plus riches
✰ 𝐈𝐍𝐓𝐄𝐑𝐄𝐓 → Récolter 5% des intérêts
✰ 𝐆𝐀𝐌𝐁𝐋𝐄 → Jouer à un jeu de chance

        ╔═════════╗
          𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐄
        ╚═════════╝

✰ 𝐒𝐄𝐓𝐏𝐀𝐒𝐒𝐖𝐎𝐑𝐃 → Définir un mot de passe
✰ 𝐏𝐀𝐒𝐒𝐖𝐎𝐑𝐃 → Changer de mot de passe
✰ 𝐑𝐄𝐌𝐎𝐕𝐄𝐑𝐀𝐒𝐒𝐖𝐎𝐑𝐃 → Supprimer le mot de passe`
            }));
        }

        switch (command) {
            case 'solde':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                return message.reply(caseMessage({
                    title: "🏦 SOLDE 🏦",
                    message: `📊 Solde en banque : ${balance[userID].bank}$ | 💵 En cash : ${balance[userID].cash}$`
                }));

            case 'top':
                const userData = loadUserData();
                let sortedBalances = Object.entries(balance)
                    .sort(([, a], [, b]) => b.bank - a.bank)
                    .slice(0, 10)
                    .map(([id, data], index) => {
                        const username = userData[id]?.name || `Utilisateur ${id}`;
                        return `${index + 1}. ${username} - ${data.bank}$`;
                    });
                return message.reply(caseMessage({
                    title: "🏦 TOP PLUS RICHES 🏦",
                    message: sortedBalances.join('\n') || "Aucun utilisateur enregistré"
                }));

            case 'rembourser':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                if (isNaN(amount) || amount <= 0) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                        message: `❌ Montant invalide ! Entrez un nombre positif.`
                    }));
                }
                if (balance[userID].debt < amount) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                        message: `❌ Vous essayez de rembourser plus que votre dette actuelle (${balance[userID].debt}$).`
                    }));
                }
                if (balance[userID].cash < amount) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
                        message: `❌ Pas assez de cash ! 💰 Cash actuel : ${balance[userID].cash}$`
                    }));
                }
                balance[userID].cash -= amount;
                balance[userID].debt -= amount;
                saveData();
                return message.reply(caseMessage({
                    title: "🏦 𝗥𝗘𝗠𝗕𝗢𝗨𝗥𝗦𝗘𝗠𝗘𝗡𝗧 🏦",
                    message: `✅ ${amount}$ remboursé ! Dette restante : ${balance[userID].debt}$`
                }));

            case 'intérêt':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                if (cooldowns[userID] && Date.now() - cooldowns[userID] < 60000) {
                    return message.reply(caseMessage({
                        title: "🏦 𝗜𝗡𝗧É𝗥Ê𝗧𝗦 🏦",
                        message: `❌ Attendez 1 minute avant de récolter à nouveau.`
                    }));
                }
                const interest = Math.floor(balance[userID].bank * 0.05);
                if (interest <= 0) {
                    return message.reply(caseMessage({
                        title: "🏦 𝗜𝗡𝗧É𝗥Ê𝗧𝗦 🏦",
                        message: `❌ Solde trop faible pour générer des intérêts.`
                    }));
                }
                balance[userID].bank += interest;
                saveData();
                cooldowns[userID] = Date.now();
                return message.reply(caseMessage({
                    title: "🏦 𝗜𝗡𝗧É𝗥Ê𝗧𝗦 🏦",
                    message: `✅ ${interest}$ d'intérêts collectés !`
                }));

            case 'retirer':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                if (isNaN(amount) || amount <= 0) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                        message: `❌ Montant invalide ! Entrez un nombre positif.`
                    }));
                }
                if (balance[userID].bank < amount) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
                        message: `❌ Pas assez en banque ! 💳 Solde : ${balance[userID].bank}$`
                    }));
                }
                balance[userID].bank -= amount;
                balance[userID].cash += amount;
                saveData();
                return message.reply(caseMessage({
                    title: "🏦 𝗥𝗘𝗧𝗜𝗥𝗘́ 🏦",
                    message: `✅ ${amount}$ retiré ! 💰 Cash : ${balance[userID].cash}$`
                }));

            case 'déposer':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                if (isNaN(amount) || amount <= 0) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                        message: `❌ Montant invalide ! Entrez un nombre positif.`
                    }));
                }
                if (balance[userID].cash < amount) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
                        message: `❌ Pas assez de cash ! 💰 Cash : ${balance[userID].cash}$`
                    }));
                }
                balance[userID].cash -= amount;
                balance[userID].bank += amount;
                saveData();
                return message.reply(caseMessage({
                    title: "🏦 𝗗É𝗣𝗢𝗦𝗜𝗧 🏦",
                    message: `✅ ${amount}$ déposé ! 💳 Banque : ${balance[userID].bank}$`
                }));

            case 'prêt':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                if (isNaN(amount) || amount <= 0) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                        message: `❌ Montant invalide ! Entrez un nombre positif.`
                    }));
                }
                if (amount > 100000) {
                    return message.reply(caseMessage({
                        title: "🏦 𝐏𝐋𝐀𝐅𝐎𝐍𝐃 🏦",
                        message: `❌ Maximum empruntable : 100 000 $`
                    }));
                }
                balance[userID].cash += amount;
                balance[userID].debt += amount;
                saveData();
                return message.reply(caseMessage({
                    title: "🏦 𝗣𝗥Ê𝗧 🏦",
                    message: `✅ ${amount}$ emprunté ! 💰 Dette : ${balance[userID].debt}$`
                }));

            case 'gamble':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                if (isNaN(amount) || amount <= 0) {
                    return message.reply(caseMessage({
                        title: "🎰 𝐄𝐑𝐑𝐄𝐔𝐑 🎰",
                        message: `❌ Montant invalide ! Entrez un nombre positif.`
                    }));
                }
                if (balance[userID].cash < amount) {
                    return message.reply(caseMessage({
                        title: "🎰 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🎰",
                        message: `❌ Pas assez de cash ! 💰 Cash : ${balance[userID].cash}$`
                    }));
                }
                balance[userID].cash -= amount;
                let gain = Math.random() < 0.5 ? 0 : amount * 2;
                balance[userID].cash += gain;
                saveData();
                return message.reply(caseMessage({
                    title: gain > 0 ? "🎰 𝗝𝗔𝗖𝗞𝗣𝗢𝗧 🎰" : "🎰 𝗣𝗘𝗥𝗗𝗨 🎰",
                    message: gain > 0 ?
                        `🎉 Pari ${amount}$ → Gain ${gain}$ ! 🎰💰` :
                        `😢 Pari ${amount}$ perdu... 🎰💸`
                }));

            case 'dette':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                return message.reply(caseMessage({
                    title: balance[userID].debt <= 0 ? "✅ 𝐃𝐄𝐓𝐓𝐄 𝐀𝐁𝐒𝐄𝐍𝐓𝐄 ✅" : "💰 𝐃𝐄𝐓𝐓𝐄 𝐀𝐂𝐓𝐔𝐄𝐋𝐋𝐄 💰",
                    message: balance[userID].debt <= 0 ?
                        `👏 Aucune dette à rembourser !` :
                        `📌 Dette actuelle : ${balance[userID].debt}$\n💡 Pensez à rembourser !`
                }));

            case 'setpassword':
                if (args.length < 2) {
                    return message.reply(caseMessage({
                        title: "🏦 SÉCURITÉ 🏦",
                        message: `❌ Fournissez un mot de passe.\nUtilisez : /bank setpassword [motdepasse]`
                    }));
                }
                balance[userID].password = args[1];
                saveData();
                return message.reply(caseMessage({
                    title: "🏦 MOT DE PASSE 🏦",
                    message: `✅ Mot de passe défini avec succès !`
                }));

            case 'password':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                if (args.length < 2) {
                    return message.reply(caseMessage({
                        title: "🏦 SÉCURITÉ 🏦",
                        message: `❌ Fournissez un nouveau mot de passe.\nUtilisez : /bank password [nouveau]`
                    }));
                }
                balance[userID].password = args[1];
                saveData();
                return message.reply(caseMessage({
                    title: "🏦 MOT DE PASSE 🏦",
                    message: `✅ Mot de passe changé avec succès !`
                }));

            case 'removepassword':
                if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
                balance[userID].password = null;
                saveData();
                return message.reply(caseMessage({
                    title: "🏦 SÉCURITÉ 🏦",
                    message: `✅ Mot de passe supprimé avec succès !`
                }));

            default:
                return message.reply(caseMessage({
                    title: "🏦 ERREUR 🏦",
                    message: `❌ Commande inconnue. Tapez /bank pour voir les options.`
                }));
        }
    }
};