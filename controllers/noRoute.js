
const noRoute = (req,res) => {
    res.status(404)
    res.render('errorPage', {message:`404 not found!`})
}

module.exports = {noRoute}