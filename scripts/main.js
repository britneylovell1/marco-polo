// TODO:
// Figure out how to sign the user out. Should I remove the user completely?
// Send the link to second person via node mailer (include: userId for first person)

// Flow:
// 1. modal pops up: Are you Marco or are you Polo?
// 2. if marco
//   2a. marco is saved in db and assigned a userId (and an access code)
//   2b. find current location of marco
//   2c. send text/email to polo with marco's userId, and link to site attached to it
// 3. if polo
//   3a. enter access code that links polo to marco
//     if access code does not exist, prompt user to try again or sign in as Marco
//   3b. calculate directions from marco to polo
//   3c. when marco and polo are within approx. 10ft of each other, then alert success! and delete that session



'use strict';

// Initializes MarcoPolo.
function MarcoPolo() {
  this.checkSetup();
  this.initFirebase();
  this.signIn();
  
}



// Sets up shortcuts to Firebase features and initiate firebase auth.
MarcoPolo.prototype.initFirebase = function() {

  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-in Friendly Chat.
MarcoPolo.prototype.signIn = function() {
  console.log('signed in');
  var dialog = document.querySelector('dialog');
  var showDialogButton = document.querySelector('body');
  // Polyfill required for browsers !== Chrome
  // if (! dialog.showModal) {
  //   dialogPolyfill.registerDialog(dialog);
  // }
  showDialogButton.addEventListener('click', function() {
    dialog.showModal();
  });

  // dialog.showModal();

  // document.getElementById('welcome').showModal();

  // Sign in Firebase anonymously
  // firebase.auth().signInAnonymously()

  //   // Error handler
  //   .catch(function(error) {
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     alert(errorCode, '\nUh-oh!\nSomething went wrong! ', errorMessage)
  //   });
};

// Signs-out of Friendly Chat.
MarcoPolo.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
MarcoPolo.prototype.onAuthStateChanged = function(user) {
  console.log(user)
  if (user) { // User is signed in!
    var userData = {
      userId: null,
      long: null,
      lat: null
    }

    // grab the user's current location using geolocation
      // place a marker on the map
    this.getLocation()

    // check to see if there is another user signed in 
      // if another user is logged in calculate directions
      // else invite another user
    

    // Should I log the user out in here?
  } else { // User is signed out!
    // Sign the user in
    firebase.auth().signInAnonymously()
   
  }
};

MarcoPolo.prototype.getLocation = function() {
  // ask for user permission 

  // get current position
  if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        function(position) {
          youFoundMe(user, marker, position);
        }, 

        function() {
          handleLocationError(true, marker, map.getCenter());
      });

  } else {

      handleLocationError(false, marker, map.getCenter());

  }

}

MarcoPolo.prototype.watchLocation = function() {
  // update marker on map according to the moving current location 
  if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          function(position) {
              youFoundMe(user, marker, position);
          }, 

          function() {
              handleLocationError(true, marker, map.getCenter());
        });
    } else {

        handleLocationError(false, marker, map.getCenter());

    }

}

MarcoPolo.prototype.calculateDirection = function() {
  // calculate and display directions between two points 
  var marco;
  var polo;

  // Grab marco and polo from firebase
  firebase.database().ref('users/').limitToFirst(2).once('value', function(snapshot) {

      var userArray = [];
      snapshot.forEach(function(user) {
          userArray.push(user.val());
      });

      if (userArray.length === 1) {
          return;
      }

      marco = userArray[0].coordinates;
      polo = userArray[1].coordinates;

  });

  // Don't get directions if there isn't a second person
  if (!polo) {
      return;
  }
  console.log('calculating')

  directionsService.route({
          origin: marco,
          destination: polo,
          travelMode: 'WALKING'
      },

      function(response, status) {
          if (status === 'OK') {
              directionsDisplay.setDirections(response);
          } else {
              window.alert('Directions request failed due to ' + status);
          }
  });

}


// Checks that the Firebase SDK has been correctly setup and configured.
MarcoPolo.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};

// Geolocation success/error handlers
function youFoundMe(user, marker, position) {
    // console.log('user ', user)

    var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

    // Set marker on map
    // marker.setPosition(pos);
    // map.setCenter(pos);

    // Update user's address in firebase
    firebase.database().ref('users/' + user).update({
        coordinates: pos
    });
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function handleLocationError(browserHasGeolocation, marker, pos) {

    // Set marker on default position on map
    // var marker = new google.maps.Marker({
    //         position: pos,
    //         map: map,
    //         content: browserHasGeolocation ?
    //             'Error: The Geolocation service failed.' :
    //             'Error: Your browser doesn\'t support geolocation.'
    //       });

    marker.setPosition(pos);
    // marker.setContent(browserHasGeolocation ?
    //         'Error: The Geolocation service failed.' :
    //         'Error: Your browser doesn\'t support geolocation.');
}

window.onload = function() {
  window.marcoPolo = new MarcoPolo();
};
