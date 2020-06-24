const Koa = require("koa");
const assert = require("assert");
const client = require("./db");

const app = new Koa();
// Database Name
const dbName = "DouBanMovies";

const findDoc = (page) => {
  return new Promise(async (resolve, reject) => {
    client.connect(async (err) => {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection("Top250");
      // Find some documents
      let docs = await collection
        .find({})
        .skip((page - 1) * 25)
        .limit(25)
        .toArray();
      resolve(docs);
    });
  });
};

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  console.log(ctx.url.split("/")[3]);
  // Use connect method to connect to the Server
  const docs = await findDoc(ctx.url.split("/")[3]);
  ctx.body = { status: "success", data: docs };
});

app.listen("3003");
