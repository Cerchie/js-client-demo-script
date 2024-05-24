# js-client-demo-script

## Intro 

[Lucia on screen]
"Tabs or Spaces? merge or rebase? Vim or Emacs? These question have plagued developers for centuries! Ok, maybe not "centuries", [show_screen_recording_of_votes_here] but I decided to take the problem into my own hands and host a poll. You can cast your own vote at the link below. 

...I'm Lucia Cerchie at Confluent, and in this video, I'm going to tell you how I made this website. [switch back to Lucia on screen]

Here's my stack: on the frontend, I stuck with CSS, HTML, and mostly vanilla JavaScript so that anyone using a higher level framework would be able to translate the logic. 

[show screen recording of button click] When you click on a button in the frontend, [show slides of stack diagram] I collect the information about your vote via an Express.js route. Then, I retrieve the current state of the vote count from a Kafka topic with a Kafka consumer and update it with that information, using a Kafka producer to send the new message containing that information to the topic. Then I create a second Kafka consumer that fires the new vote count to a websocket every time a message comes in.  

My frontend is listening to that websocket, and it updates the progress bar with the information. This is all hosted on AWS." 

## Step 1: Sending information to the Express route

```javascript
          $.post(
            `/send-to-kafka-topic`,
            {
              data: {
          [1]      vote: VoteBtns[i].innerHTML,
          [2]      question_id: VoteBtns[i].parentElement.id,
          [3]     ts: new Date(),
              },
            },
            function (data) {
              console.log("data being produced by click", data);
            },
          );
```

Lucia: "Let's review the code I wrote to make this all happen. It starts with a POST request to my express route. I've attached an event listener to my buttons that fires this request on click. The data, including information about the vote [1], the name of the question, [2] and the timestamp [3] is sent to my route."

## Step 2: The Express route

```javascript
app.post("/send-to-kafka-topic", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  [1] var data = await req.body;

  [2] res.json(data);

  [3] sendMessage(data).catch(console.error)
  next;
});
```

Lucia: "In my express route, I'm [1] fetching the data from the request body, [2] transforming it to JSON, and [3] passing it to the `sendMessage` function." 

## Step 3: getting the current state

```javascript
  consumer.on('data', function(message) {
    [1] voteState = JSON.parse(message.value.toString())
        const commitOffset = message.offset;
    [2] consumer.commit({ topic: message.topic, partition: message.partition, offset: commitOffset });
})
```
Lucia: "Here, I'm [1] creating a variable to hold the `voteState`, and [2] manually committing the message so I can pick up from the very last message when my consumer restarts. 

## Step 4: sendMessage

```javascript

async function sendMessage(data) {
  [1] let question_id_string = `${data.data.question_id}`
  [2] let vote = data.data.vote

  [3] voteState[question_id_string][vote] = voteState[question_id_string][vote] + 1;
  [4] Object.entries(voteState).forEach(voteObj => voteObj[1].lastClicked = false)

  [5] voteState[question_id_string]['lastClicked'] = true;

  [6] producer.produce("total_count", 0, Buffer.from(JSON.stringify(voteState)))

}
```

Lucia: "Inside `sendMessage`, I parse out the [1] question_id_string and [2] vote, [3] update the current count kept in the "decoded" variable, while [4][5] updating the state of the buttons as well."





