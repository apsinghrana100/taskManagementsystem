const http = require('http');
const connection = require('./src/utils/connection');
const { error } = require('console');
const routingMangement = require('./src/router/routes');

const PORT = 5000;
let retryCount = 0;
const MAX_RETRIES = 5;

const server = http.createServer((req, res) => {

    routingMangement(req,res);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error('Address in use, retrying...');
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(() => {
                server.close();
                server.listen(PORT, () => {
                    console.log("Retrying connection...");
                });
            }, 1000);
        } else {
            console.error('Max retries reached. Exiting...');
            process.exit(1);
        }
    }
});


connection.connect((error,results)=>{
    if(error){
        console.log(`Database connection is not estabalsihed ${error}`)
        return;
    };
    console.log(results);
    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
})