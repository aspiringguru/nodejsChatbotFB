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


db.serialize(function () {
  console.log("creating table.");
  db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)')
  console.log("table created.");
  db.each('SELECT count(*) AS count FROM lorem', function (err, row) {
    console.log("count:", row.count)
  })
  var stmt = db.prepare('INSERT INTO lorem VALUES (?)')
  console.log("inserting data.")
  for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i)
  }

  stmt.finalize()
  console.log("rows inserted & finalised.")

  db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    console.log(row.id + ': ' + row.info)
  })
  db.each('SELECT count(*) AS count FROM lorem', function (err, row) {
    console.log("count:", row.count)
  })
})

db.close()
