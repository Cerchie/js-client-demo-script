      [1] socket.on("event", function (message) {

        [2] progress_bar_id = `${message.message.question_id}`;

        [3] let progressBar = document.getElementById(
          `${progress_bar_id}-progress`,
        );

        [4] let labelForBar = document.getElementById(`${progress_bar_id}-label`);
         let max = Object.values(message.message.count)[0] + Object.values(message.message.count)[1];
        //if length is one then ignore as result of retraction in potential FlinkSQL developments in later versions
        if (Object.keys(message.message.count).length == 1) {
          //don't do anything
       [5] } else if (
          Object.values(message.message.count)[0] >
          Object.values(message.message.count)[1]
        ) {
          value = Object.values(message.message.count)[0];
         [a] labelForBar.innerHTML = `${Object.keys(message.message.count)[0]} wins  with ${Object.values(message.message.count)[0]} votes out of ${max}`;
        [6] } else if (
          Object.values(message.message.count)[0] ===
          Object.values(message.message.count)[1]
        ) {
          value = Object.values(message.message.count)[0];
         [a] labelForBar.innerHTML = `It's a tie! There were ${max} total votes`;
       [7] } else {
          value = Object.values(message.message.count)[1];
         [a] labelForBar.innerHTML = `${Object.keys(message.message.count)[1]} wins  with ${Object.values(message.message.count)[1]} votes out of ${max}`;
        }
       [a] progressBar.setAttribute("value", value);
       [a] progressBar.setAttribute("max", max);
        if (clicked === true)
       { showProgressBar(progress_bar_id);
        clicked = false;
       }
      });
