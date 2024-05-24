# js-client-demo-script

## Intro 

"Tabs or Spaces? merge or rebase? Vim or Emacs? These question have plagued developers for centuries! Ok, maybe not "centuries", but I decided to take the problem into my own hands and host a poll. You can cast your own vote at the link below. 

...I'm Lucia Cerchie at Confluent, and in this video, I'm going to tell you how I made this website. 

Here's my stack: on the frontend, I stuck with CSS, HTML, and mostly vanilla JavaScript to keep performance consideration at a minimum. 

When you click on a button in the frontend, I collect the information about your vote via an Express.js route. Then, I retrieve the current state of the vote count from a Kafka topic with a Kafka consumer and update it with that information, using a Kafka producer to send the new message containing that information to the topic. Then I create a second Kafka consumer that fires the new vote count to a websocket every time a message comes in. 

My frontend is listening to that websocket, and it updates the progress bar with the information." 
