var express = require('express');
var router = express.Router();

const config = require('../app/config.js')
const OauthClient = require('../app/oath/client.js')
var CharacterService = require('../app/services/CharacterService')

const oauthOptions = {
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET
	},
	auth: {
		tokenHost: process.env.OAUTH_TOKEN_HOST || 'https://us.battle.net'
	}
}

const oauthClient = new OauthClient({ oauthOptions })
const characterService = new CharacterService(oauthClient, config)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET character */
router.get('/character', async (req, res, next) => {
  try {
    const { characterName, realmName, region } = req.query;
    const character = await characterService.getCharacter(region, realmName, characterName);
    const characterMedia = await characterService.getCharacterMedia(character);
    const data = JSON.stringify(characterMedia)
    res.send(data);
  } catch (err) {
    next(err);
  }
})

module.exports = router;