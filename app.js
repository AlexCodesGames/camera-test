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
//	connection
var xhr;
var rtcConnection;

//used to initialize the webpage's entry state
function initialize() 
{
        console.debug("initializing...");
	
	//set default view state
	blockLoading.style.display = "none";
	blockCamera.style.display = "none";
	
	textHostIP.innerHTML = "disconnected";
	
	console.debug("initialization complete");
}
// Access the device camera and stream to cameraView
function cameraStart() 
{
	console.debug("beginning camera stream...");
	
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function(stream) { track = stream.getTracks()[0]; cameraView.srcObject = stream; })
		.catch(function(error) 
		{
			console.error("Oops. Something is broken.", error);
		});
	console.debug("camera stream started");
}

//attempts a connection to the device's camera
function connectionAttempt()
{
	if(blockCamera.style.display === "none")
	{
        	console.debug("attempting connection...");
		
		blockLoading.style.display = "block";
		blockCamera.style.display = "none";
		
		//create a connection request
		xhr = new XMLHttpRequest();
		xhr.open('GET', "./CONNECT-"+textClientIP.innerHTML, true);
		xhr.send();
		
		xhr.addEventListener("readystatechange", connectionProcess, false);
	}
	else
	{
        	console.debug("connection already established");
	}
}
//processes returning connection details
function connectionProcess(e)
{
	//check ready-state change type and success
	if(xhr.readyState == 4 && xhr.status == 200)
   	{
		//record host ip
		textHostIP.innerHTML = xhr.responseText;
		
		//send call to start streaming
		xhr = new XMLHttpRequest();
		xhr.open('GET', "./START", true);
		xhr.send();
		
		xhr.addEventListener("readystatechange", connectionSuccessful, false);
   	}
	//if ready-state is finished but failed to aquire, disconnect
	else if(xhr.readyState == 4)
	{
		connectionDisconnect();
	}
}
//called when a connection has successfully been made and streaming has begun
function connectionSuccessful() 
{
	console.debug("connection established");
	
	blockLoading.style.display = "none";
	blockCamera.style.display = "block";
}
//ends any pending or existing connection
function connectionDisconnect()
{
	console.debug("connection closed");
	
	blockLoading.style.display = "none";
	blockCamera.style.display = "none";
	
	textHostIP.innerHTML = "disconnected";
}

//set up button functionality
buttonDisconnect.onclick = function() { connectionDisconnect() };
buttonConnect.onclick = function() { connectionAttempt() };
// Take a picture when picture button is tapped
buttonSnapshot.onclick = function() 
{
	console.debug("taking snapshot...");
	
	cameraSensor.width = cameraView.videoWidth;
	cameraSensor.height = cameraView.videoHeight;
	cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
	cameraOutput.src = cameraSensor.toDataURL("image/webp");
	cameraOutput.classList.add("taken");
	
	console.debug("snapshot saved");
};

//sets initializer to activate when the webpage loads
window.addEventListener("load", initialize, false);
