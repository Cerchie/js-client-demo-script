       socket.on("event", function (message) {

         progress_bar_id = `${message.message.question_id}`;

         let progressBar = document.getElementById(
          `${progress_bar_id}-progress`,
        );

         let labelForBar = document.getElementById(`${progress_bar_id}-label`);

        //if length is one then ignore as result of retraction in potential FlinkSQL developments in later versions
        if (Object.keys(message.message.count).length == 1) {
          //don't do anything
         } else if (
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
        } else if (
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
         } else {
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
