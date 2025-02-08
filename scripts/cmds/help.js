const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | Goat Bot V2 ]";
/**
* @author NTKhang
* @author: do not delete it
* @message if you delete or edit it you will get a global ban
*/

module.exports = {
	config: {
		name: "help",
		version: "1.21",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem cách sử dụng của các lệnh",
			en: "View command usage"
		},
		category: "info",
		guide: {
			vi: "   {pn} [để trống | <số trang> | <tên lệnh>]"
				+ "\n   {pn} <command name> [-u | usage | -g | guide]: chỉ hiển thị phần hướng dẫn sử dụng lệnh"
				+ "\n   {pn} <command name> [-i | info]: chỉ hiển thị phần thông tin về lệnh"
				+ "\n   {pn} <command name> [-r | role]: chỉ hiển thị phần quyền hạn của lệnh"
				+ "\n   {pn} <command name> [-a | alias]: chỉ hiển thị phần tên viết tắt của lệnh",
			en: "{pn} [empty | <page number> | <command name>]"
				+ "\n   {pn} <command name> [-u | usage | -g | guide]: only show command usage"
				+ "\n   {pn} <command name> [-i | info]: only show command info"
				+ "\n   {pn} <command name> [-r | role]: only show command role"
				+ "\n   {pn} <command name> [-a | alias]: only show command alias"
		},
		priority: 1
	},

	langs: {
		vi: {
			help: "╭─────────────⭓"
				+ "\n%1"
				+ "\n├─────⭔"
				+ "\n│ Trang [ %2/%3 ]"
				+ "\n│ Hiện tại bot có %4 lệnh có thể sử dụng"
				+ "\n│ » Gõ %5help <số trang> để xem danh sách các lệnh"
				+ "\n│ » Gõ %5help để xem chi tiết cách sử dụng lệnh đó"
				+ "\n├────────⭔"
				+ "\n│ %6"
				+ "\n╰─────────────⭓",
			help2: "%1├───────⭔"
				+ "\n│ » Hiện tại bot có %2 lệnh có thể sử dụng"
				+ "\n│ » Gõ %3help <tên lệnh> để xem chi tiết cách sử dụng lệnh đó"
				+ "\n│ %4"
				+ "\n╰─────────────⭓",
			commandNotFound: "Lệnh \"%1\" không tồn tại",
			getInfoCommand: "╭── COMMAND DETAILS ────⭓"
				+ "\n│ Name: %1"
				+ "\n├── INFO"
				+ "\n│ Description: %2"
				+ "\n│ Aliases: %3"
				+ "\n│ Group Aliases: %4"
				+ "\n│ Version: %5"
				+ "\n│ Role: %6"
				+ "\n│ Time per usage: %7s"
				+ "\n│ Author: %8"
				+ "\n├── USAGE"
				+ "\n│ %9"
				+ "\n╰────────⭔",
			onlyInfo: "╭── COMMAND INFO ────⭓"
				+ "\n│ Name: %1"
				+ "\n│ Description: %2"
				+ "\n│ Aliases: %3"
				+ "\n│ Group Aliases: %4"
				+ "\n│ Version: %5"
				+ "\n│ Role: %6"
				+ "\n│ Time per usage: %7s"
				+ "\n│ Author: %8"
				+ "\n╰─────────────⭓",
			onlyUsage: "╭── USAGE ────⭓"
				+ "\n│ %1"
				+ "\n╰─────────────⭓",
			onlyAlias: "╭── ALIAS ────⭓"
				+ "\n│ Aliases: %1"
				+ "\n│ Group Aliases: %2"
				+ "\n╰─────────────⭓",
			onlyRole: "╭── ROLE ────⭓"
				+ "\n│ %1"
				+ "\n╰─────────────⭓",
			doNotHave: "Không có",
			roleText0: "0 (Tất cả người dùng)",
			roleText1: "1 (Quản trị viên nhóm)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (set role, tất cả người dùng)",
			roleText1setRole: "1 (set role, quản trị viên nhóm)",
			pageNotFound: "Trang %1 không tồn tại"
		},
		en: {
			help: "╭─────────────⭓"
				+ "\n%1"
				+ "\n├─────⭔"
				+ "\n│ Page [ %2/%3 ]"
				+ "\n│ Currently, the bot has %4 commands that can be used"
				+ "\n│ » Type %5help <page> to view the command list"
				+ "\n│ » Type %5help to view the details of how to use that command"
				+ "\n├────────⭔"
				+ "\n│ %6"
				+ "\n╰─────────────⭓",
			help2: "%1├───────⭔"
				+ "\n│ » Currently, the bot has %2 commands that can be used"
				+ "\n│ » Type %3help <command name> to view the details of how to use that command"
				+ "\n│ %4"
				+ "\n╰─────────────⭓",
			commandNotFound: "Command \"%1\" does not exist",
			getInfoCommand: "╭── COMMAND DETAILS ────⭓"
				+ "\n│ Name: %1"
				+ "\n├── INFO"
				+ "\n│ Description: %2"
				+ "\n│ Aliases: %3"
				+ "\n│ Group Aliases: %4"
				+ "\n│ Version: %5"
				+ "\n│ Role: %6"
				+ "\n│ Time per usage: %7s"
				+ "\n│ Author: %8"
				+ "\n├── USAGE"
				+ "\n│ %9"
				+ "\n╰────────⭔",
			onlyInfo: "╭── COMMAND INFO ────⭓"
				+ "\n│ Name: %1"
				+ "\n│ Description: %2"
				+ "\n│ Aliases: %3"
				+ "\n│ Group Aliases: %4"
				+ "\n│ Version: %5"
				+ "\n│ Role: %6"
				+ "\n│ Time per usage: %7s"
				+ "\n│ Author: %8"
				+ "\n╰─────────────⭓",
			onlyUsage: "╭── USAGE ────⭓"
				+ "\n│ %1"
				+ "\n╰─────────────⭓",
			onlyAlias: "╭── ALIAS ────⭓"
				+ "\n│ Aliases: %1"
				+ "\n│ Group Aliases: %2"
				+ "\n╰─────────────⭓",
			onlyRole: "╭── ROLE ────⭓"
				+ "\n│ %1"
				+ "\n╰─────────────⭓",
			doNotHave: "Do not have",
			roleText0: "0 (All users)",
			roleText1: "1 (Group administrators)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (set role, all users)",
			roleText1setRole: "1 (set role, group administrators)",
			pageNotFound: "Page %1 does not exist"
		}
	},

	onStart: async function ({ message, args, event, threadsData, getLang, role, globalData }) {
		const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
		let customLang = {};
		const pathCustomLang = path.normalize(`${process.cwd()}/languages/cmds/${langCode}.js`);
		if (fs.existsSync(pathCustomLang))
			customLang = require(pathCustomLang);

		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);
		let sortHelp = threadData.settings.sortHelp || "name";
		if (!["category", "name"].includes(sortHelp))
			sortHelp = "name";
		const commandName = (args[0] || "").toLowerCase();
		let command = commands.get(commandName) || commands.get(aliases.get(commandName));
		const aliasesData = threadData.data.aliases || {};
		if (!command) {
			for (const cmdName in aliasesData) {
				if (aliasesData[cmdName].includes(commandName)) {
					command = commands.get(cmdName);
					break;
				}
			}
		}

		if (!command) {
			const globalAliasesData = await globalData.get
