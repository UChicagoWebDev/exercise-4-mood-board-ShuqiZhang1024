const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // Clear the results pane before you run a new search
  document.getElementById("resultsImageContainer").innerHTML = "";

  openResultsPane();

  // Build your query by combining the bing_api_endpoint and a query attribute
  // named 'q' that takes the value from the search bar input field.
  let searchInputValue = document.querySelector(".search input").value;
  let searchQuery = `${bing_api_endpoint}?q=${encodeURIComponent(searchInputValue)}`;

  let request = new XMLHttpRequest();

  // Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.open("GET", searchQuery);

  // Setting response type as JSON
  request.responseType = "json";

  // Handling the response
  request.onload = function() {
    let response = request.response;
    // Check if the response has results
    if (response.value && response.value.length > 0) {
      response.value.forEach((imageResult) => {
        let imgElem = document.createElement("img");
        imgElem.src = imageResult.thumbnailUrl;
        let divElem = document.createElement("div");
        divElem.className = "resultImage";
        divElem.appendChild(imgElem);

        // Adding event listener for image selection
        imgElem.addEventListener("click", function() {
          addToMoodBoard(imageResult.contentUrl);
        });

        document.getElementById("resultsImageContainer").appendChild(divElem);
      });
    }
  };

  // Adding headers
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  // Send the request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function addToMoodBoard(imageUrl) {
  let imgElem = document.createElement("img");
  imgElem.src = imageUrl;
  let divElem = document.createElement("div");
  divElem.className = "savedImage";
  divElem.appendChild(imgElem);
  document.getElementById("board").appendChild(divElem);
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});

document.querySelectorAll(".suggestion-item").forEach(item => {
  item.addEventListener("click", function() {
    let searchTerm = this.textContent;
    document.getElementById("searchInput").value = searchTerm;
    runSearch();
  });
});