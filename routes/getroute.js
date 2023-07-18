const { addData, getStatistics, getPichart, getCombineddata } = require("../controllers/dataController");

const router = require("express").Router();
 

router.get("/getdata",addData)
router.get("/getStatistics",getStatistics)
router.get("/getPichart",getPichart)
router.get("/getCombineddata",getCombineddata)



module.exports = router;
