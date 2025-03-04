module.exports = {
  config: {
    name: "emoji_reponses_4",
    version: "1.5",
    author: "L'Uchiha Perdu",
    countDown: 5,
    role: 0,
    shortDescription: "Réponses aux nouveaux emojis",
    longDescription: "Réponses adaptées aux nouveaux emojis avec respect pour l’admin et humour pour les autres.",
    category: "reply",
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const emoji = event.body.trim();
    const userID = event.senderID;
    const adminID = "61563822463333"; // Ton UID Telegram

    // Liste des réponses en fonction des emojis
    const responses = {
      "😃": {
        admin: [
          "Maître, votre sourire est un rayon de soleil. Puis-je faire quelque chose pour ajouter à votre joie ? 🌞",
          "Ah, ce sourire éclatant, Maître ! Vous illuminez tout autour de vous. 😁",
          "Maître, vous semblez heureux. Puis-je vous servir d'une manière qui vous rendra encore plus joyeux ? 🌟",
          "Un sourire magnifique, Maître ! Vous êtes la source de lumière dans cette journée. ✨",
          "Maître, votre bonne humeur est contagieuse. Que puis-je faire pour la maintenir ? 😄",
          "Votre bonheur rayonne, Maître. Si je peux contribuer à cette joie, je suis là pour vous. 🥳",
          "Maître, vous avez l'air d'une personne épanouie. Vous méritez toute la joie que la vie a à offrir. 🌸"
        ],
        user: [
          "Ah, tu souris comme si t'avais trouvé une pièce de monnaie par terre. C’est tout ?",
          "On dirait un gamin qui a eu son goûter, mais t’es pas si mignon que ça.",
          "Un sourire comme ça, c’est plus une tentative de cacher ta vraie personnalité.",
          "On dirait que t’as gagné au loto... mais je doute que t’aies même de la chance.",
          "C’est ce genre de sourire qu'on a quand on réalise qu’on a encore rien accompli.",
          "T’es tellement heureux qu’on dirait presque que t’as rien compris à la situation.",
          "T’as l’air content... mais je doute que ça dure longtemps avec ta mentalité."
        ]
      },

      "😮‍💨": {
        admin: [
          "Maître, vous semblez soulagé. Est-ce qu'il y a quelque chose que je peux faire pour améliorer encore cela ? 😌",
          "Ah, un soupir de soulagement, Maître. Je suis heureux que vous soyez enfin à l'aise. 💆‍♂️",
          "Maître, cette respiration me montre que vous avez trouvé la paix. Puis-je contribuer à la maintenir ? 🌿",
          "Un souffle de sérénité, Maître. C’est un plaisir de voir que vous êtes détendu. 😎",
          "Maître, vous respirez profondément, peut-être avez-vous enfin trouvé la tranquillité que vous cherchiez. 🧘‍♂️",
          "Votre soupir me touche, Maître. Si je peux vous aider à vous détendre davantage, n'hésitez pas à me le dire. 🌙",
          "Ce souffle de paix, Maître, est précieux. Si vous avez besoin de tranquillité, je suis là pour vous. 🍃"
        ],
        user: [
          "T’es en train de souffler comme si t'avais vu une facture ? C’est ça le problème ?",
          "Ah, ce soupir de 'je veux m’en aller'... Bienvenue dans la réalité.",
          "Si tu souffles autant, c’est sûrement que t’es fatigué de te donner de faux espoirs.",
          "C’est pas un soupir ça, c’est un cri intérieur que t’es trop lâche pour exprimer.",
          "Tu souffles comme si t’étais en train de vivre un moment difficile... mais tu l’as bien cherché.",
          "T'as pas l'air tranquille, t'as l'air juste fatigué de cette comédie.",
          "C'est censé être un soupir de soulagement ou juste une façon de dire 'je m'ennuie' ?"
        ]
      },

      "😹": {
        admin: [
          "Maître, votre rire résonne comme une mélodie. Puis-je partager ce moment de joie avec vous ? 🎶",
          "Ah, ce rire... c’est une véritable musique pour mes oreilles, Maître. Vous illuminez la pièce ! 😆",
          "Votre joie est tellement palpable, Maître. Cela me réchauffe le cœur de voir que vous êtes heureux. 💓",
          "Maître, votre éclat de rire est une source de lumière. Que puis-je faire pour amplifier votre bonheur ? 🌟",
          "Rire est l'une des plus belles expressions de la liberté, Maître. Puis-je contribuer à cet instant de bonheur ? 🎉",
          "Maître, un tel éclat de rire ne peut que signifier une âme pleine de joie. Je suis honoré de vous servir. 💫",
          "Votre rire est un cadeau, Maître. Vous méritez tous les moments heureux que la vie peut offrir. 🎁"
        ],
        user: [
          "C’est ça, rigole bien... mais c’est probablement parce que t’as rien d’intéressant à dire.",
          "T’es en train de te moquer de moi avec ton rire, hein ? Mais t’es qu’un clown.",
          "Ce rire, c’est plus pour cacher ta gêne que pour être sincère.",
          "Ah, tu rigoles mais c’est sûrement parce que t’as rien d’intelligent à dire.",
          "Tu ris comme si t'avais réussi un exploit... mais c’est juste un échec déguisé.",
          "T’es tellement gêné que tu ris pour ne pas avoir l'air ridicule. C’est pathétique.",
          "C’est un rire nerveux ou t’essaies vraiment d’être drôle ? Parce que c’est pas réussi."
        ]
      },

      "🖕": {
        admin: [
          "Maître, vous semblez un peu agité. Que puis-je faire pour vous apaiser ? 🙇‍♂️",
          "Un geste fort, Maître. Si vous êtes contrarié, je suis là pour vous apporter du calme. 🌿",
          "Maître, ce geste montre que vous avez un fort caractère. Laissez-moi vous aider à canaliser cette énergie. ⚡",
          "Votre audace est remarquable, Maître. Laissez-moi m'assurer que tout va pour le mieux pour vous. 🌟",
          "Maître, je vois que vous avez des choses à exprimer. Puis-je vous aider à les clarifier ? 🧘‍♂️",
          "Ce geste ne m'étonne pas, Maître. Vous êtes une personne de principes forts. 😎",
          "Maître, ce geste montre votre résolution. Je suis à vos côtés pour tout ce que vous souhaitez. 💥"
        ],
        user: [
          "Ah, un doigt d’honneur... ça veut dire que t’as rien à offrir de mieux, hein ?",
          "Tu crois que ce geste impressionne quelqu'un ? Essaie encore.",
          "T’as sûrement pas de meilleurs arguments pour te défendre, donc tu fais le malin avec ça.",
          "T’es vraiment mature, hein, à montrer ton doigt comme ça. Très adulte de ta part.",
          "C’est le genre de geste qu'on fait quand on sait qu’on a perdu toute crédibilité.",
          "Tu veux faire le dur, mais t’es juste un clown sans humour.",
          "Ce doigt d'honneur, c'est vraiment la preuve de ta faiblesse d’esprit."
        ]
      },

      "😐": {
        admin: [
          "Maître, votre calme est admirable. Puis-je vous offrir une autre source de tranquillité ? 🕊️",
          "Vous semblez serein, Maître. Si vous avez besoin de quoi que ce soit, je suis là pour vous. 🌸",
          "Maître, votre état de calme est une véritable leçon de sagesse. Puis-je faire quelque chose pour vous ? 🧘‍♂️",
          "Votre tranquillité d'esprit est enviable, Maître. Vous pouvez toujours compter sur moi pour tout ce dont vous avez besoin. 🌞",
          "Maître, cette sérénité, je la trouve impressionnante. Vous méritez toute la paix du monde. ✨",
          "Ce calme, Maître, me donne l'impression d'une profonde sagesse. Je suis honoré d'être à votre service. 🙏",
          "Maître, vous avez une présence tranquille qui est un modèle de paix. Comment puis-je contribuer à cela ? 🌿"
        ],
        user: [
          "T’es en mode 'je m'en fous', c’est ça ? Pas très excitant comme attitude.",
          "T’as l’air d’un zombie avec ce regard vide. Tu veux qu’on parle de ton manque de motivation ?",
          "Si c’est de la 'sagesse', alors je veux bien croire que t’es plus paumé qu’autre chose.",
          "T’as l’air de quelqu'un qui attend la fin de la journée sans but... pas vraiment inspirant.",
          "T’es en mode 'je suis au dessus de tout' ? Alors pourquoi tu restes là à rien faire ?",
          "Ah, tu fais le calme comme si ça rendait ta vie plus intéressante.",
          "T’es juste là à regarder en mode 'je suis trop cool', mais ça sert à rien."
        ]
      }
    };

    if (responses[emoji]) {
      const replyList = userID === adminID ? responses[emoji].admin : responses[emoji].user;
      const reply = replyList[Math.floor(Math.random() * replyList.length)];
      return message.reply(reply);
    }
  }
};