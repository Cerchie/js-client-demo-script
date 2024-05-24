  await consumer.run({
    eachMessage: async ({topic, partition, message }) => {

       total_count = JSON.parse(message.value.toString())

       const messageFiltered = Object.entries(total_count).filter((vote) => vote[1].lastClicked === true)

       question_id = messageFiltered[0][0]
       count = messageFiltered[0][1]

       io.sockets.emit("event", {
        message: { question_id, count },
      });
    }
  });
}
