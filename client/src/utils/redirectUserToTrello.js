import axios from "axios";

const redirectUserToTrello = url => {
  console.log(" redirectUserToTrello"+url)
  if (url) {
    // Apply authorization token to every request if logged in
      window.location = `${url}`;
  } else {
    // Delete auth header
  }
};

export default redirectUserToTrello;

