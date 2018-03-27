chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.message == "addChannel"){

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/channel", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({name: request.newChannel, count: 0, list: []}));
    xhr.onreadystatechange = function(){

        if(xhr.readyState == 4){
          sendResponse({newChannel: request.newChannel});
          return true;
      }
    };
    return true;
  }

  else if(request.message == "addUrl"){

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/url", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      xhr.send(JSON.stringify({channel: request.channel, text: request.text, url: tabs[0].url}));
      //console.log('Sent');
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          //console.log('Complete');
          sendResponse({url: tabs[0].url, text: request.text});
          return true;
        }
      };
    });
    return true;
  }

  else if(request.message == "getData"){
    var xhr= new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/", true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200)
      {
        sendResponse({channel_list: xhr.response});
        return true;
      }
    };
    return true;
  }

  else if(request.message == "openUrl"){
    chrome.tabs.create({url: request.url},function(){
        //console.log("tab created");
    });
  }

  else if(request.message == "deleteUrl"){
    var xhr = new XMLHttpRequest();

    xhr.open("DELETE","http://localhost:3000/url", true);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(JSON.stringify({url: request.url, text: request.text, name: request.name}));
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        sendResponse({url: request.url, text: request.text, name: request.name});
        return true;
      }
    };
    return true;
  }

  else if(request.message == "getUrl"){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      sendResponse({url: tabs[0].url});
      return true;
    });
    return true;
  }

});
