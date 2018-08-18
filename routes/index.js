const express = require('express')
const router = express.Router()
const https = require('https')

router.get('/', (req, res, next) => {

    // https.get('http://pokeapi.co/api/v2/berry/1/', (response) => {
    //     let data = ''
    //     response.on('data', chunk => {
    //         data += chunk
    //         console.log('On Data', chunk)
    //     })
    //
    //     response.on('end', () => {
    //         console.log('Response', data)
    //         console.log('API call done')
    //     })
    // })
    res.render('index')
})

module.exports = router
