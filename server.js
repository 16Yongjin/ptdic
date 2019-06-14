const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./routes')
const PORT = process.env.PORT || 3000

app.use(cors())
app.use('/', router)
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
