function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

var app = angular.module("channels_list",[]);
app.controller("myCtrl", function($scope) {
  $scope.channel_list = [];
  $scope.current = '';
  $scope.url = '';
  $scope.heading = 'Available Channels';
  $scope.showList = function(value){
    $scope.current = value;
    $scope.heading = 'Open Channel';

    var textarea = document.getElementById("entry");
    textarea.onfocus = function() {
    moveCaretToEnd(textarea);

    window.setTimeout(function() {
        moveCaretToEnd(textarea);
    }, 1);
};
  };//Marks the chosen channel as current and shows list of urls

  $scope.hideList = function(value){
    $scope.current = '';
    $scope.heading = 'Available Channels';
  };//For hiding the list of urls in given channel

  $scope.addChannel = function(){
    if($scope.newChannel){

      chrome.runtime.sendMessage({message: "addChannel", newChannel: $scope.newChannel}, function(response){

        $scope.channel_list.push({name: response.newChannel, count: 0, list: []});
        document.getElementById("newChannel").value = '';
        $scope.$applyAsync();

      });
    }
  }//End of addChannel()

  $scope.addWebsite = function(value){

    if(this.siteText){

      var ind = this.siteText.indexOf('|');
      var text = this.siteText.substring(ind+1);

      chrome.runtime.sendMessage({message: "addUrl", channel: value, text: text}, function(response){

        var index = $scope.channel_list.map(function(e){return e.name;}).indexOf($scope.current);
        $scope.channel_list[index].list.push({url:response.url, text:response.text});
        $scope.channel_list[index].count++;
        document.getElementById("entry").value = '';
        $scope.$applyAsync();
      });
    }
  };//End of addwebsite

  $scope.deleteUrl = function(obj){
    chrome.runtime.sendMessage({message: "deleteUrl", url: obj.url, text: obj.text, name: $scope.current}, function(response){
      var index = $scope.channel_list.map(function(e) {return e.name;}).indexOf($scope.current);
      var url_index = $scope.channel_list[index].list.map(function(e) {return e.url;}).indexOf(obj.url);
      $scope.channel_list[index].list.splice(url_index, 1);
      $scope.channel_list[index].count--;
      $scope.$applyAsync();
    });
  };//End of deleteUrl function

  $scope.onLoad = function(){

    chrome.runtime.sendMessage({message: "getData"},function(response){
      for(var i = 0; i < response.channel_list.length; i++){
        $scope.channel_list.push(response.channel_list[i]);
      }
    chrome.runtime.sendMessage({message: "getUrl"}, function(response){
      $scope.url = response.url;
      //console.log($scope.url);
      $scope.siteText = $scope.url;
      $scope.siteText = $scope.siteText + '|';
    });

      $scope.$applyAsync();
    });
  };//When page loads

  $scope.openTab = function(clicked_url){

    chrome.runtime.sendMessage({url:clicked_url, message: "openUrl"},function(response){
      //console.log('Opened tab');
    });
  };//When a tab is opened

});
