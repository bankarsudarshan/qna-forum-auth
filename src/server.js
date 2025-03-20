const express = require('express')
const { PORT } = require('./config/server-config');
const apiRoutes = require('./routes')
const router = express.Router();

const app = express();
// /api/v1/users

const prepareAndStartServer = () => {
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    router.use('/api', apiRoutes);

    app.listen(PORT, () => {
        console.log(`Server up and running on ${PORT}`);
    });
}

prepareAndStartServer();