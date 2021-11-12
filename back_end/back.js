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
  (tick = 0), (sum = 0);
  setInterval(async () => {
    var m = socket.on('times', (date) => {
      (this.date = date.date),
        (this.month = date.month),
        (this.year = date.year),
        (this.edate = date.edate),
        (this.emonth = date.emonth),
        (this.eyear = date.eyear),
        (this.diff = date.diff);
    });
    var time = Array(24).fill(0),
      sum = 0;
    const filteredDocs = await collection
      .find({
        date: { $gte: this.date, $lte: this.edate },
        month: { $gte: this.month, $lte: this.emonth },
        machine: { $ne: 2 },
      })
      .project({ mins: 1, hour: 1, _id: 0 })
      .toArray();
    await filteredDocs.map((ele) => {
      time[ele.hour - 1] = time[ele.hour - 1] + ele.mins;
      // sum=sum+ele.mins/60;
      // console.log(ele);
    });
    if (this.diff) {
      time = await time.map((e) => {
        sum = sum + e / this.diff;
        return e / this.diff;
      });
    }
    const mdocs = await collection
      .aggregate([
        { $match: { month: this.month } },
        {
          $group: {
            _id: '$date',
            total: { $sum: '$mins' },
            count: { $sum: 1 },
          },
        },
        { $project: { total: { $divide: ['$total', 60] }, count: 1 } },
      ])
      .toArray();
    var mtime = Array(mdocs.length).fill(0);
    var msum = 0;
    await mdocs.map((e) => {
      mtime[e._id - 1] = e.total;
      msum = msum + e.total;
    });
    console.log(
      'Found documents filtered by  =>',
      this.date,
      'To ',
      this.edate,
      this.month,
      //mtime,
      //msum,
      time
    );
    const reducer = (previousValue, currentValue) => {
      previousValue + currentValue;
    };
    socket.emit('cpu', {
      value: time,
      sum: sum / 60,
      mon: mtime,
      mval: {
        mlen: mtime.length,
        mtol: msum,
      },
    });
  }, 1000);
});
server.listen(8008);
