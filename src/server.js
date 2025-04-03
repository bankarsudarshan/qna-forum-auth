const express = require('express')
const { PORT } = require('./config/server-config');
const apiRoutes = require('./routes');
const app = express();
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3002", credentials: true }));


// /api/v1/users

const prepareAndStartServer = () => {
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', apiRoutes);

    app.listen(PORT, () => {
        console.log(`server up and running on ${PORT}`);
    });
}

prepareAndStartServer();