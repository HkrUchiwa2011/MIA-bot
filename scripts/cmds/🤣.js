module.exports = {
	config: {
		name: "🤣", // Nom de la commande
		version: "1.0", // Version
		author: "NTKhang & Personnalisé par GPT", // Auteur
		countDown: 5, // Délai entre les exécutions (en secondes)
		role: 0, // Rôle requis (0: utilisateur normal, 1: admin du chat, 2: propriétaire du bot)
		shortDescription: {
			vi: "répond au rire 🤣",
			en: "replies to 🤣"
		},
		description: {
			vi: "commande pour répondre aléatoirement aux emojis '🤣'",
			en: "command to randomly reply to 🤣 emojis"
		},
		category: "fun", // Catégorie
		guide: {
			vi: "envoie simplement 🤣",
			en: "just send 🤣"
		}
	},

	langs: {
		vi: {
			reply1: "Arrête de rire ça me donne la nausée",
			reply2: "T'es au courant que les mouches existent. L'intérieur de ta bouche serait ravi de les accueillir 🙂",
			reply3: "Cache tes dents jaunes 😌",
			reply4: "Tu ris autant pour oublier la réalité ?"
		},
		en: {
			reply1: "Stop laughing, it's making me sick.",
			reply2: "You do realize flies exist, right? Your mouth would be a paradise for them 🙂.",
			reply3: "Cover your yellow teeth 😌",
			reply4: "Are you laughing this much to forget reality?"
		}
	},

	onStart: async function ({ api, event, message, getLang }) {
		const responses = [
			getLang("reply1"),
			getLang("reply2"),
			getLang("reply3"),
			getLang("reply4")
		];

		// Choisir une réponse aléatoire
		const randomResponse = responses[Math.floor(Math.random() * responses.length)];

		// Répondre au message
		message.reply(randomResponse);
	}
};
