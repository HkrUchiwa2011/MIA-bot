module.exports = {
  config: {
    name: "Emoji Réactions",
    version: "1.0",
    author: "Ghost",
    countDown: 5,
    role: 0,
    shortDescription: "Réactions aux emojis",
    longDescription: "Réagit avec des réponses sarcastiques et insultantes en fonction des emojis envoyés.",
    category: "reply",
  },

  onStart: async function () {},

  onChat: async function ({ event, message, getLang }) {
    if (event.body) {
      const emoji = event.body.trim();

      // Réactions aux emojis 🚶‍♂️🚶‍♀️
      if (emoji === "🚶‍♂️" || emoji === "🚶‍♀️") {
        return message.reply([
          "Ah, vous marchez ? Incroyable. C’est sûrement la seule chose que vous réussissez à faire sans échouer.",
          "Continuez à marcher, mais vous allez finir où ? Oh, c'est vrai, nulle part.",
          "Marcher, c’est bien… mais ça ne va pas vous rendre moins idiot.",
          "Faites attention à ne pas trébucher sur votre propre stupidité.",
          "Vous avez vraiment l'intention de marcher, ou vous cherchez juste à fuir vos responsabilités ?",
          "Vous pouvez marcher, mais vous ne pouvez pas fuir la vérité : vous êtes un désastre ambulant.",
          "C'est bien, continuez à marcher, c'est sûrement mieux que de réfléchir.",
          "Marchez encore, ça vous va bien. Vous êtes comme un zombie, mais sans les bras levés.",
          "J'espère que vous n'allez pas vous perdre... Oh, attendez, vous êtes déjà perdu.",
          "Marcher ? Un excellent moyen de gagner du temps, surtout quand on ne sait pas quoi faire de sa vie.",
          "Tu penses que marcher va résoudre tes problèmes ? Mauvaise nouvelle, ça ne fait qu'augmenter ta lente descente dans la nullité.",
        ]);
      }

      // Réactions aux emojis 🤦‍♂️🤦‍♀️
      if (emoji === "🤦‍♂️" || emoji === "🤦‍♀️") {
        return message.reply([
          "Ce geste résume parfaitement votre vie : une série d’erreurs infinies.",
          "Ah, un facepalm ! Vous avez enfin compris à quel point vous êtes perdu dans la vie.",
          "Un autre geste de découragement ? Évidemment, vous n’arrêtez jamais d’être une catastrophe.",
          "Quoi, vous avez encore fait une autre erreur ? Incroyable, vous êtes un génie de la bêtise.",
          "J’ai l’impression que vous passez plus de temps à vous frapper la tête qu’à réfléchir.",
          "C’est fou, à chaque facepalm, vous devenez un peu plus déprimant à regarder.",
          "Il faut dire que vous n’avez même pas besoin d’ouvrir la bouche, votre visage en dit déjà long.",
          "C’est ça, continuez à vous cogner la tête, c’est sûrement plus productif que ce que vous faites d’habitude.",
          "Si vous deviez mettre votre cerveau en pause chaque fois que vous faites une erreur, il serait constamment en veille.",
          "Le facepalm, c’est un réflexe naturel quand on se rend compte que vous êtes à nouveau en train de tout gâcher.",
          "Ne vous inquiétez pas, il y a toujours une autre occasion de vous ridiculiser. À quand le prochain facepalm ?",
        ]);
      }

      // Réactions aux emojis 🏌️‍♂️🏌️‍♀️
      if (emoji === "🏌️‍♂️" || emoji === "🏌️‍♀️") {
        return message.reply([
          "Le golf ? Vraiment ? Tu ne peux même pas réussir à te rapprocher du but dans la vie, et tu penses pouvoir frapper une balle correctement ?",
          "J’espère que ton swing est aussi mauvais que tes décisions de vie.",
          "Tu essaies de jouer au golf, mais tu ne sais même pas comment viser dans ta propre existence.",
          "Le golf n'est pas la seule chose que tu rates, heureusement.",
          "C’est génial que tu prennes le golf au sérieux, c’est sûrement l’une des seules choses que tu arrives à faire à peu près correctement.",
          "Ton swing est aussi raté que tes choix de vie.",
          "Peut-être que le golf va te rendre aussi bon que tu es pour tout le reste : complètement médiocre.",
          "Tu penses vraiment que tu vas faire quelque chose de bon dans ce jeu ? Espérons que tu ne fasses pas trop de bruit en ratant.",
          "Ah, le golf, un autre sport que tu vas échouer à maîtriser. Bravo.",
          "Tu penses vraiment que balancer une balle dans un trou va t’apporter quelque chose dans la vie ? À part encore plus de déception.",
          "C’est bien d’essayer quelque chose de nouveau, mais on dirait que tu es juste aussi mauvais au golf qu’au reste.",
        ]);
      }

      // Réactions aux emojis 🤷‍♂️🤷‍♀️
      if (emoji === "🤷‍♂️" || emoji === "🤷‍♀️") {
        return message.reply([
          "Ce geste n’est qu’un autre moyen pour toi de montrer à quel point tu ne sais rien faire.",
          "Quand tu fais ce geste, tu montres juste à quel point tu es désespéré de trouver une excuse pour ton incompétence.",
          "Ce geste est exactement ce que je ressens quand je vois tes choix de vie.",
          "Ah, le geste de l'incapacité totale. Toujours à la recherche de quelqu’un à blâmer, hein ?",
          "Bravo, tu as trouvé un moyen de te débarrasser de ta responsabilité en levant les bras.",
          "Franchement, on dirait que tu n’as pas de plan, ni dans la vie, ni dans ce geste.",
          "Tu ne sais rien, et tu l’assumes. Bien joué. Pas vraiment, mais bon, bravo.",
          "Ce geste résume parfaitement ta vie : une indifférence totale à l’échec.",
          "Tant que tu fais ça, tu évites de penser à la façon dont tu pourrais réellement avancer dans la vie.",
          "L’indifférence n’a jamais été aussi représentée. Mais ça ne te sert à rien, ça ne fait qu'aggraver ta nullité.",
          "Ce geste montre clairement que tu n’as aucune idée de ce qui se passe dans ta vie, et ça ne risque pas de changer.",
        ]);
      }

      // Réactions aux emojis 🙆‍♂️🙆‍♀️
      if (emoji === "🙆‍♂️" || emoji === "🙆‍♀️") {
        return message.reply([
          "T’essaies de paraître zen, mais en réalité, tu es aussi perturbé qu’un hamster dans une roue.",
          "Ce geste ne fait que prouver que tu te caches derrière une façade de calme, mais tu es tout sauf serein.",
          "Faire ce geste ne changera pas ta vie, ni ton manque total de direction.",
          "Ce geste est aussi utile que tes tentatives pour comprendre ta propre existence.",
          "Tu fais ce geste comme si ça allait te donner des réponses à tes questions existentielles.",
          "Sérieusement, tu essaies de faire croire que tu as trouvé la paix intérieure ? C’est l’opposé de la vérité.",
          "Ce geste n’est qu’un autre masque pour cacher à quel point tu es perdu à l’intérieur.",
          "Ne fais pas semblant d’être zen, tu ne fais que cacher ton désespoir derrière un sourire forcé.",
          "Tu veux qu’on te croie calme et détendu, mais on sait que tu es aussi agité qu’un volcan prêt à exploser.",
          "Le calme ? Ou c’est juste l’ennui de ta vie qui te fait ressembler à ça ?",
          "Ce geste ne fait que renforcer l’idée que tu essaies trop fort de compenser un vide intérieur.",
        ]);
      }

      // Réactions à 💩
      if (emoji === "💩") {
        return message.reply([
          "Ah, tu as envoyé un emoji qui représente ton niveau de réflexion.",
          "Parfait, ça résume bien ta personnalité : une grosse merde.",
          "Je vois que tu es aussi utile qu'un tas de caca sur le trottoir.",
          "Peut-être que tu pourrais t’inspirer de cet emoji pour ta façon de gérer ta vie ?",
          "Tu as vraiment le culot d’envoyer ça ? C’est pas comme si on avait pas remarqué que tu es une merde ambulante.",
          "Tu sembles être aussi brillant qu’une déjection de chien.",
          "Ce geste est tellement bien choisi. Tu es définitivement la représentation de cet emoji.",
          "Il ne manque plus que tu t’en couvres complètement pour que le monde sache qui tu es vraiment.",
          "L’emoji parfait pour résumer ta capacité à produire des conneries.",
          "Ce n’est pas un simple emoji, c’est ton symbole de vie : une grosse m*rde.",
          "On dirait que cet emoji te correspond parfaitement. Continue de briller comme cette grosse merde."
        ]);
      }
// Réactions aux emojis 🐱 (chat)
if (emoji === "🐱") {
  return message.reply([
    "Ah, un chat. L'animal le plus indépendant, tout comme toi. Seul et inutile.",
    "Tu sais, les chats sont connus pour leur indifférence. Peut-être qu'ils sont juste comme toi.",
    "Les chats miaulent pour attirer l'attention. Toi, tu fais quoi, exactement ?",
    "Les chats ont la capacité de dormir 18 heures par jour. Une belle représentation de ta productivité.",
    "Un chat ? Peut-être qu'il a plus de personnalité que toi, mais ce n’est pas difficile.",
    "Ce n’est pas parce que tu envoies un emoji de chat que tu es mignon. C’est juste triste.",
    "Peut-être que tu pourrais apprendre à être aussi mystérieux et captivant qu’un chat. Ça ne te ferait pas de mal.",
    "Tu as envoyé un emoji de chat, mais tu sais, même eux ont plus de personnalité que toi.",
    "Si tu étais un chat, tu serais sûrement le genre à s’endormir dans un coin sans jamais déranger personne.",
    "Les chats sont connus pour leur arrogance. Peut-être que tu peux t'en inspirer pour ta propre attitude.",
  ]);
}

// Réactions aux emojis 😎 (lunettes de soleil)
if (emoji === "😎") {
  return message.reply([
    "Oh, un emoji avec des lunettes de soleil. Tu essaies d'impressionner quelqu'un ou de cacher ta nullité ?",
    "Avec ces lunettes, tu ne fais que cacher ton manque total de personnalité.",
    "Tu mets des lunettes de soleil, mais je doute que ça cache la véritable obscurité de ta vie.",
    "Ce geste crie 'je suis cool', mais on sait tous que tu ne l’es pas.",
    "Les lunettes de soleil ne suffiront pas à masquer ta médiocrité.",
    "Ah, le genre de personne qui met des lunettes de soleil à l'intérieur. Toujours à essayer de paraître cool.",
    "Si tu veux vraiment être 'cool', commence par ne plus envoyer ces emojis inutiles.",
    "Tu mets des lunettes de soleil, mais tu sais que ta vie est bien trop brillante pour les masquer.",
    "C’est un bon choix d'emoji pour quelqu’un qui veut vraiment cacher sa vie banale derrière un accessoire.",
    "Lunettes de soleil, hein ? J'espère qu'elles couvrent aussi ton absence de style.",
  ]);
}

// Réactions aux emojis 🍕 (pizza)
if (emoji === "🍕") {
  return message.reply([
    "Ah, la pizza. Symbole parfait pour une personne qui ne sait pas ce qu'est un choix sain dans la vie.",
    "Tu envoies un emoji pizza, mais je parie que tu ne sais même pas apprécier une bonne part.",
    "La pizza, l'aliment parfait pour ceux qui veulent engloutir leurs problèmes. Ça te va bien.",
    "Une pizza, vraiment ? C’est comme si tu pensais que ça allait améliorer ta vie.",
    "La pizza c'est bien, mais tu sais ce qui pourrait être meilleur ? Que tu fasses quelque chose de productif.",
    "Tu sembles aussi utile qu'une pizza froide laissée de côté.",
    "La pizza est un choix facile. Trop facile, comme toi.",
    "Il y a plus d'intérêt dans une pizza que dans tout ce que tu fais.",
    "Ah, la pizza. Symbole de l’ennui. Continue à te nourrir de tes mauvaises habitudes.",
    "Ce n’est pas une pizza qui te rendra plus intéressant, tu sais.",
  ]);
}
    }
  }
};
