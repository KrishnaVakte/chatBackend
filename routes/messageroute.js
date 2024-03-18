const { addMessage, getAllMessage } = require("../controllers/messagecontroller")


const router = require("express").Router()

router.post("/addmessage",addMessage);
router.post("/getallmsg",getAllMessage);



module.exports = router;