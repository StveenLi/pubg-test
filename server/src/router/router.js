import express from "express"
import { PubgQuery } from "../controler/PubgQuery"

const pubg = new PubgQuery
export const router = express.Router()

router.get('/query', (req, res)=>{
    try {
        let nick_name = req.query.nick
        console.log("query by nickname:", nick_name)
    
        pubg.GetUserProfile(nick_name).then( (ret) => {
            res.end(ret)
        }, (ret) => {
            res.end(ret)
        })
    } catch (e) {
        console.log(e)
        res.end("execption")
    }
})

router.all('*', (req, res) => {
    res.end('404')
})

