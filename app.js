// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };

// Define constant links to document components
//	text
const textClientIP = document.querySelector("#textClientIP")
const textHostIP = document.querySelector("#textHostIP")
//	action buttons
const buttonConnect = document.querySelector("#buttonConnect")
const buttonDisconnect = document.querySelector("#buttonDisconnect")
const buttonSnapshot = document.querySelector("#buttonSnapshot")
//	views
const blockLoading = document.querySelector("#loadingBlock")
const blockCamera = document.querySelector("#cameraBlock")
const cameraView = document.querySelector("#cameraVideo")
const cameraOutput = document.querySelector("#cameraOutput")
const cameraSensor = document.querySelector("#cameraCanvas")

//used to initialize the webpage's entry state
function initialize() 
{
        console.debug("Initializing...");
	
	//set default view state
	blockLoading.style.display = "none";
	blockCamera.style.display = "none";
	
	console.debug("Initialization complete");
}
// Access the device camera and stream to cameraView
function cameraStart() 
{
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) 
	{
        console.error("Oops. Something is broken.", error);
    });
}

//attempts a connection to the device's camera
buttonConnect.onclick = function() 
{
	if(camera.style.display === "none")
	{
        	console.debug("Attempting connection...");
		
		blockLoading.style.display = "block";
		blockCamera.style.display = "none";
	}
}
//called when a connection has successfully been made and streaming has begun
function successfulConnection() 
{
	console.debug("Connection established");
	
	blockLoading.style.display = "none";
	blockCamera.style.display = "block";
}

//ends any pending or existing connection
buttonDisconnect.onclick = function()
{
	console.debug("Connection closed");
	
	blockLoading.style.display = "none";
	blockCamera.style.display = "none";
}

// Take a picture when picture button is tapped
buttonSnapshot.onclick = function() 
{
	console.debug("Taking snapshot...");
	
	cameraSensor.width = cameraView.videoWidth;
	cameraSensor.height = cameraView.videoHeight;
	cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
	cameraOutput.src = cameraSensor.toDataURL("image/webp");
	cameraOutput.classList.add("taken");
	
	console.debug("Snapshot saved");
};

//sets initializer to activate when the webpage loads
window.addEventListener("load", initialize, false);
