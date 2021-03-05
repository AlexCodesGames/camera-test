// Define constant links to document components
//	text
const textFeedback = document.querySelector("#textFeedback")
const textFeedback = document.querySelector("#textFeedback")
const buttonPassword = document.querySelector("#buttonPassword")
//	connection
var xhr;
var rtcConnection;
//
var isPending = false;

//used to initialize the webpage's entry state
function initialize() 
{
  console.debug("initializing...");
	
  textFeedback.innerHTML = "Enter Password";

  console.debug("initialization complete");
}

//attempts a connection to the doorbell to login
function connectionAttempt()
{
	console.debug("sending login details...");		

	//create a connection request
	xhr = new XMLHttpRequest();
	xhr.open('GET', "./PASSWORD-"+buttonPassword.innerHTML, true);
	xhr.send();

	isPending = true;
	
	//add listener for response
	xhr.addEventListener("readystatechange", connectionProcess, false);
	//set timeout for no response
	setTimeout(connectionTimeout, 4000);
}
//if there is a connection attempt pending but it times out
function connectionTimeout()
{
	if(isPending == true)
	{
		textHostIP.innerHTML = "Response Timedout";
		isPending = false
	}
}
//processes returning connection details
function connectionProcess(e)
{
	//check ready-state change type and success
	if(xhr.readyState == 4 && xhr.status == 200)
	{
		console.debug("login response received");
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
//set up button functionality
buttonPassword.onclick = function() { connectionAttempt() };

//sets initializer to activate when the webpage loads
window.addEventListener("load", initialize, false);
