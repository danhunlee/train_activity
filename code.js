// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the nextArrival time. Using difference between start, current time and frequency of the train arrivals.

// 1. Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAmAQGMUkwvWN07opVgkY2joeBRzX2bQrk",
  authDomain: "trainproject-3b48b.firebaseapp.com",
  databaseURL: "https://trainproject-3b48b.firebaseio.com",
  projectId: "trainproject-3b48b",
  storageBucket: "trainproject-3b48b.appspot.com",
  messagingSenderId: "850041354585",
  appId: "1:850041354585:web:b3e7d1a0ec5fa57f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
  var database = firebase.database();
  
  // 2. Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = $("#start-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      trainStart: trainStart,
      frequency: frequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.trainStart);
    console.log(newTrain.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().trainStart;
    var frequency = childSnapshot.val().frequency;
  
    // train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStart);
    console.log(frequency);
  
    var firsttimeMoment = moment(trainStart, "HH:mm");
    console.log("TIME CONVERTED: " + firsttimeMoment);
    
    // It is Now - moment
    var currenttime = moment();
    console.log("Now TIME: " + currenttime);

    var minuteArrival = currenttime.diff(firsttimeMoment, 'minutes');
    var minuteLast = minuteArrival % frequency;
    var awayTrain = frequency - minuteLast;

    console.log("Minutes: " + minuteArrival);
    console.log("Minutes Last: " + minuteLast);
    console.log("Away Train: " + awayTrain);

    var nextArrival = currenttime.add(awayTrain, 'minutes');
    var arrivaltime = nextArrival.format("HH:mm");
    console.log("Away Arrival: " + nextArrival);
    console.log("Arrival Time: " + arrivaltime);

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(frequency),
      $("<td>").text(arrivaltime),
      $("<td>").text(awayTrain),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  