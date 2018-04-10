var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const url = 'https://api.mlab.com/api/1/databases/signins/collections/signins?apiKey=Vp2I1nmC961_lV2whDojmmOuZzXb0S_o&l=10000';

export function makeRequest(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener("load", callback);
  request.send();
}

export function requestComplete(){
  if (this.status !== 200) return;
  var jsonString = this.responseText;
  var myData = JSON.parse(jsonString);
  return myData
}
