const {Router} = require("express");
const { getToDo, saveToDo, saveUser } = require("../controllers/TODOController");

const router = Router()

router.get('/',getToDo)
router.post('/save',saveToDo)

module.exports = router;