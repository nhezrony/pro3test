const plot = require('../plotly')
const bodyParser = require('body-parser')




module.exports = (app) => {

    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(bodyParser.json())

    app.get('/symbol/:id', async (req, res) => {})
    app.post('/symbol/:id', async (req, res) => {
        const graphUrls = await plot.links(req.params.id)
        console.log(graphUrls)
        res.json(graphUrls)
    })
}