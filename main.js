var seconds = 30;
var numberOfErrors = 0;
var timer;
var takeInput = true;
var numberOfWords = 0;
var lettersTyped = 0;
async function loadQuote() {
  document.getElementById("landingInfo").classList.add("hidden");
  document.getElementById("test").classList.remove("hidden");
  document.getElementById("test").classList.remove("hidden");
  // Fetch a random paragraph from the paragraph API
  const response = await fetch("https://corsproxy.io/?url=http://metaphorpsum.com/paragraphs/1/20");
  console.log(response);
  let data = await response.text();
  if (response.ok) {
    console.log(data);
    data = data.substring(0, data.length - 1);
    document.getElementById("testPara").classList.add("hidden");
    data.split(' ').forEach(word => {
      var wordEl = document.createElement("span");
      word.split('').forEach(letter => {
        var letterEl = document.createElement("div");
        letterEl.classList.add("char");
        letterEl.innerHTML = letter;
        wordEl.appendChild(letterEl);
      });
      var spaceEl = document.createElement("div");
      spaceEl.classList.add("char");
      spaceEl.classList.add("space");
      spaceEl.innerHTML = "&nbsp";
      wordEl.appendChild(spaceEl);
      document.getElementById("text").appendChild(wordEl);
    });
    startTest(data);

  } else {
    alert("An API error occurred, please reload")
  }
}
// loadQuote();
function startTest(text) {
  var started = false;
  document.getElementById("info").classList.remove("hidden");
  document.getElementById("timer").classList.remove("hidden");
  var i = 0;
  var chars = [];
  text.split('').forEach(char => {
    chars.push(char);
  });
  document.getElementById("text").getElementsByTagName("div")[0].classList.add("zoom");
  document.addEventListener('keydown', function (event) {
    console.log(event);
    const modifierKeys = ['Control', 'Shift', 'Alt'];

    if (modifierKeys.includes(event.key) || !takeInput) {
      return;
    }
    event.preventDefault();
    console.log(chars[i]);
    if (event.key == chars[i]) {
      lettersTyped++;
      if (chars[i] == " ") {
        numberOfWords++;
      }
      if (!started) {
        document.getElementById("info").classList.add("hidden");
        timer = setInterval(updateTimer, 1000);
      }
      started = true;
      console.log("true",);
      document.getElementById("text").getElementsByTagName("div")[i].classList.remove("error");
      document.getElementById("text").getElementsByTagName("div")[i].classList.remove("zoom");
      document.getElementById("text").getElementsByTagName("div")[i].classList.add("typed");
      i++;
      document.getElementById("text").getElementsByTagName("div")[i].classList.add("zoom");
      document.getElementById("text").getElementsByTagName("div")[i + 1].scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      document.getElementById("text").getElementsByTagName("div")[i].classList.add("error");
      numberOfErrors++;
      setTimeout(function () {
        document.getElementById("text").getElementsByTagName("div")[i].classList.remove("error");
      }, 1000);
    }
  });
}
function showResults() {
  var history = [];
  history = localStorage.getItem("history") != null ? JSON.parse(localStorage.getItem("history")) : [];
  console.log(history);
  var newRecord = { "time": Date.now(), "wpm": numberOfWords * 2, "letterTyped": lettersTyped, "errors": numberOfErrors };
  history.push(newRecord);
  localStorage.setItem("history", JSON.stringify(history));
  history.sort((a, b) => a.wpm - b.wpm).reverse();

  history.forEach(record => {
    var tr = document.createElement("tr");
    var wpm = document.createElement("td");
    var date = document.createElement("td");
    var errors = document.createElement("td");
    const formatted = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(record.date);
    date.textContent = formatted;
    wpm.textContent = record.wpm;
    errors.textContent = record.errors;
    tr.appendChild(wpm);
    tr.appendChild(date);
    tr.appendChild(errors);
    document.getElementById("recordsTable").appendChild(tr);
  });
  document.getElementById("results").classList.remove("hidden");
  document.getElementById("timerText").classList.add("hidden");
  document.getElementById("timer").classList.add("modal");
  console.log(numberOfWords);
  document.getElementById("resultWPMText").innerText = numberOfWords * 2;
  document.getElementById("resultsWords").innerText = lettersTyped;
  document.getElementById("resultErrorsText").innerText = numberOfErrors;
}
function updateTimer() {
  seconds = seconds - 1;
  if (seconds < 10) {
    document.getElementById("timer").classList.add("lessTime");
  }
  console.log(seconds);
  if (seconds == -1) {
    clearInterval(timer);
    takeInput = false;
    document.getElementById("timer").classList.remove("lessTime");
    showResults()
    return;
  }
  document.getElementById("timerText").innerText = seconds;
}