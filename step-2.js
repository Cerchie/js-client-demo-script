app.post("/send-to-kafka-topic", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

   var data = await req.body;

   res.json(data);

   sendMessage(data).catch(console.error)
  next;
});
