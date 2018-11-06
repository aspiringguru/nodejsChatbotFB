var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var dbFileName = 'datastore.db'
if (fs.existsSync(dbFileName)) {
  console.log("database file already exists.")
}
var db = new sqlite3.Database(dbFileName, (err) => {
//var db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
    process.exit();
    //not best option?
  }
  console.log('Connected to the SQlite database.');
});

//rewrite using this technique.
//https://stackoverflow.com/questions/25663842/node-js-script-with-synchronous-sqlite3-call

db.serialize(function () {
  console.log("creating table.");
  db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT, datetime TEXT)')
  console.log("table created.");
  db.each('SELECT count(*) AS count FROM lorem', function (err, row) {
    console.log("count:", row.count)
  })
  var stmt = db.prepare("INSERT INTO lorem VALUES (?, ?)")
  var d = new Date().toISOString();
  console.log("inserting data.")
  for (var i = 0; i < 10; i++) {
    console.log("i=", i, ", d=", d);
    stmt.run('Ipsum ' + i, d)
  }

  stmt.finalize()
  console.log("rows inserted & finalised.")

  db.each('SELECT rowid AS id, info, datetime FROM lorem', function (err, row) {
    console.log(row.id + ': ' + row.info + ", " + row.datetime)
  })
  db.each('SELECT count(*) AS count FROM lorem', function (err, row) {
    console.log("count:", row.count)
  })
})

db.close()
