// Define constant links to document components
//	text
const textFeedback = document.querySelector("#textFeedback")
const textClientIP = document.querySelector("#textClientIP")
const buttonPassword = document.querySelector("#buttonPassword")
const inputPassword = document.querySelector("#inputPassword")
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
	xhr.open('GET', "./IP:"+textClientIP.innerHTML+"-PASSWORD:"+inputPassword.value, true);
	xhr.send();

	isPending = true;
	
	//add listener for response
	xhr.addEventListener("readystatechange", connectionProcess, false);
}
//processes returning connection details
function connectionProcess(e)
{
	//check ready-state change type and success
	if(xhr.readyState == 4 && xhr.status == 200)
	{
		console.debug("login response received");
		//record host response to password
		textHostIP.innerHTML = xhr.responseText;
		
		//attempt to connect to main service
		xhr = new XMLHttpRequest();
		xhr.open('GET', "./START", true);
		xhr.send();
		
		xhr.addEventListener("readystatechange", connectionSuccessful, false);
	}
	//if ready-state is finished but failed to aquire, disconnect
	else if(xhr.readyState == 4)
	{
		textFeedback.innerHTML = "Response Timedout";
	}
}
//set up button functionality
buttonPassword.onclick = function() { connectionAttempt() };

//sets initializer to activate when the webpage loads
window.addEventListener("load", initialize, false);
