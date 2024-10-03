recipe_selectors = [
	'.recipe-callout',
	'.tasty-recipes',
	'.easyrecipe',
	'.innerrecipe',
	'.recipe-summary.wide', // thepioneerwoman.com
	'.wprm-recipe-container',
	'.recipe-content',
	'div[itemtype="http://schema.org/Recipe"]',
	'div[itemtype="https://schema.org/Recipe"]',
];



function ready(fn) {
    if (typeof fn !== "function") {
        return;
    }
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}


function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return tmp.body;
};

function fadeIn(el) {
    el.style.opacity = 0;

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else {
            el.style.opacity = 1;
        }
    };

    tick();
}

function fadeOut(el) {

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
        last = +new Date();

        if (+el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else {
        	el.style.opacity = 0;
		}

    };

    tick();
}

function hidePopup(){
	fadeOut(document.getElementById("_rf_highlight"));
}

function isAncestor(child, target) {
	if (document === target) {
		return false;
	}
	if (target === child) {
		return true;
	}
	return isAncestor(child, target.parent)
}

function handleMouseUp(e) {
    if (!isAncestor(e.target, cloned))
    {
        hidePopup();
        document.removeEventListener("clicked", handleMouseUp)
    }
}
function showPopup(){
	recipe_selectors.every(function(s){
		var div = document.querySelectorAll(s);
		var body = document.body;
		if (div.length === 1){
			div = div[0];
			// clone the matched element and add some control buttons
			var cloned = div.cloneNode(true);
			cloned.setAttribute('id', '_rf_highlight');
			cloned.appendChild(parseHTML(`
				<div id="_rf_header">
					<button id="_rf_closebtn" class="_rfbtn">close recipe</button>
					RecipeFilter
					<button id="_rf_disablebtn" class="_rfbtn">disable on this site</button>
				</div>
			`));
			body.insertBefore(cloned, body.firstChild);
			fadeIn(cloned);
            cloned.style.display = 'block';

			// handle the two new buttons we attached to the popup
			document.getElementById('_rf_closebtn').addEventListener("click", hidePopup);
			document.getElementById('_rf_disablebtn').addEventListener("click", function(){
				browser.storage.sync.set({[document.location.hostname]: true}, hidePopup);
			});

			// add an event listener for clicking outside the recipe to close it
			document.addEventListener('mouseup', handleMouseUp);

			// scroll to top in case they hit refresh while lower in page
			window.scrollTo(0, 0);
			// it worked, stop iterating through recipe_selectors
			return false;
		}
		return true;
	});
}

// check the blacklist to see if we should run on this site
ready(browser.storage.sync.get(document.location.hostname).then(function(items) {
	if (!(document.location.hostname in items)) {
		showPopup();
	}
}));
