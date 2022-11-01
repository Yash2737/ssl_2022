const mongoose = require('mongoose');

(async () => {
    uri = `mongodb+srv://prabodham36369:Prabodham36@prabodham.owbqxe4.mongodb.net/SSL_2022_PROD?retryWrites=true&w=majority`
    mongoose.connect(uri, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => console.info(`Database Connected : Prabodham36 - SSL_2022_PROD`));
})();
