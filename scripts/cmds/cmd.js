const axios = require("axios");
const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const { client } = global;

const { configCommands } = global.GoatBot;
const { log, loading, removeHomeDir } = global.utils;

function getDomain(url) {
    const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function isURL(str) {
    try {
        new URL(str);
        return true;
    }
    catch (e) {
        return false;
    }
}

const allowedUsers = [
    "61563822463333", // ghost 

];

const unauthorizedMessages = [
    "Vous n'avez pas le droit de fouiller ici.",
    "Accès refusé. Vous ne pouvez pas modifier ce fichier.",
    "Ce fichier n'est pas pour vous.",
    "Vous n'êtes pas autorisé à accéder à ce fichier.",
    "Modification non autorisée.",
    "Interdit! Vous n'avez pas l'autorisation nécessaire.",
    "Ne touchez pas à ce fichier.",
    "Accès restreint. Vous ne pouvez pas continuer.",
    "Permission refusée.",
    "Vous ne pouvez pas explorer ce fichier.",
    "Fichier réservé. Accès interdit.",
    "Vous n'avez pas les droits pour modifier ce fichier.",
    "Modification de ce fichier interdite.",
    "Ceci n'est pas pour vous.",
    "Vous ne pouvez pas explorer ou modifier ce fichier.",
    "Accès non autorisé.",
    "Vous n'avez pas la permission d'accéder à ce fichier.",
    "Ce fichier est protégé. Accès refusé.",
    "Vous n'êtes pas autorisé à toucher ce fichier.",
    "Accès restreint. Modification interdite.",
    "Vous n'avez pas les droits nécessaires.",
    "Fichier protégé. Accès interdit.",
    "Vous ne pouvez pas explorer ou modifier ce fichier.",
    "Accès refusé. Vous n'avez pas l'autorisation.",
    "Modification de ce fichier non autorisée.",
    "Vous n'avez pas la permission d'explorer ce fichier.",
    "Interdit! Vous n'avez pas les droits requis.",
    "Ne touchez pas à ce fichier. Accès refusé.",
    "Accès restreint. Vous ne pouvez pas continuer.",
    "Permission refusée. Vous ne pouvez pas modifier ce fichier.",
    "Vous ne pouvez pas explorer ou modifier ce fichier.",
    "Accès non autorisé. Vous n'avez pas les droits nécessaires.",
    "Vous n'avez pas l'autorisation requise.",
    "Ce fichier est protégé. Accès interdit."
];

module.exports = {
    config: {
        name: "cmd",
        version: "1.16",
        author: "NTKhang",
        countDown: 5,
        role: 2,
        shortDescription: {
            vi: "Quản lý command",
            en: "Gérer les commandes"
        },
        longDescription: {
            vi: "Quản lý các tệp lệnh của bạn",
            en: "Gérer vos fichiers de commande"
        },
        category: "owner",
        guide: {
            vi: "   {pn} load <tên file lệnh>"
                + "\n   {pn} loadAll"
                + "\n   {pn} install <url> <tên file lệnh>: Tải xuống và cài đặt một tệp lệnh từ một url, url là đường dẫn đến tệp lệnh (raw)"
                + "\n   {pn} install <tên file lệnh> <code>: Tải xuống và cài đặt một tệp lệnh từ một code, code là mã của lệnh",
            en: "   {pn} load <nom du fichier de commande>"
                + "\n   {pn} loadAll"
                + "\n   {pn} install <url> <nom du fichier de commande> : Télécharger et installer un fichier de commande à partir d'une url, url est le chemin vers le fichier (raw)"
                + "\n   {pn} install <nom du fichier de commande> <code> : Télécharger et installer un fichier de commande à partir d'un code, code est le code de la commande"
        }
    },

    langs: {
        vi: {
            missingFileName: "⚠️ | Vui lòng nhập vào tên lệnh bạn muốn reload",
            loaded: "✅ | Đã load command \"%1\" thành công",
            loadedError: "❌ | Load command \"%1\" thất bại với lỗi\n%2: %3",
            loadedSuccess: "✅ | Đã load thành công (%1) command",
            loadedFail: "❌ | Load thất bại (%1) command\n%2",
            openConsoleToSeeError: "👀 | Hãy mở console để xem chi tiết lỗi",
            missingCommandNameUnload: "⚠️ | Vui lòng nhập vào tên lệnh bạn muốn unload",
            unloaded: "✅ | Đã unload command \"%1\" thành công",
            unloadedError: "❌ | Unload command \"%1\" thất bại với lỗi\n%2: %3",
            missingUrlCodeOrFileName: "⚠️ | Vui lòng nhập vào url hoặc code và tên file lệnh bạn muốn cài đặt",
            missingUrlOrCode: "⚠️ | Vui lòng nhập vào url hoặc code của tệp lệnh bạn muốn cài đặt",
            missingFileNameInstall: "⚠️ | Vui lòng nhập vào tên file để lưu lệnh (đuôi .js)",
            invalidUrl: "⚠️ | Vui lòng nhập vào url hợp lệ",
            invalidUrlOrCode: "⚠️ | Không thể lấy được mã lệnh",
            alreadExist: "⚠️ | File lệnh đã tồn tại, bạn có chắc chắn muốn ghi đè lên file lệnh cũ không?\nThả cảm xúc bất kì vào tin nhắn này để tiếp tụ[...]",
            installed: "✅ | Đã cài đặt command \"%1\" thành công, file lệnh được lưu tại %2",
            installedError: "❌ | Cài đặt command \"%1\" thất bại với lỗi\n%2: %3",
            missingFile: "⚠️ | Không tìm thấy tệp lệnh \"%1\"",
            invalidFileName: "⚠️ | Tên tệp lệnh không hợp lệ",
            unloadedFile: "✅ | Đã unload lệnh \"%1\""
        },
        en: {
            missingFileName: "⚠️ | Veuillez entrer le nom de la commande que vous souhaitez recharger",
            loaded: "✅ | Commande \"%1\" chargée avec succès",
            loadedError: "❌ | Échec du chargement de la commande \"%1\" avec l'erreur\n%2: %3",
            loadedSuccess: "✅ | Chargé avec succès (%1) commande",
            loadedFail: "❌ | Échec du chargement (%1) commande\n%2",
            openConsoleToSeeError: "👀 | Ouvrez la console pour voir les détails de l'erreur",
            missingCommandNameUnload: "⚠️ | Veuillez entrer le nom de la commande que vous souhaitez décharger",
            unloaded: "✅ | Commande \"%1\" déchargée avec succès",
            unloadedError: "❌ | Échec du déchargement de la commande \"%1\" avec l'erreur\n%2: %3",
            missingUrlCodeOrFileName: "⚠️ | Veuillez entrer l'url ou le code et le nom du fichier de commande que vous souhaitez installer",
            missingUrlOrCode: "⚠️ | Veuillez entrer l'url ou le code du fichier de commande que vous souhaitez installer",
            missingFileNameInstall: "⚠️ | Veuillez entrer le nom du fichier pour enregistrer la commande (avec l'extension .js)",
            invalidUrl: "⚠️ | Veuillez entrer une url valide",
            invalidUrlOrCode: "⚠️ | Impossible d'obtenir le code de la commande",
            alreadExist: "⚠️ | Le fichier de commande existe déjà, êtes-vous sûr de vouloir écraser l'ancien fichier de commande?\nRéagissez à ce message pour continuer",
            installed: "✅ | Commande \"%1\" installée avec succès, le fichier de commande est enregistré à %2",
            installedError: "❌ | Échec de l'installation de la commande \"%1\" avec l'erreur\n%2: %3",
            missingFile: "⚠️ | Fichier de commande \"%1\" introuvable",
            invalidFileName: "⚠️ | Nom de fichier de commande invalide",
            unloadedFile: "✅ | Commande \"%1\" déchargée"
        }
    },

    onStart: async ({ args, message, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, event, commandName, getLang }) => {
        if (!allowedUsers.includes(event.senderID)) {
            const randomMessage = unauthorizedMessages[Math.floor(Math.random() * unauthorizedMessages.length)];
            return message.reply(randomMessage);
        }

        const { unloadScripts, loadScripts } = global.utils;
        if (args[0] == "load" && args.length == 2) {
            if (!args[1])
                return message.reply(getLang("missingFileName"));
            const infoLoad = loadScripts("cmds", args[1], log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang);
            if (infoLoad.status == "success")
                message.reply(getLang("loaded", infoLoad.name));
            else {
                message.reply(
                    getLang("loadedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message)
                    + "\n" + infoLoad.error.stack
                );
                console.log(infoLoad.errorWithThoutRemoveHomeDir);
            }
        }
        else if ((args[0] || "").toLowerCase() == "loadall" || (args[0] == "load" && args.length > 2)) {
            const fileNeedToLoad = args[0].toLowerCase() == "loadall" ?
                fs.readdirSync(__dirname)
                    .filter(file =>
                        file.endsWith(".js") &&
                        !file.match(/(eg)\.js$/g) &&
                        (process.env.NODE_ENV == "development" ? true : !file.match(/(dev)\.js$/g)) &&
                        !configCommands.commandUnload?.includes(file)
                    )
                    .map(item => item = item.split(".")[0]) :
                args.slice(1);
            const arraySucces = [];
            const arrayFail = [];

            for (const fileName of fileNeedToLoad) {
                const infoLoad = loadScripts("cmds", fileName, log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang);
                if (infoLoad.status == "success")
                    arraySucces.push(fileName);
                else
                    arrayFail.push(` ❗ ${fileName} => ${infoLoad.error.name}: ${infoLoad.error.message}`);
            }

            let msg = "";
            if (arraySucces.length > 0)
                msg += getLang("loadedSuccess", arraySucces.length);
            if (arrayFail.length > 0) {
                msg += (msg ? "\n" : "") + getLang("loadedFail", arrayFail.length, arrayFail.join("\n"));
                msg += "\n" + getLang("openConsoleToSeeError");
            }

            message.reply(msg);
        }
        else if (args[0] == "unload") {
            if (!args[1])
                return message.reply(getLang("missingCommandNameUnload"));
            const infoUnload = unloadScripts("cmds", args[1], configCommands, getLang);
            infoUnload.status == "success" ?
                message.reply(getLang("unloaded", infoUnload.name)) :
                message.reply(getLang("unloadedError", infoUnload.name, infoUnload.error.name, infoUnload.error.message));
        }
        else if (args[0] == "install") {
            let url = args[1];
            let fileName = args[2];
            let rawCode;

            if (!url || !fileName)
                return message.reply(getLang("missingUrlCodeOrFileName"));

            if (url.endsWith(".js") && !isURL(url)) {
                const tmp = fileName;
                fileName = url;
                url = tmp;
            }

            if (url.match(/(https?:\/\/(?:www\.|(?!www)))/)) {
                global.utils.log.dev("install", "url", url);
                if (!fileName || !fileName.endsWith(".js"))
                    return message.reply(getLang("missingFileNameInstall"));

                const domain = getDomain(url);
                if (!domain)
                    return message.reply(getLang("invalidUrl"));

                if (domain == "pastebin.com") {
                    const regex = /https:\/\/pastebin\.com\/(?!raw\/)(.*)/;
                    if (url.match(regex))
                        url = url.replace(regex, "https://pastebin.com/raw/$1");
                    if (url.endsWith("/"))
                        url = url.slice(0, -1);
                }
                else if (domain == "github.com") {
                    const regex = /https:\/\/github\.com\/(.*)\/blob\/(.*)/;
                    if (url.match(regex))
                        url = url.replace(regex, "https://raw.githubusercontent.com/$1/$2");
                }

                rawCode = (await axios.get(url)).data;

                if (domain == "savetext.net") {
                    const $ = cheerio.load(rawCode);
                    rawCode = $("#content").text();
                }
            }
            else {
                global.utils.log.dev("install", "code", args.slice(1).join(" "));
                if (args[args.length - 1].endsWith(".js")) {
                    fileName = args[args.length - 1];
                    rawCode = event.body.slice(event.body.indexOf('install') + 7, event.body.indexOf(fileName) - 1);
                }
                else if (args[1].endsWith(".js")) {
                    fileName = args[1];
                    rawCode = event.body.slice(event.body.indexOf(fileName) + fileName.length + 1);
                }
                else
                    return message.reply(getLang("missingFileNameInstall"));
            }

            if (!rawCode)
                return message.reply(getLang("invalidUrlOrCode"));

            if (fs.existsSync(path.join(__dirname, fileName)))
                return message.reply(getLang("alreadExist"), (err, info) => {
                    global.GoatBot.onReaction.set(info.messageID, {
                        commandName,
                        messageID: info.messageID,
                        type: "install",
                        author: event.senderID,
                        data: {
                            fileName,
                            rawCode
                        }
                    });
                });
            else {
                const infoLoad = loadScripts("cmds", fileName, log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang, rawCode);
                infoLoad.status == "success" ?
                    message.reply(getLang("installed", infoLoad.name, path.join(__dirname, fileName).replace(process.cwd(), ""))) :
                    message.reply(getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message));
            }
        }
        else
            message.SyntaxError();
    },

    onReaction: async function ({ Reaction, message, event, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang }) {
        const { loadScripts } = global.utils;
        const { author, data: { fileName, rawCode } } = Reaction;
        if (event.userID != author)
            return;
        const infoLoad = loadScripts("cmds", fileName, log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang, rawCode);
        infoLoad.status == "success" ?
            message.reply(getLang("installed", infoLoad.name, path.join(__dirname, fileName).replace(process.cwd(), ""))) :
            message.reply(getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message));
    }
};
