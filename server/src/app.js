import express from "express"

import { router } from "./router/router"

const App = express()
App.use('/', router)
App.listen(3000);

console.log("server is listening on port 3000...")