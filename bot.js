
// Connexion du bot :

const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const fichierToken = require('./token.js');
const animals = require('./animals.json');
const sujets = require('./sujets.json');
const places = require('./places.json');
const verbes = require('./verbes.json');
const noms = require('./noms.json');
const http = require('http');
const https = require('https');

  // Token :

bot.login('TOKEN');
bot.setMaxListeners(50);

// Préréglages :

const prefix = '&';
console.log('C‘est partit');
var Bulle = new Discord.RichEmbed();
var memo = '';
var exist;
var CommandList = ["&calc", "&help", "&invit", "&memo", "&memo.set", "&memo.clear", "&command", "&command.set", "&command.clear", "&info", "&info.population", "&random", "&random.animal", "&random.sentence","&info.wiki"];

// Statut :

bot.on('ready', () => {
bot.user.setPresence({ status: 'online', game: { name: '&help' } });
});

// Réception de messages :

bot.on('message', message => {

// Creation variables :

  var contenu = message.content;
  var mess = true;
  var ans = false;
  var auteur = message.author.avatar;
  var PrivateMessage = false;
  try {
    var server = message.guild.id;
  } catch(e) {
    PrivateMessage = e.constructor('Message privé !');
  } if (PrivateMessage) {
    console.log(`${PrivateMessage}`);
    PrivateMessage = true;
  } else {
    var memberlist = Array.from(message.guild.members.values());
    var server = message.guild.id;
    var exist = false
    AddDirectory(`Commands/${server}/`);
    if (fs.existsSync(`Commands/${server}/CommandsList.txt`)) {
      exist = true;
    }
    if (!exist) {
      WriteFile(`Commands/${server}/CommandsList.txt`, ``);
    }
  }

  // Si pas un bot :

    if (!message.author.bot) {

  // Commandes du bot :

      if (contenu.substring(0, 1) == prefix) {
        var mots = contenu.split(" ");
        var temp = '';
        var length = mots.length;
        var com = mots[0].split(".");

    // Commande &calc :

          if (mots[0] === prefix + 'calc') {
            if (contenu.length !== 5) {
              var réponse = Calcul(mots[1]);
              message.react('👌🏼')
              if (réponse !== 'error'){
                Bulle = NewContainer('Réponse : ' + `**${réponse}**`, 'Calcul : ' + '`' + `${mots[1]}` + '`', 'Besoin d‘aide ? &help')
              } else {
                Bulle = NewContainer('Désolé, le calcul qui a été demandé est impossible.', 'Calcul : ' + '`' + `${mots[1]}` + '`', 'Besoin d‘aide ? &help')
              }
            } else {
              Bulle = NewContainer('Commande `&calc`', 'Comment l‘utiliser ? \n```Markdown\n&calc CALCUL\n```', 'Note : Les opérateurs disponibles sont + , - , * , / et % (modulo)')
            }

    // Commande &help :

        } else if (mots[0] === prefix + 'help') {
          if (PrivateMessage) {
            Bulle = NewContainer('Liste des commandes disponibles :', 'Commandes de base :\n\n• `&help`\n• `&calc`\n• `&memo`\n• `&invit`\n• `&info`\n\n', '')
          } else {
            var tempContent = ReadFile(`Commands/${server}/CommandsList.txt`);
            var tempArray = tempContent.split(',');
            tempContent = tempArray.join('\n• ');
            if (tempContent === '') {
              Bulle = NewContainer('Liste des commandes disponibles :', 'Commandes de base :\n\n• `&help`\n• `&calc`\n• `&memo`\n• `&invit`\n• `&command`\n• `&info`\n\n', '')
            } else {
              Bulle = NewContainer('Liste des commandes disponibles :', 'Commandes de base :\n\n• `&help`\n• `&calc`\n• `&memo`\n• `&invit`\n• `&command`\n• `&info`\n• `&random`\n\nCommandes du serveur :\n' + `${tempContent}`, '')
            }
          }

    // Commande &invit :

        } else if (mots[0] === prefix + 'invit') {
          Bulle = NewContainer('Pour m‘inviter dans un serveur, il faut cliquer sur le lien', 'https://bit.ly/2HrkvEi', 'Besoin d‘aide ? &help');

    // Commande &memo :

        } else if (com[0] === prefix + 'memo') {
          if (length > 2) {
            for (i = 1; i < length; i++) {
              temp = `${mots[length - i]} ` + `${temp}`;
              delete mots[length - 1];
            }
            mots[1] = `${temp}`;
          }
          exist = false;
          if (fs.existsSync(`Memo/${auteur}.txt`)) {
            exist = true;
            FileContent = ReadFile (`Memo/${auteur}.txt`);
          }
          console.log (`${exist}`);
          if (contenu.length !== mots[0].length) {
              if (com[1] === 'set') {
                WriteFile (`Memo/${auteur}.txt`, `${mots[1]}`);
                if (exist) {
                  Bulle = NewContainer('Votre mémo a été modifié avec succès !', `Ancien mémo : ` + '`' + `${FileContent}` + '`', 'Besoin d‘aide ? &help');
                } else {
                  Bulle = NewContainer('Votre mémo a été modifié avec succès !', '`&memo` pour voir votre nouveau mémo', 'Besoin d‘aide ? &help');
                }
              }
            } else if (contenu.length === 5){
              if (exist){
                Bulle = NewContainer('Votre mémo personnel :','```' + `${FileContent}` + '```', '&memo.set pour le modifier et &memo.clear pour le supprimer');
              } else {
                Bulle = NewContainer('Vous n‘avez pas encore de mémo !', 'Liste des commandes disponibles pour `&memo` :\n • `&memo.set`\n • `&memo.clear`', 'Besoin d‘aide ? &help');
              }
            } else if (com[1] === 'set') {
              Bulle = NewContainer('Commande `&memo.set`', 'Comment l‘utiliser ?\n```Markdown\n&memo.set MOT(S)\n```', 'Cette commande permet d‘ajouter un mémo personnalisé.');
            } else if (com[1] === 'clear') {
                if (exist) {
                  DeleteFile (`Memo/${auteur}.txt`);
                  Bulle = NewContainer('Votre mémo a été supprimé avec succès !', `Ancien mémo :` + '`' + `${FileContent}` + '`', 'Besoin d‘aide ? &help');
                } else {
                  Bulle = NewContainer('Vous n‘avez pas encore de mémo !', 'Pour en créer un `&memo.set`', 'Besoin d‘aide ? &help');
                }
            } else {
              Bulle = NewContainer('Commande inexistante !', '`&help` pour avoir une liste des commandes disponibles.', '');
            }

    // Commande &command :

  } else if (com[0] === prefix + 'command' && !PrivateMessage) {
          if (length > 3) {
            for (i = 1; i + 1 < length; i++) {
              temp = `${mots[length - i]} ` + `${temp}`;
              delete mots[length - 1];
            }
            mots[2] = `${temp}`;
          }
          mots[1] = prefix + mots[1];
          exist = false;
          if (fs.existsSync(`Commands/${server}/${mots[1]}.txt`)) {
            exist = true;
          }
          var mainword = false
          for (i = 0; i < CommandList.length; i++) {
            if (mots[1] === CommandList[i]) {
              mainword = true;
              console.log("Commande existante !");
            }
          }
            if (contenu.length !== mots[0].length) {
                if (com[1] === 'set') {
                  point = false;
                  if (mots[1].indexOf('.') > -1)  {
                    console.log('Caractère indésirable !')
                    point = true;
                  }
                  if (point) {
                    Bulle = NewContainer('Cette commande contient un ou plusieurs caractères ne pouvant pas être utilisés pour les commandes personnalisées !', 'Caractères trouvés : `.`', 'Besoin d‘aide ? &help');
                  } else {
                    if (exist) {
                      WriteFile (`Commands/${server}/${mots[1]}.txt`, `${mots[2]}`);
                      Bulle = NewContainer('Cette commande a été modifiée avec succès !', `Commande : ` + '`' + `${mots[1]}` + '`', 'Besoin d‘aide ? &help');
                    } else {
                      if (mainword) {
                        Bulle = NewContainer('Cette commande existe déjà et n‘est pas modifiable !', 'Pour en créer une autre, `&command.set`', 'Besoin d‘aide ? &help');
                      } else {
                        var tempContent = ReadFile(`Commands/${server}/CommandsList.txt`);
                        var tempArray = tempContent.split(',');
                        tempArray.push(`${mots[1]}`);
                        WriteFile (`Commands/${server}/CommandsList.txt`, `${tempArray}`);
                        WriteFile (`Commands/${server}/${mots[1]}.txt`, `${mots[2]}`);
                        Bulle = NewContainer('Une nouvelle commande été ajoutée !', `Commande : ` + '`' + `${mots[1]}` + '`', 'Besoin d‘aide ? &help');
                      }
                    }
                  }
                } else if (com[1] === 'clear') {
                    if (exist) {
                      var tempContent = ReadFile(`Commands/${server}/CommandsList.txt`);
                      var tempArray = tempContent.split(',');
                      console.log(`${tempArray}`);
                      for (i = 0; i < tempArray.length; i++) {
                        if (tempArray[i] === mots[1]) {
                          tempArray.splice(i, 1);
                          i = tempArray.length;
                        }
                      }
                      console.log(`${tempArray}`);
                      tempContent = tempArray.join();
                      WriteFile (`Commands/${server}/CommandsList.txt`, `${tempContent}`);
                      DeleteFile(`Commands/${server}/${mots[1]}.txt`);
                      Bulle = NewContainer('Cette commande a été supprimée avec succès !', '`&command.set` pour en créer une mouvelle', 'Besoin d‘aide ? &help');
                    } else {
                      Bulle = NewContainer('Cette commande n‘existe pas encore !', 'Pour en créer une, `&command.set`', 'Besoin d‘aide ? &help');
                    }
                }
              } else if (contenu.length === 8){
                Bulle = NewContainer('Commande &command','Liste des commandes disponibles pour `&command` :\n • `&command.set`\n • `&command.clear`', 'Besoin d‘aide ? &help');
              } else if (com[1] === 'set') {
                Bulle = NewContainer('Commande `&command.set`', 'Comment l‘utiliser ?\n```Markdown\n&command.set COMMANDE MOT(S)\n```', 'Cette commande permet d‘ajouter une commande personnalisée. Attention, ne pas mettre de "." dans la commande !');
              } else if (com[1] === 'clear') {
                Bulle = NewContainer('Commande `&command.clear`', 'Comment l‘utiliser ?\n```Markdown\n&command.clear COMMANDE\n```', 'Cette commande permet d‘effacer une commande existante.');
              } else {
                Bulle = NewContainer('Commande inexistante !', '`&help` pour avoir une liste des commandes disponibles.', '');
              }

    // Commande &info :

  } else if (com[0] === prefix + 'info') {
    if (length > 2) {
      for (i = 1; i < length; i++) {
        temp = `${mots[length - i]}%20` + `${temp}`;
        delete mots[length - 1];
      }
      mots[1] = temp.slice(0,-3);
    }
    console.log(mots[1]);
    var url = '';
    if (contenu.length !== mots[0].length) {
      mess = false;
        if (com[1] === 'population') {
            url = `http://api.population.io:80/1.0/population/${mots[1]}/today-and-tomorrow/`;
            http.get(url, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];
                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                    Bulle = NewContainer('Un problème est survenu !', 'Cette commande ne paraît pas actuellement foctionnelle, réessayez plus tard.', 'Besoin d‘aide ? &help');
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                    Bulle = NewContainer('Un problème est survenu !', 'Cette commande ne paraît pas actuellement foctionnelle, réessayez plus tard.', 'Besoin d‘aide ? &help');
                    message.channel.send(Bulle);
                    console.log(`Message: ${message}`);
                }
                if (error) {
                    console.error(error.message);
                    res.resume();
                    Bulle = NewContainer('Un problème est survenu !', 'Le terme indiqué n‘est pas présent dans la base de données.', 'Besoin d‘aide ? &help');
                    message.channel.send(Bulle);
                    console.log(`Message: ${message}`);
                }
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        var Population = parsedData.total_population[0].population;
                        console.log('Population de ' + mots[1] + ' : ' + Population);
                        Bulle = NewContainer('Population totale :', '`' + Population + '` habitants à ce jour.', 'Besoin d‘aide ? &help');
                        message.channel.send(Bulle);
                        console.log(`Message: ${message}`);
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
                Bulle = NewContainer('Un problème est survenu !', 'Le terme indiqué n‘est pas présent dans la base de données.', '&info.population pour réessayer');
                message.channel.send(Bulle);
                console.log(`Message: ${message}`);
            });
        } else if (com[1] === 'wiki') {
            if (contenu == '&info.wiki JenBot') {
                console.log("Recherche Wikipédia effectuée : JenBot");
                Bulle = NewContainer('JenBot', '`JenBot est un célèbre bot créé par Jenoor©, il a comme fonction de divertir et aider ceux qui utilisent ses commandes. Ce bot fonctionne avec NodeJS sur Discord.`\n\n Recherche effectuée : `JenBot`\n En savoir plus : https://fr.wikipedia.org/wiki/Jeannot', 'Besoin d‘aide ? &help');
                message.channel.send(Bulle);
                console.log(`Message: ${message}`);
            } else {
                var name = encodeURI(mots[1]);
                url = `https://fr.wikipedia.org/w/api.php?action=opensearch&format=json&search=${name}&limit=5`;
                https.get(url, function (res) {
                    var body = '';

                    res.on('data', function (chunk) {
                        body += chunk;
                    });

                    res.on('end', function () {
                        var response = JSON.parse(body);
                        console.log(response);
                        var recherche = response[0];
                        var suggestion = response[1][0];
                        var definition = response[2][0];
                        var lien = response[3][0];
                        if (definition == undefined | definition == '') {
                            Bulle = NewContainer("Un problème est survenu !", 'Le terme indiqué n‘est pas présent dans la base de données ou ne veut tout simplement rien dire.', '&info.wiki pour réessayer');
                            message.channel.send(Bulle);
                            console.log(`Message: ${message}`);
                        } else if (definition.length - 1 == definition.indexOf(':')) {
                            if (response[2][1] == undefined | response[2][1] == '') {
                                Bulle = NewContainer("Un problème est survenu !", 'Le terme indiqué n‘est pas présent dans la base de données ou ne veut tout simplement rien dire.', '&info.wiki pour réessayer');
                                message.channel.send(Bulle);
                                console.log(`Message: ${message}`);
                            } else {
                                definition = response[2][1];
                                console.log("Recherche Wikipédia effectuée : " + suggestion);
                                Bulle = NewContainer(suggestion, '`' + definition + '`\n\n Recherche effectuée : ' + '`' + recherche + '`\n En savoir plus : ' + lien, 'Besoin d‘aide ? &help');
                                message.channel.send(Bulle);
                                console.log(`Message: ${message}`);
                            }
                        } else {
                            console.log("Recherche Wikipédia effectuée : " + suggestion);
                            Bulle = NewContainer(suggestion, '`' + definition + '`\n\n Recherche effectuée : ' + '`' + recherche + '`\n En savoir plus : ' + lien, 'Besoin d‘aide ? &help');
                            message.channel.send(Bulle);
                            console.log(`Message: ${message}`);
                        }
                    });
                }).on('error', function (e) {
                    console.log("Il y a une erreur :", e);
                    Bulle = NewContainer('Un problème est survenu !', 'Cette commande ne paraît pas actuellement foctionnelle, réessayez plus tard.', 'Besoin d‘aide ? &help');
                    message.channel.send(Bulle);
                });
            }
        }
  } else if (contenu.length == 5) {
        Bulle = NewContainer('Commande &info', 'Liste des commandes disponibles pour `&info` :\n • `&info.population`\n • `&info.wiki`', 'Besoin d‘aide ? &help');
  } else if (com[1] === 'population' && com[0] === prefix + 'info') {
    Bulle = NewContainer('Commande &info.population', 'Comment l‘utiliser ?\n```Markdown\n&info.population PAYS\n```\n**Attention !** Le nom du pays doit être en anglais et commencer par une majuscule.\nLa liste des pays est disponible ici : http://api.population.io:80/1.0/countries', 'Cette commande permet d‘indiquer le nombre d‘habitants du pays indiqué.');
  } else if (com[1] === 'wiki' && com[0] === prefix + 'info') {
     Bulle = NewContainer('Commande &info.wiki', 'Comment l‘utiliser ?\n```Markdown\n&info.wiki MOT(S)\n```', 'Cette commande permet de faire une recherche rapide du terme indiqué sur Wikipédia.');
  }

    // Commande &random :

  } else if (com[0] === prefix + 'random') {
    if (contenu == '&random') {
      Bulle = NewContainer('Commande &random', 'Liste des commandes disponibles pour `&random` :\n • `&random.animal`\n • `&random.sentence`\n • `&random.place`', 'Besoin d‘aide ? &help');
    } else if (contenu == '&random.animal') {
      var RandomNumber = Random(0, 1750);
      var RandomAnimal = animals[`${RandomNumber}`];
      Bulle = NewContainer('Animal aléatoire :', '`' + RandomAnimal + '` (nom en anglais)', 'Besoin d‘aide ? &help');
    } else if (contenu == '&random.sentence') {
      var RandomNumber = Random(1, 60);
      var RandomSujet = sujets[RandomNumber];
        if (RandomNumber < 11 && RandomNumber > 0) {
          RandomNumber = Random(1, 10);
      } else if (RandomNumber < 21 && RandomNumber > 10) {
        RandomNumber = Random(11, 20);
      } else if (RandomNumber < 36 && RandomNumber > 20) {
        RandomNumber =  Random(21, 35);
      } else if (RandomNumber < 46 && RandomNumber > 35) {
        RandomNumber = Random(36, 45);
      } else if (RandomNumber < 56 && RandomNumber > 45) {
          RandomNumber = Random(46, 55);
        } else {
          RandomNumber = Random(56, 65);
        }
      var RandomVerbe = verbes[RandomNumber];
      RandomNumber = Random(1, 56);
      var RandomNom = noms[RandomNumber];
      Bulle = NewContainer('Phrase aléatoire :', '`' + RandomSujet + ' ' + RandomVerbe + ' ' + RandomNom + '`', 'Besoin d‘aide ? &help');
    } else if (contenu == '&random.place') {
      var RandomNumber = Random(0, 12);
      var RandomPlace = places[RandomNumber].Name;
      var PlacePosition = places[RandomNumber].Position;
      var PlaceImage = places[RandomNumber].Image;
      Bulle = NewContainer('Endroit aléatoire :', '`' + RandomPlace + `: ` + PlacePosition + '`', 'Besoin d‘aide ? &help').setImage(PlaceImage);
    } else {
      Bulle = NewContainer('Commande inexistante !', '`&help` pour avoir une liste des commandes disponibles.', '');
    }

    // Commades personnalisées :

  } else if (fs.existsSync(`Commands/${server}/${com[0]}.txt`)) {
    FileContent = ReadFile (`Commands/${server}/${com[0]}.txt`);
    if (FileContent === 'undefined') {
      Bulle = NewContainer('Le créateur de cette commande n‘a pas spécifié de réponse !', '`&command.set` pour rajouter une réponse.', 'Besoin d‘aide ? &help');
      message.channel.send(Bulle);
    } else {
      message.channel.send (`${FileContent}`);
    }


    // Message d'erreur si commande inexistante :

  } else {
    Bulle = NewContainer('Commande inexistante !', '`&help` pour avoir une liste des commandes disponibles.', '');
  }

    // Envoi de la réponse :

    if (!fs.existsSync(`Commands/${server}/${com[0]}.txt`) && mess) {
      message.channel.send(Bulle);
      console.log(`Message: ${message}`);
    }
   }
  }
})

