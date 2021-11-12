const mqtt = require('mqtt');
var client = mqtt.connect('mqtt://13.235.31.232');

const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url =
  'mongodb+srv://subra1312:wjqrtw3s9itt@cluster0.shbbi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbclient = new MongoClient(url);
const dbName = 'myFirstDatabase';

client.on('connect', async function () {
  await dbclient.connect();
  console.log('Connected successfully to server');
  client.subscribe('sensor/machine2');
  console.log('succesfull subscription');
});
client.on('message', async function (topic, message) {
  a = message.toString();
  b = parseFloat(a);
  date = new Date(b);
  console.log(b, a);
  const db = dbclient.db(dbName);
  const collection = db.collection('users');
  const found = await collection
    .find({
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getYear(),
      hour: date.getHours(),
      machine: 2,
    })
    .toArray();
  console.log('i found', found);
  if (found.length) {
    const updateResult = await collection.updateMany(
      {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getYear(),
        hour: date.getHours(),
        machine: 2,
      },
      { $inc: { mins: 0.5 } }
    );
    console.log('updated documents =>', updateResult);
  } else {
    const insertResult = await collection.insertMany([
      {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getYear(),
        hour: date.getHours(),
        mins: 1,
        machine: 2,
      },
    ]);
    console.log('Inserted documents m2=>', insertResult);
  }
});
