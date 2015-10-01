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
    errorCb: error
  });
  if(this.state === 'resolved') return this.handlerGroups.shift().successCb(this.value);
  if(this.state === 'rejected') return this.handlerGroups.shift().errorCb(this.value);
}

var Deferral = function() {
  this.$promise = new $Promise();
}

Deferral.prototype.resolve = function(dataObj){
  if(this.$promise.state === 'pending') {
    this.$promise.value = dataObj;
    this.$promise.state = 'resolved';
    
  } 

}

Deferral.prototype.reject = function(reason){
  if(this.$promise.state === 'pending') {
    this.$promise.value = reason;
    this.$promise.state = 'rejected';
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
