const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "admin",
    version: "1.7",
    author: "L'Uchiha Perdu",
    countDown: 5,
    role: 2,
    description: "Ajoute, supprime ou liste les admins",
    category: "box chat",
    guide: "{pn} [add | -a] <uid | @tag>: Ajoute un admin\n"
      + "{pn} [remove | -r] <uid | @tag>: Retire un admin\n"
      + "{pn} [list | -l]: Affiche la liste des admins"
  },

  langs: {
    en: {
      added: [
        "✅ | Vous avez ajouté **%1** aux êtres suprêmes. Il rejoindra bientôt le conseil des illuminés. 😈",
        "✅ | **%1** vient d'être promu ! Ce mortel a maintenant le pouvoir... Espérons qu'il ne le gâche pas. 🏆",
        "✅ | **%1** est maintenant un admin. Une erreur fatale ou un choix stratégique ? Nous verrons. 🤨",
        "✅ | **%1** a rejoint le cercle des divins. Priez pour qu'il ne nous trahisse pas. 🙏",
        "✅ | **%1** est maintenant au sommet de la chaîne alimentaire. Que le règne commence ! 👑"
      ],
      alreadyAdmin: "⚠️ | **%1** est déjà admin. Ce mec a déjà vendu son âme pour ce poste. 😈",
      missingIdAdd: "⚠️ | Tu veux ajouter un admin invisible ? Mets un ID ou tag quelqu'un.",
      removed: [
        "✅ | **%1** a été déchu de son pouvoir. Il retourne à sa misérable existence. 😭",
        "✅ | **%1** n'est plus admin. Rejoignez-moi pour lui jeter des cailloux. 🪨",
        "✅ | **%1** vient de perdre ses privilèges... Ça pique, hein ? 🤡",
        "✅ | **%1** a été banni du club des puissants. Plus qu'un simple mortel maintenant. 😢",
        "✅ | **%1** est redevenu un simple habitant de la plèbe. RIP. ⚰️"
      ],
      notAdmin: "⚠️ | **%1** n'était même pas admin. Pourquoi vouloir virer un random ? 😆",
      missingIdRemove: "⚠️ | Qui veux-tu retirer ? Mets un ID ou tag un admin.",
      listAdmin: "👑 | Liste des admins :\n%1"
    }
  },

  onStart: async function ({ message, args, usersData, event }) {
    const lang = this.langs.en;

    switch (args[0]) {
      case "add":
      case "-a": {
        if (!args[1]) return message.reply(lang.missingIdAdd);

        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else uids = args.filter(arg => !isNaN(arg));

        const notAdminIds = [];
        const adminIds = [];
        for (const uid of uids) {
          if (config.adminBot.includes(uid)) adminIds.push(uid);
          else notAdminIds.push(uid);
        }

        config.adminBot.push(...notAdminIds);
        const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        const addedMessage = notAdminIds.length > 0
          ? lang.added[Math.floor(Math.random() * lang.added.length)].replace("%1", getNames.map(({ name }) => name).join(", "))
          : "";

        const alreadyAdminMessage = adminIds.length > 0
          ? lang.alreadyAdmin.replace("%1", adminIds.length)
          : "";

        return message.reply(addedMessage + "\n" + alreadyAdminMessage);
      }

      case "remove":
      case "-r": {
        if (!args[1]) return message.reply(lang.missingIdRemove);

        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else uids = args.filter(arg => !isNaN(arg));

        const notAdminIds = [];
        const adminIds = [];
        for (const uid of uids) {
          if (config.adminBot.includes(uid)) adminIds.push(uid);
          else notAdminIds.push(uid);
        }

        for (const uid of adminIds) config.adminBot.splice(config.adminBot.indexOf(uid), 1);
        const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        const removedMessage = adminIds.length > 0
          ? lang.removed[Math.floor(Math.random() * lang.removed.length)].replace("%1", getNames.map(({ name }) => name).join(", "))
          : "";

        const notAdminMessage = notAdminIds.length > 0
          ? lang.notAdmin.replace("%1", notAdminIds.length)
          : "";

        return message.reply(removedMessage + "\n" + notAdminMessage);
      }

      case "list":
      case "-l": {
        const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        return message.reply(lang.listAdmin.replace("%1", getNames.map(({ name, uid }) => `• ${name} (${uid})`).join("\n")));
      }

      default:
        return message.reply("❌ Commande invalide. Utilise `/admin add`, `/admin remove` ou `/admin list`.");
    }
  }
};