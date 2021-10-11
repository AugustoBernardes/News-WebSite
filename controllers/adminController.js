const User = require('../models/User')
const Notice = require('../models/Notice')
const jwt = require('jsonwebtoken')
const cloudinary = require('../utils/cloudinary')
const { findById } = require('../models/User')
require('dotenv').config()
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const SECRET = process.env.JWT_SECRET

// LOGIN
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const loadLoginPage = (req,res) =>  {
    res.status(200)
    res.render('loginPage',{body:{}})
}

const login  = async (req,res) => {
    let userPassword = req.body.Password.trim()

    try {
        let userSelected = await User.findOne({password:userPassword})
    
        if(userSelected){
            let token = jwt.sign({password:userPassword},SECRET)

            res.cookie('token', token, { maxAge: 18000000, httpOnly: true });
            res.status(200)
            res.redirect('/admin/home')
        }else{
            res.status(403)
            res.render('errorPage', {message:`Password incorrect!`})
        }
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Happened a error!`})
    }
}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// HOME
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const loadHomePage =  async (req,res)  => {
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
        res.render('homePage', {dailyNews:dailyNews, weeklyNews:weeklyNews, monthlyNews:monthlyNews})
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Didn't load  the  news !`})
    }
}

// ADD
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const loadAddPage = (req,res) => {
    res.status(400)
    res.render('addNotice')
}

const addNotice = async (req,res) => {
    // Receiving the data from body
    let title = req.body.title.trim()
    let description = req.body.description.trim()
    let content = req.body.content.trim()

    try {
        // Receiving the URLS from cloudnary
        const result = await cloudinary.uploader.upload(req.file.path)

        // Creating  a object
        let notice = {
            title:title,
            description:description,
            content:content,
            image_url:result.secure_url,
            cloudinary_id:result.public_id,
        }

        // Saving the  object on DataBase
        notice = new Notice(notice)
        await notice.save()

        res.status(200)
        res.render('success', {message:`Notice added!`})
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Notice wasn't add!`})
    }
}

// EDIT

const loadEditPage =   async (req,res) => {
    let id = req.params.id

    try {
        let notice = await Notice.findById(id)

        if(notice){
            res.status(200)
            res.render('editNotice',  {body:notice})
        }else{
            res.status(400)
            res.render('errorPage', {message:`This notice don't exist!`})
        }

    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Edit  page wasn't load!`})
    }
}

const editNotice  = async (req,res)  => {

    let id = req.params.id

    // Receiving the data from body
    let title = req.body.title.trim()
    let description = req.body.description.trim()
    let content = req.body.content.trim()
    try {

        let notice = {
            title:title,
            description:description,
            content:content
        }

        await Notice.findByIdAndUpdate(id, notice) 

        res.status(200)
        res.render('success', {message:`Notice edited!`})
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Notice wasn't add!`})
    }
}

// UPDATE TYPE

const loadUpdatePage = async (req,res) => {

    let  id = req.params.id

    try {
        let  notice = await Notice.findById(id)

        res.status(200)
        res.render('updatePage', {body:notice})
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Notice wasn't add!`})
    }
}


const updateNotice = async (req,res) => {
    let  id = req.params.id

    try {
        let notice = await Notice.findById(id)
        
        if(notice.noticeType == 'daily'){
           await Notice.findByIdAndUpdate(id,{noticeType:'weekly'})
        }else{
           await Notice.findByIdAndUpdate(id,{noticeType:'monthly'})
        }

        res.redirect('/admin/home')
    } catch (error) {
        res.status(400)
        res.render('errorPage', {message:`Notice wasn't update!`})
    }
}
 
// DELETE

const deleteNotice = async (req,res) => {
    let id = req.params.id
    try {
        // Finding the  notice
        let notice =  await Notice.findById(id)

        // Deleting  image from cloudinary
        await cloudinary.uploader.destroy(notice.cloudinary_id)

        // Deleting notice  from DataBase
        await notice.remove()

        res.render('success',   {message:`Notice succesfully deleted!`})
    } catch (error) {
        res.render('errorPage', {message:`Notice wasn't delete!`})
    }
}

module.exports = {loadLoginPage,login,loadHomePage,loadAddPage,addNotice,loadEditPage,editNotice,loadUpdatePage,updateNotice,deleteNotice,}