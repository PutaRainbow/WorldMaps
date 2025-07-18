/* main.js */
(function() {
	"use strict";

	var $body = document.querySelector('body');

	// Polyfills

	// classList polyfill
	!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

	// canUse
	window.canUse = function(p) {
		if (!window._canUse) window._canUse = document.createElement("div");
		var e = window._canUse.style, up = p.charAt(0).toUpperCase() + p.slice(1);
		return p in e || "Moz" + up in e || "Webkit" + up in e || "O" + up in e || "ms" + up in e;
	};

	// addEventListener fallback
	(function(){ if ("addEventListener" in window) return; window.addEventListener = function(type, f){ window.attachEvent("on" + type, f); } })();

	// Remove preload class once loaded
	window.addEventListener('load', function() {
		window.setTimeout(function() {
			$body.classList.remove('is-preload');
		}, 100);
	});

	// Slideshow Background (index.html only)
	if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
		(function() {
			var settings = {
				images: {
					'images/bg01.jpg': 'center',
					'images/bg02.jpg': 'center',
					'images/bg03.jpg': 'center'
				},
				delay: 6000
			};

			var pos = 0, lastPos = 0, $wrapper, $bgs = [], $bg;

			// Create BG wrapper & BGs
			$wrapper = document.createElement('div');
			$wrapper.id = 'bg';
			$body.appendChild($wrapper);

			for (var k in settings.images) {
				$bg = document.createElement('div');
				$bg.style.backgroundImage = 'url("' + k + '")';
				$bg.style.backgroundPosition = settings.images[k];
				$wrapper.appendChild($bg);
				$bgs.push($bg);
			}

			// Bail if single or no transitions
			$bgs[pos].classList.add('visible');
			$bgs[pos].classList.add('top');
			if ($bgs.length == 1 || !canUse('transition')) return;

			window.setInterval(function() {
				lastPos = pos;
				pos = (pos + 1) % $bgs.length;
				$bgs[lastPos].classList.remove('top');
				$bgs[pos].classList.add('visible');
				$bgs[pos].classList.add('top');
				window.setTimeout(function() {
					$bgs[lastPos].classList.remove('visible');
				}, settings.delay / 2);
			}, settings.delay);
		})();
	}

	// Signup Form (index.html only)
	var signupForm = document.querySelector('#signup-form');
	if (signupForm) {
		(function() {
			var $form = signupForm;
			var $submit = $form.querySelector('input[type="submit"]');
			var $message = document.createElement('span');
			$message.classList.add('message');
			$form.appendChild($message);

			$message._show = function(type, text) {
				$message.innerHTML = text;
				$message.classList.add(type);
				$message.classList.add('visible');

				window.setTimeout(function() {
					$message._hide();
				}, 3000);
			};

			$message._hide = function() {
				$message.classList.remove('visible');
			};

			$form.addEventListener('submit', function(event) {
				event.preventDefault();
				$message._hide();
				$submit.disabled = true;

				window.setTimeout(function() {
					$form.reset();
					$submit.disabled = false;
					$message._show('success', 'Thank you!');
				}, 750);
			});
		})();
	}

})();
