          $.post(
            `/send-to-kafka-topic`,
            {
              data: {
                vote: VoteBtns[i].innerHTML,
                question_id: VoteBtns[i].parentElement.id,
                ts: new Date(),
              },
            },
            function (data) {
              console.log("data being produced by click", data);
            },
          );
