/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function() {
  this.state = 'pending';
  this.value = null;
  this.handlerGroups = [];
}

$Promise.prototype.then = function(success, error){ 
  if(typeof success !== 'function') success = null;
  if(typeof error !== 'function') error = null;

  this.handlerGroups.push({
    successCb: success,
    errorCb: error,
    forwarder: defer()
  });

  this.execHandlerGroup();
  
  if (this.handlerGroups.length > 0) return this.handlerGroups[this.handlerGroups.length - 1].forwarder.$promise;
}

$Promise.prototype.catch = function (error) {
  return this.then(null, error);
}

$Promise.prototype.execHandlerGroup = function () {
  if(this.state === 'resolved'){
    if(this.handlerGroups[0].successCb !== null) {
      var result = this.handlerGroups[0].successCb(this.value);
      this.handlerGroups[0].forwarder.resolve(result);
      this.handlerGroups.shift();
    }
    else this.handlerGroups.shift().forwarder.resolve(this.value);
    
  }
  if(this.state === 'rejected'){
    if (this.handlerGroups[0].errorCb !== null) {
      var result = this.handlerGroups[0].errorCb(this.value);
      this.handlerGroups[0].forwarder.resolve(result);
      this.handlerGroups.shift();
    }
    else this.handlerGroups.shift().forwarder.reject(this.value);
  }
}


var Deferral = function() {
  this.$promise = new $Promise();
}

Deferral.prototype.resolve = function(dataObj){
  if(this.$promise.state === 'pending') {
    this.$promise.value = dataObj;
    this.$promise.state = 'resolved';

    while (this.$promise.handlerGroups.length > 0) this.$promise.execHandlerGroup();
  }

}

Deferral.prototype.reject = function(reason){
  if(this.$promise.state === 'pending') {
    this.$promise.value = reason;
    this.$promise.state = 'rejected';


    while (this.$promise.handlerGroups.length > 0) this.$promise.execHandlerGroup(); 
  }

}

function defer() {
  return new Deferral;
}





/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/