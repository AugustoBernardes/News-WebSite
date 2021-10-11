const express =  require('express')
const {loadNewsPage,loadShowNotice,search} = require('../controllers/userController')
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const router = express.Router()

// Route GET
router.get('/',loadNewsPage)
router.get('/notice/:id',loadShowNotice)
// Route POST
router.post('/search',express.urlencoded({extended:true}),search)


module.exports = router