const Koa = require("koa");
const assert = require("assert");
const client = require("./db");

const app = new Koa();
// Database Name
const dbName = "DouBanMovies";

const findDoc = () => {
  return new Promise((resolve, reject) => {
    client.connect(async (err) => {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection("Top250");
      // Find some documents
      await collection.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        console.log("Found the following records");
        resolve(docs);
      });
    });
  });
};

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  // Use connect method to connect to the Server
  const docs = await findDoc();
  ctx.body = { status: "success", data: docs };
});

app.listen("3003");
