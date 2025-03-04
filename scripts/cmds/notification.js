const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			fr: "Envoyer une notification de l'admin à toutes les conversations"
		},
		category: "owner",
		guide: {
			fr: "{pn} <message>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		vi: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm",
			notification: "Thông báo từ admin bot đến tất cả nhóm chat (không phản hồi tin nhắn này)",
			sendingNotification: "Bắt đầu gửi thông báo từ admin bot đến %1 nhóm chat",
			sentNotification: "✅ Đã gửi thông báo đến %1 nhóm thành công",
			errorSendingNotification: "Có lỗi xảy ra khi gửi đến %1 nhóm:\n%2"
		},
		fr: {
			missingMessage: "Veuillez entrer le message que vous souhaitez envoyer à tous les groupes.",
			notification: "📢 **Notification de l'admin**\n────────────────\n_(Ne répondez pas à ce message)_",
			sendingNotification: "⏳ Envoi en cours de la notification à %1 groupes...",
			sentNotification: "✅ Notification envoyée avec succès à %1 groupes.",
			errorSendingNotification: "❌ Une erreur est survenue lors de l'envoi à %1 groupes :\n%2"
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
		const { delayPerGroup } = envCommands[commandName];
		if (!args[0])
			return message.reply(`╭─❍\n│ 🚨 ${getLang("missingMessage")}\n╰─━━━━━━━━━━━━━╾─◊`);

		const formSend = {
			body: `╭─❍\n│ 📢 **${getLang("notification")}**\n│────────────────\n│ ${args.join(" ")}\n╰─━━━━━━━━━━━━━╾─◊`,
			attachment: await getStreamsFromAttachment(
				[
					...event.attachments,
					...(event.messageReply?.attachments || [])
				].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
			)
		};

		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
		message.reply(`╭─❍\n│ ⏳ ${getLang("sendingNotification", allThreadID.length)}\n╰─━━━━━━━━━━━━━╾─◊`);

		let sendSucces = 0;
		const sendError = [];
		const wattingSend = [];

		for (const thread of allThreadID) {
			const tid = thread.threadID;
			try {
				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			}
			catch (e) {
				sendError.push(tid);
			}
		}

		for (const sended of wattingSend) {
			try {
				await sended.pending;
				sendSucces++;
			}
			catch (e) {
				const { errorDescription } = e;
				if (!sendError.some(item => item.errorDescription == errorDescription))
					sendError.push({
						threadIDs: [sended.threadID],
						errorDescription
					});
				else
					sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
			}
		}

		let msg = "╭─❍\n";
		if (sendSucces > 0)
			msg += `│ ✅ ${getLang("sentNotification", sendSucces)}\n`;
		if (sendError.length > 0)
			msg += `│ ❌ ${getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0), sendError.reduce((a, b) => a + `\n│ - ${b.errorDescription}\n│   + ${b.threadIDs.join("\n│   + ")}`, ""))}\n`;
		msg += "╰─━━━━━━━━━━━━━╾─◊";
		message.reply(msg);
	}
};