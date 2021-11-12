const server = require('http').createServer();
const os = require('os-utils');

const { MongoClient } = require('mongodb');
var date;

// Connection URL
const url =
  'mongodb+srv://subra1312:wjqrtw3s9itt@cluster0.shbbi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbclient = new MongoClient(url);
const dbName = 'myFirstDatabase';

const io = require('socket.io')(server, {
  transports: ['websocket', 'polling'],
});
// 1. listen for socket connections
io.on('connection', async (socket) => {
  // await client.connect();
  await dbclient.connect();
  console.log('Connected to db');
  console.log('Connected successfully to server');
  const db = dbclient.db(dbName);
  const collection = db.collection('users');
  console.log('inn');
  //const filteredDocs = await collection.find({date:1,month:0,hour:1}).toArray();
  //console.log('Found documents filtered by { a: 3 } =>', filteredDocs.length);
  tick = 0;
  setInterval(async () => {
    var m = socket.on('times', (date) => {
      (this.date = date.date),
        (this.month = date.month),
        (this.year = date.year);
    });
    var time = Array(24).fill(0);
    const filteredDocs = await collection
      .find({ date: this.date, month: this.month, machine: 2 })
      .project({ mins: 1, hour: 1, _id: 0 })
      .toArray();
    await filteredDocs.map((ele) => {
      time[ele.hour - 1] = ele.mins;
      // console.log(ele);
    });
    tick = tick + 1;
    console.log(
      'Found documents filtered by  =>',
      filteredDocs.length,
      tick + 1,
      this.date,
      time
    );
    socket.emit('cpu', {
      value: time,
    });
  }, 500);
});

server.listen(8009);

// 2. every second, emit a 'cpu' event to user
// os.cpuUsage(cpuPercent => {
//   client.emit('cpu', {
//     name: tick++,
//     value: cpuPercent
//   });
