const express =  require('express')
const methodOverride = require('method-override')
const router = express.Router()
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Admin controller
const {loadLoginPage,login,loadHomePage,loadAddPage,addNotice,loadEditPage,editNotice,loadUpdatePage,updateNotice,deleteNotice} = require('../controllers/adminController')
// Authentication controller
const {authentication} = require('../controllers/auth')
// Multer
const upload = require('../utils/multer')
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

router.use(methodOverride('_method'))

// Route GET
router.get('/', loadLoginPage)
router.get('/home', authentication, loadHomePage )
router.get('/addnotice', authentication, loadAddPage)
router.get('/editnotice/:id', authentication, loadEditPage)
router.get('/update/:id',authentication,loadUpdatePage)
// Route POST
router.post('/login', express.urlencoded({extended:true}),login)
router.post('/addnotice', upload.single('image'), express.urlencoded({extended:true}), addNotice)
router.post('/editnotice/:id',express.urlencoded({extended:true}),editNotice)
router.post('/update/:id',updateNotice)
// Router Delete
router.delete('/:id',deleteNotice)



module.exports = router