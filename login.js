// Define constant links to document components
//	text
const blockHead = document.querySelector("#HEAD")
const blockBody = document.querySelector("#BODY")
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
	xhr.open('GET', "./-IP:"+textClientIP.innerHTML+"-PASSWORD:"+inputPassword.value, true);
 	xhr.setRequestHeader("Cache-Control", "no-store");
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
		console.debug("login response received - ACCEPTED");
		HEAD.innerHTML = xhr.response;
	}
	//if ready-state is finished but failed to aquire, disconnect
	else if(xhr.readyState == 4 && xhr.status == 406)
	{
		console.debug("login response received - DENIED");
		textFeedback.innerHTML = "Invalid Password";
	}
	//if ready-state is finished but failed to aquire, disconnect
	else if(xhr.readyState == 4)
	{
		console.debug("login response request failed - timeout");
		textFeedback.innerHTML = "Response Timedout";
	}
}
//set up button functionality
buttonPassword.onclick = function() { connectionAttempt() };

//sets initializer to activate when the webpage loads
window.addEventListener("load", initialize, false);
