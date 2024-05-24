  consumer.on('data', function(message) {
     voteState = JSON.parse(message.value.toString())
        const commitOffset = message.offset;
     consumer.commit({ topic: message.topic, partition: message.partition, offset: commitOffset });
})
