const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "contacteradmin",
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: "Envoyer un message à l'administrateur du bot",
		category: "📞 Contact Admin",
		guide: "{pn} <message>"
	},

	langs: {
		fr: {
			missingMessage: "❌ Veuillez entrer un message à envoyer à l'administrateur.",
			sendByGroup: "\n📍 Envoyé depuis le groupe : %1\n🆔 ID du groupe : %2",
			sendByUser: "\n📍 Envoyé par un utilisateur en privé.",
			content: "\n\n📩 **Message** :\n─────────────────\n%1\n─────────────────\n💬 *Répondez à ce message pour envoyer une réponse à l'utilisateur.*",
			success: "✅ Message envoyé avec succès à %1 administrateur(s) !\n%2",
			failed: "⚠️ Erreur lors de l'envoi du message à %1 administrateur(s) !\n%2\n🔎 Vérifiez la console pour plus de détails.",
			reply: "📨 **Réponse de l'Admin %1** :\n─────────────────\n%2\n─────────────────\n💬 *Répondez à ce message pour continuer la conversation.*",
			replySuccess: "✅ Votre réponse a été envoyée à l'admin avec succès !",
			feedback: "📥 **Réponse de l'utilisateur %1** :\n🆔 **ID utilisateur** : %2%3\n\n📩 **Message** :\n─────────────────\n%4\n─────────────────\n💬 *Répondez à ce message pour envoyer une réponse à l'utilisateur.*",
			replyUserSuccess: "✅ Votre réponse a été envoyée à l'utilisateur avec succès !",
			noAdmin: "⚠️ Aucun administrateur n'est actuellement disponible."
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		const { config } = global.GoatBot;
		if (!args[0]) return message.reply(getLang("missingMessage"));

		const { senderID, threadID, isGroup } = event;
		if (config.adminBot.length == 0) return message.reply(getLang("noAdmin"));

		const senderName = await usersData.getName(senderID);
		const msg = `📨 **Message à l'Admin** 📨`
			+ `\n👤 **Utilisateur** : ${senderName}`
			+ `\n🆔 **ID** : ${senderID}`
			+ (isGroup ? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID) : getLang("sendByUser"));

		const formMessage = {
			body: msg + getLang("content", args.join(" ")),
			mentions: [{ id: senderID, tag: senderName }],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		const successIDs = [];
		const failedIDs = [];
		const adminNames = await Promise.all(config.adminBot.map(async item => ({
			id: item,
			name: await usersData.getName(item)
		})));

		for (const uid of config.adminBot) {
			try {
				const messageSend = await api.sendMessage(formMessage, uid);
				successIDs.push(uid);
				global.GoatBot.onReply.set(messageSend.messageID, {
					commandName,
					messageID: messageSend.messageID,
					threadID,
					messageIDSender: event.messageID,
					type: "userCallAdmin"
				});
			} catch (err) {
				failedIDs.push({ adminID: uid, error: err });
			}
		}

		let responseMessage = "";
		if (successIDs.length > 0)
			responseMessage += getLang("success", successIDs.length,
				adminNames.filter(item => successIDs.includes(item.id))
					.map(item => ` <@${item.id}> (${item.name})`).join("\n")
			);
		if (failedIDs.length > 0) {
			responseMessage += getLang("failed", failedIDs.length,
				failedIDs.map(item => ` <@${item.adminID}> (${adminNames.find(item2 => item2.id == item.adminID)?.name || item.adminID})`).join("\n")
			);
			log.err("CALL ADMIN", failedIDs);
		}
		return message.reply({
			body: responseMessage,
			mentions: adminNames.map(item => ({ id: item.id, tag: item.name }))
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const { isGroup } = event;

		switch (type) {
			case "userCallAdmin": {
				const formMessage = {
					body: getLang("reply", senderName, args.join(" ")),
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);
					message.reply(getLang("replyUserSuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}
			case "adminReply": {
				let sendByGroup = "";
				if (isGroup) {
					const { threadName } = await api.getThreadInfo(event.threadID);
					sendByGroup = getLang("sendByGroup", threadName, event.threadID);
				}
				const formMessage = {
					body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);
					message.reply(getLang("replySuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
		}
	}
};