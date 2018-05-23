"use strict";(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i]);}return o;}return r;})()({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.$mustExist=$mustExist;exports.$=$;exports.$$=$$;exports.log=log;function $mustExist(selector){var parent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:document;var $dom=$(selector,parent);if(!$dom)log(selector+" is missing!");return $dom;}function $(selector){var parent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:document;return parent.querySelector(selector);}function $$(selector){var parent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:document;return Array.prototype.slice.call(parent.querySelectorAll(selector));}function log(ctx){console.log("Github UI Rewrite: "+ctx);}},{}],2:[function(require,module,exports){'use strict';var _utils=require('./_utils');document.addEventListener('DOMContentLoaded',setupForDashboard);var inited=false;function setupForDashboard(){if(inited)return;inited=true;(0,_utils.log)('setupForDashboard');var $sidebar=(0,_utils.$mustExist)('.dashboard-sidebar');if(!$sidebar)return;var $currentUserName=(0,_utils.$mustExist)('.account-switcher-truncate-override',$sidebar);if(!$currentUserName)return;var $listen=(0,_utils.$mustExist)('.js-repos-container .Box-body',$sidebar);if(!$listen)(0,_utils.log)('.js-repos-container .Box-body is missing!');makeRepoNameShorter();var lastUpdate=0;var listener=new MutationObserver(function(list){(0,_utils.log)('ChildList of sidebar repositories area has changed');var now=Date.now();if(now<lastUpdate+500)return;lastUpdate=now;makeRepoNameShorter();});listener.observe($listen,{childList:true});function makeRepoNameShorter(){var userName=$currentUserName.innerText;var startsWith=userName+'/';var update=[];var $repos=(0,_utils.$$)('li.source .text-bold, li.fork .text-bold',$sidebar);var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=$repos[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var $repo=_step.value;var text=$repo.innerText;if(text.startsWith(startsWith))update.push({e:$repo,text:text.replace(startsWith,'')});}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=update[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var _ref=_step2.value;var e=_ref.e;var text=_ref.text;e.innerText=text;}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}}}},{"./_utils":1}]},{},[2]);