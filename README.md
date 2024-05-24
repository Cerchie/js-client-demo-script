# js-client-demo-script

## Intro 

[Lucia on screen]
"Tabs or Spaces? merge or rebase? Vim or Emacs? These question have plagued developers for centuries! Ok, maybe not "centuries", [show_screen_recording_of_votes_here] but I decided to take the problem into my own hands and host a poll. You can cast your own vote at the link below. 

...I'm Lucia Cerchie at Confluent, and in this video, I'm going to tell you how I made this website. [switch back to Lucia on screen]

Here's my stack: on the frontend, I stuck with CSS, HTML, and mostly vanilla JavaScript so that anyone using a higher level framework would be able to translate the logic. 

[show screen recording of button click] When you click on a button in the frontend, [show slides of stack diagram] I collect the information about your vote via an Express.js route. Then, I retrieve the current state of the vote count from a Kafka topic with a Kafka consumer and update it with that information, using a Kafka producer to send the new message containing that information to the topic. Then I create a second Kafka consumer that fires the new vote count to a websocket every time a message comes in. To create the Kafka producer and consumer, I've used confluent-kafka-javascript, which as I record, is not in general availability but is in early access at the link below. 

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

## Step 5: the consumer 

```javascript
  await consumer.run({
    eachMessage: async ({topic, partition, message }) => {

      [1] total_count = JSON.parse(message.value.toString())

      [2] const messageFiltered = Object.entries(total_count).filter((vote) => vote[1].lastClicked === true)

      [3] question_id = messageFiltered[0][0]
      [4] count = messageFiltered[0][1]

      [5] io.sockets.emit("event", {
        message: { question_id, count },
      });
    }
  });
}
```

Lucia: "Now, in my Kafka consumer, I am parsing the incoming message which holds the vote state, [2] filtering for the last clicked message, creating variables to hold the current [3] question_id and [4] count, and [5] then sending the message to my websocket. You might notice that the syntax here is slightly different from the syntax in the first consumer. That's because this consumer uses the promisified API, versus the first consumer, which uses the API that avails itself of the features in node-rdkafka."

## Step 6: the user interface

```javascript
      [1] socket.on("event", function (message) {

        [2] progress_bar_id = `${message.message.question_id}`;

        [3] let progressBar = document.getElementById(
          `${progress_bar_id}-progress`,
        );

        [4] let labelForBar = document.getElementById(`${progress_bar_id}-label`);

        //if length is one then ignore as result of retraction in potential FlinkSQL developments in later versions
        if (Object.keys(message.message.count).length == 1) {
          //don't do anything
        [5] } else if (
          Object.values(message.message.count)[0] >
          Object.values(message.message.count)[1]
        ) {
          value = Object.values(message.message.count)[0];
          max =
            Object.values(message.message.count)[0] +
            Object.values(message.message.count)[1];
          progressBar.setAttribute("value", value);
          progressBar.setAttribute("max", max);
         [a] labelForBar.innerHTML = `${Object.keys(message.message.count)[0]} wins  with ${Object.values(message.message.count)[0]} votes out of ${max}`;
       [6] } else if (
          Object.values(message.message.count)[0] ===
          Object.values(message.message.count)[1]
        ) {
          value = Object.values(message.message.count)[0];
          max =
            Object.values(message.message.count)[0] +
            Object.values(message.message.count)[1];
          progressBar.setAttribute("value", value);
          progressBar.setAttribute("max", max);
         [b] labelForBar.innerHTML = `It's a tie! There were ${max} total votes`;
        [7] } else {
          value = Object.values(message.message.count)[1];
          max =
            Object.values(message.message.count)[0] +
            Object.values(message.message.count)[1];
          progressBar.setAttribute("value", value);
          progressBar.setAttribute("max", max);
         [c] labelForBar.innerHTML = `${Object.keys(message.message.count)[1]} wins  with ${Object.values(message.message.count)[1]} votes out of ${max}`;
        }
        showProgressBar(progress_bar_id);
      });
```
Lucia: "Here in the frontend, I'm writing some logic that triggers when the [1] socket receives an event. [2] Then I create a variable for the question_id, and [3] retrieve the DOM element corresponding to that id. 
[4] I retrieve the label for that bar as well, which I'll [a][b][c] update in the following chain of logic. Then, I check if the [5] left-hand option has more votes, [6] if there's been a tie, or if in the remaining case, [7], the right-hand side has more votes. I then update the DOM accordingly."

## Outro:

Lucia: "And that's pretty much it for the essential code. If you want to see the whole sample repository and get this running yourself, check out the links below. There's lots more to be done with this demo. Perhaps, instead of updating the state in the backend, I could do some processing and create an aggregation with FlinkSQL... or should I use Kafka Streams? [flash to screen recording of interface with the KStreams/FlinkSQL question] Or, what if you wanted to see what percentage of developers who voted for tabs also voted for rebase? What would we do if you wanted to be able to _change_ your vote? Or fingerprint the users so they couldn't cheat? I'll leave these features as a challenge for you, my dear viewers. Don't forget to like and subscribe. Until next time!" 

