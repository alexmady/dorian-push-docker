const express = require("express");
const port = 80;
const app = express();
const path = require("path");
const publicDir = path.join(__dirname, "public");
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: '1048997',
    key: 'e2bbfffc0a96b48eb301',
    secret: '4924cbb738e5d93ffc79',
    cluster: 'eu',
    useTLS: true
});

const uri = "mongodb+srv://alex:3BKgpRdJdiE6Aus@cluster0.9eaox.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function monitorListingsUsingEventEmitter (client, pipeline = []) {
    console.log('monitorListingsUsingEventEmitter... ');
    const collection = client.db("test").collection("notes");
    const changeStream = collection.watch(pipeline);
    changeStream.on('change', (next) => {
        console.log(next);
        pusher.trigger('private-my-channel', 'my-event', { "message": "hello world private" });
    });
}

async function run () {

    console.log('trying to connect to mongo client...');
    await client.connect()
        .then(() => {
            console.log('CONNECTED TO MONGODB');
        })
        .catch((err) => {
            console.log(err);
        })

    monitorListingsUsingEventEmitter(client)
}

console.log('calling run function.... ');

run()

app.use(express.static(publicDir));


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