// Réglages de la Bulle dans laquelle il y a les textes :

function NewContainer(title, description, footer) {
  var réponse = new Discord.RichEmbed()
  .setTitle(title)
  .setDescription(description)
  .setFooter(footer)
  .setColor("#FFFFFF")
  return réponse;
}

// Numéros aléatoires :

function Random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calcul :

function Calcul(calcul) {
  var err = false;
  try {
    eval(calcul);
  } catch(e) {
    err = e.constructor('Pas de calcul correct !')
    console.log(`${err}`);
  } if (err) {
    var réponse = 'error';
  } else {
    var réponse = eval(calcul);
  }
  return réponse;
}

// Ecriture fichier texte :

function WriteFile (name, text) {
  fs.writeFile(`${name}`, `${text}`, (err) => {
  if (err) throw err;
  console.log('Fichier enregistré avec succès !');
  })
}

// Lire un fichier existant pour &memo :

function ReadFile (name) {
  var reponse = 'Error';
  var array = fs.readFileSync(`${name}`).toString().split("\n");
  for(i in array) {
    reponse = (array[i]);
  }
  return reponse;
  console.log ('Lu avec succès !');
}

// Effacer un fichier :

function DeleteFile (name) {
  var reponse = 0;
  fs.unlink(`${name}`, (err) => {
  if (err) {
    console.log('Pas de Fichier');
  } else {
    console.log('Effacé avec succès !');
  }
});
}

// Ajouter une dossier :

function AddDirectory (dir) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log('Dossier créé !');
 }
}
