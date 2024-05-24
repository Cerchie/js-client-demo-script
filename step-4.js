
async function sendMessage(data) {
   let question_id_string = `${data.data.question_id}`
   let vote = data.data.vote

   voteState[question_id_string][vote] = voteState[question_id_string][vote] + 1;
   Object.entries(voteState).forEach(voteObj => voteObj[1].lastClicked = false)

   voteState[question_id_string]['lastClicked'] = true;

   producer.produce("total_count", 0, Buffer.from(JSON.stringify(voteState)))

}
