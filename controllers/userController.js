const Notice  = require('../models/Notice')

const loadNewsPage  =  async (req,res)  => {
    let dailyNews = [];
    let weeklyNews = [];
    let monthlyNews = [];

    try {
        let notices = await Notice.find({})

        notices.forEach(notice => {
            if(notice.noticeType == 'daily'){
                dailyNews.push(notice)
            }else if(notice.noticeType == 'weekly'){
                weeklyNews.push(notice)
            }else{
                monthlyNews.push(notice)
            }
        })

        res.status(200)
        res.render('newspage', {dailyNews:dailyNews, weeklyNews:weeklyNews, monthlyNews:monthlyNews})
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Didn't load the news !`})
    }
}

const loadShowNotice  = async (req,res) =>{
    let id = req.params.id

    try {
        let notice = await Notice.findById(id)

        if(notice){
            let click = await Notice.findByIdAndUpdate(id, {$inc:{clicks:1}})
        
            res.status(200)
            res.render('singleNotice', {body:notice})
        }else{
            res.status(400)
            res.render('errorPage', {message:`This notice don't exist !`})
        }
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Didn't load the notice !`})
    }
}

const search = async  (req,res) => {

    let search =  req.body.search.trim()

    try {

        let newsFound = await Notice.aggregate([
            {
              '$search': {
                'index': 'default',
                'text': {
                  'query': search,
                  'path': {
                    'wildcard': '*'
                  }
                }
              }
            }
          ])

          res.status(200)
          res.render('searchNoticePage', {searchedNews:newsFound})
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Can't search this !`})
    }
}

module.exports = {loadNewsPage,loadShowNotice,search}