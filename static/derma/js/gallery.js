// Initial setup of pixi.js
var stage = new PIXI.Stage(0x000000);
var galleryDiv = document.getElementById("gallery");
var width = galleryDiv.offsetWidth;
var height = galleryDiv.offsetHeight;
var renderer = new PIXI.WebGLRenderer(width, height);
document.getElementById("gallery").appendChild(renderer.view);
// http://pixijs.com/
// https://github.com/sole/tween.js/

var currentPageNumber = 0;
var fullImage = null;

function pageFlipButton(galleryPages, direction){
	texture = new PIXI.Texture.fromImage('images/pagefliparrow.png');
	this.sprite = new PIXI.Sprite(texture);
	this.sprite.parent_obj = this;
	texture.sprite = this.sprite;
	stage.addChild(this.sprite);

	this.sprite.anchor.x = .5;
	this.sprite.anchor.y = .5;

	this.sprite.position.y = height/2;
	if (direction == 'left'){
		texture.sprite.position.x = 23;
	} else {
		texture.sprite.position.x = width-23;
		texture.sprite.scale.x = -1;
	}
	this.sprite.alpha = .25;

	// Make the sprite a button
	this.sprite.setInteractive(true);
	this.sprite.buttonMode = true;

	this.sprite.mousedown = function(data) {
		this.isdown = true;
		console.log("Mouse down");
		this.data = data;
		this.dragging = true;
	}
	this.sprite.mouseup = function(data) { // this.sprite.touchend
		this.isdown = false;
		console.log("mouse up");
		this.dragging = false;

		if (direction == 'left' && currentPageNumber > 0){
			changePage(galleryPages, direction);
		} 
		if (direction == 'right' && currentPageNumber < galleryPages.length-1){
			changePage(galleryPages, direction);
		} 
		
		// set the interaction data to null
		this.data = null;
	}
	this.sprite.mouseover = function(data){
		this.isOver = true;
		new TWEEN.Tween(this)
			.to({alpha:1},400)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
		if(this.isdown)return
	}
	this.sprite.mouseout = function(data){
		this.isOver = false;
		this.dragging = false;
		new TWEEN.Tween(this)
			.to({alpha:.25},400)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
		if(this.isdown)return
	}
}

function changePage(galleryPages, direction){
	for (var i = 0; i < galleryPages.length; i++){
		if (direction == 'left'){
			for (var t = 0; t < galleryPages[i].pageThumbs.length; t++){
				if (galleryPages[i].pageThumbs[t].sprite.position.doneTweening == true){
					tweenThumb(galleryPages[i].pageThumbs[t], 1);
				}
			}
		} else {
			for (var t = 0; t < galleryPages[i].pageThumbs.length; t++){
				if (galleryPages[i].pageThumbs[t].sprite.position.doneTweening == true){
					tweenThumb(galleryPages[i].pageThumbs[t], -1);
				}
			}
			
		}
	}
	if (direction == 'left'){
		currentPageNumber -= 1;
	} else {
		currentPageNumber += 1;
	}
	console.log(currentPageNumber);

	function tweenThumb(thumb, d){
		thumb.hideBorder();

		thumb.sprite.position.doneTweening = false;
	
		new TWEEN.Tween(thumb)
			.to({},1500)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.start()
			.onComplete( function() {
				this.showBorder();
			});
	
		new TWEEN.Tween(thumb.sprite.position)
			.to({x:thumb.sprite.position.x+(width*d)},1500)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.start()
			.onComplete( function() {
				this.doneTweening = true;
			});
	}
}

// --- Full image ---
function FullImage(page, path){
	this.hidden = false;
	this.spriteWidth = 4912;
	this.spriteHeight = 7360;

	this.path = path;

	texture = new PIXI.Texture.fromImage(this.path);
	this.sprite = new PIXI.Sprite(texture);
	this.sprite.parent_obj = this;

	texture.sprite = this.sprite;

	// Set up positioning, scale, anchor, alpha, etc.
	this.sprite.anchor.x = .5;
	this.sprite.anchor.y = .5;
	this.sprite.position.x = width/2;
	this.sprite.position.y = height/2;

	// fade bg
	bgFade = new PIXI.Graphics();
	bgFade.beginFill(0x000000);
	bgFade.drawRect(0, 0, width, height);
	bgFade.endFill();
	bgFade.alpha = 0;
	stage.addChild(bgFade);

	// set up mask bounds
	pscale = height/page.fullResolution[1];
	dscale = .45;
	leftBound = width/2-((page.fullResolution[0]*pscale)*dscale);
	rightBound = width/2+((page.fullResolution[0]*pscale)*dscale);
	topBound = height/2-((page.fullResolution[1]*pscale)*dscale);
	bottomBound = height/2+((page.fullResolution[1]*pscale)*dscale);
 	// black bg behind image
	blackBg = new PIXI.Graphics();
	blackBg.beginFill(0x000000);
	blackBg.drawRect(leftBound-1, topBound-1, (((page.fullResolution[0]*pscale)*dscale)*2)+2, (((page.fullResolution[1]*pscale)*dscale)*2)+2);
	blackBg.endFill();
	stage.addChild(blackBg);

	// loading sprite
	loadTexture = new PIXI.Texture.fromImage("images/load.jpg");
	loadSprite = new PIXI.Sprite(loadTexture);
	loadSprite.anchor.x = .5;
	loadSprite.anchor.y = .5;
	loadSprite.position.x = width/2;
	loadSprite.position.y = height/2;
	stage.addChild(loadSprite);

	// view port mask
	viewPort = new PIXI.Graphics();
	viewPort.beginFill();
	viewPort.drawRect(leftBound, topBound, ((page.fullResolution[0]*pscale)*dscale)*2, ((page.fullResolution[1]*pscale)*dscale)*2);
	viewPort.endFill();

	stage.addChild(viewPort);
	stage.addChild(this.sprite);

	this.sprite.mask = viewPort;

	// if the texture is already loaded
	if (texture.baseTexture.hasLoaded) {
	    //console.log(texture.sprite.width + ', ' + texture.sprite.height);
	    fadeIn();
	    stage.removeChild(loadSprite);

	} else { // if not
	    texture.addEventListener("update", onTextureUpdate)
	}
	function onTextureUpdate() {
		//console.log(texture.sprite.width+", "+texture.sprite.height);
		fadeIn();
		stage.removeChild(loadSprite);
	}

	function fadeIn(){
		// ignore scrolling
		$('body').addClass('stop-scrolling');

		projectedScale = height/texture.sprite.height;
	    texture.sprite.scale.x = projectedScale;
		texture.sprite.scale.y = projectedScale;
		texture.sprite.scale.x -= .01;
		texture.sprite.scale.y -= .01;
		texture.sprite.alpha = 0;

		new TWEEN.Tween(texture.sprite)
			.to({alpha:1},250)
			.easing(TWEEN.Easing.Circular.Out)
			.start();

		new TWEEN.Tween(texture.sprite.scale)
			.to({x:projectedScale,y:projectedScale},250)
			.easing(TWEEN.Easing.Circular.Out)
			.start();

		new TWEEN.Tween(bgFade)
			.to({alpha:.5},250)
			.easing(TWEEN.Easing.Circular.Out)
			.start();
	}

	// Make the sprite a button
	this.sprite.setInteractive(true);
	this.sprite.buttonMode = true;

	// Add the sprite to the pixi.js stage
	// Begin button actions
	// Mouse down action
	this.sprite.mousedown = function(data) {
		this.isdown = true;
		console.log("Mouse down");
		this.data = data;
		this.dragging = true;
	}
	// Mouse up action
	this.sprite.mouseup = function(data) { // this.sprite.touchend
		this.isdown = false;
		console.log("mouse up");
		this.dragging = false;
		// set the interaction data to null
		this.data = null;
	}
	// Mouse over action
	this.sprite.mouseover = function(data){
		this.isOver = true;
		if(this.isdown)return
	}
	// Mouse out action
	this.sprite.mouseout = function(data){
		this.isOver = false;
		this.dragging = false;
		if(this.isdown)return
	}

	this.sprite.mousemove = function(data){
		if(this.dragging) {
			var newPosition = this.data.getLocalPosition(this.parent);
			topLeftX = newPosition.x-(this.width*this.anchor.x);
			topLeftY = newPosition.y-(this.height*this.anchor.y);
			// dragging bounds
			// horizontal bound
			if (topLeftX <= leftBound && topLeftX+this.width >= rightBound){
				this.position.x = newPosition.x;
			} // vertical bound
			if (topLeftY <= topBound && topLeftY+this.height >= bottomBound){
				this.position.y = newPosition.y;
			} 
		}
	}

	this.hide = hide;
	function hide() {
		//console.log("hiding large image");
		// stop ignore scrolling
		$('body').removeClass('stop-scrolling');

		d = this.sprite.scale.x - .05;
		new TWEEN.Tween(this.sprite.scale)
			.to({x:d,y:d},260)
			.easing(TWEEN.Easing.Circular.Out)
			.start();

		new TWEEN.Tween(this.sprite)
			.to({alpha:0},270)
			.easing(TWEEN.Easing.Circular.Out)
			.start()
			.onComplete( function() {
				this.visible = false;
				stage.removeChild(this);
			});

		new TWEEN.Tween(bgFade)
			.to({alpha:0},250)
			.easing(TWEEN.Easing.Circular.Out)
			.start();

		stage.removeChild(blackBg);

		this.hidden = true;
		
		//this.sprite.visible = false;
		//stage.removeChild(this.sprite);
	}

	this.zoomOut = zoomOut;
	function zoomOut() {
		if (this.sprite.scale.x > .5){
			zx = this.sprite.scale.x - .05*(1+this.sprite.scale.x);
			zy = this.sprite.scale.y - .05*(1+this.sprite.scale.x);
			new TWEEN.Tween(this.sprite.scale)
				.to({x:zx,y:zy},250)
				.easing(TWEEN.Easing.Circular.Out)
				.start();
		}
	}
	this.zoomIn = zoomIn;
	function zoomIn() {
		if (this.sprite.scale.x < 2){
			zx = this.sprite.scale.x + .05*(1+this.sprite.scale.x);
			zy = this.sprite.scale.y + .05*(1+this.sprite.scale.x);
			new TWEEN.Tween(this.sprite.scale)
				.to({x:zx,y:zy},250)
				.easing(TWEEN.Easing.Circular.Out)
				.start();
		}
	}
	this.calculateNewAnchr = calculateNewAnchr;
	function calculateNewAnchr(posX, posY){
		this.sprite.anchor.x = (posX-(this.sprite.position.x-(this.sprite.width*this.sprite.anchor.x)))/this.sprite.width;
		this.sprite.anchor.y = (posY-(this.sprite.position.y-(this.sprite.height*this.sprite.anchor.y)))/this.sprite.height;

		this.sprite.position.x = posX;
		this.sprite.position.y = posY;
	}
}

// --- Thumbnail ---
function GalleryThumb(page, path, fullPath, posX, posY){
	this.path = path;
	this.fullPath = fullPath;

	texture = new PIXI.Texture.fromImage(this.path);
	this.sprite = new PIXI.Sprite(texture);
	texture.sprite = this.sprite;
	stage.addChild(this.sprite);

	if(texture.baseTexture.hasLoaded) {
	    //console.log(texture.sprite.width + ', ' + texture.sprite.height);
	} else {
	    texture.addEventListener("update", onTextureUpdate)
	}
	function onTextureUpdate() {
		//console.log(texture.sprite.width+", "+texture.sprite.height);
	}

	// Set up positioning, scale, anchor, alpha, etc.
	this.sprite.anchor.x = .5;
	this.sprite.anchor.y = .5;
	this.sprite.position.x = posX;
	this.sprite.position.y = posY;
	this.sprite.position.doneTweening = true;

	this.sprite.whiteBorder = new PIXI.Graphics();
	leftBound 	= this.sprite.position.x-page.thumbResolution[0]/2;
	rightBound 	= this.sprite.position.x+page.thumbResolution[0]/2;
	topBound 	= this.sprite.position.y-page.thumbResolution[1]/2;
	bottomBound = this.sprite.position.y+page.thumbResolution[1]/2;
	
	this.sprite.whiteBorder.lineStyle(1, 0xFFFFFF);
	this.sprite.whiteBorder.moveTo(leftBound+1, topBound+1);
	this.sprite.whiteBorder.lineTo(rightBound-2, topBound+1);
	this.sprite.whiteBorder.lineTo(rightBound-2, bottomBound-2);
	this.sprite.whiteBorder.lineTo(leftBound+1, bottomBound-2);
	this.sprite.whiteBorder.lineTo(leftBound+1, topBound+1);
	stage.addChild(this.sprite.whiteBorder);
	this.sprite.whiteBorder.alpha = .25;
	//this.sprite.alpha = .85;
	// Make the sprite a button
	this.sprite.setInteractive(true);
	this.sprite.buttonMode = true;

	this.hideBorder = hideBorder;
	function hideBorder(){
		new TWEEN.Tween(this.sprite.whiteBorder)
			.to({alpha:0},500)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start()
			.onComplete(function(){
				//
			});
	}
	this.showBorder = showBorder;
	function showBorder(){
		this.sprite.whiteBorder.clear();
		leftBound 	= this.sprite.position.x-this.sprite.width/2;
		rightBound 	= this.sprite.position.x+this.sprite.width/2;
		topBound 	= this.sprite.position.y-this.sprite.height/2;
		bottomBound = this.sprite.position.y+this.sprite.height/2;;
	
		this.sprite.whiteBorder.lineStyle(1, 0xFFFFFF);
		this.sprite.whiteBorder.moveTo(leftBound+1, topBound+1);
		this.sprite.whiteBorder.lineTo(rightBound-2, topBound+1);
		this.sprite.whiteBorder.lineTo(rightBound-2, bottomBound-2);
		this.sprite.whiteBorder.lineTo(leftBound+1, bottomBound-2);
		this.sprite.whiteBorder.lineTo(leftBound+1, topBound+1);

		this.sprite.whiteBorder.alpha = 0;

		new TWEEN.Tween(this.sprite.whiteBorder)
			.to({alpha:.25},1250)
			.easing(TWEEN.Easing.Quadratic.In)
			.start();
	}
	// Begin button actions
	// Mouse down action
	this.sprite.mousedown = function(data) {
		this.isdown = true;
		console.log("Mouse down");
	}
	// Mouse up action
	this.sprite.mouseup = function(data) { // this.sprite.touchend
		this.isdown = false;
		console.log("mouse up");
		// start image focus code
		if (fullImage != null){
			if (fullImage.hidden == false){
				fullImage.hide();
			}
		} 
		if (fullImage == null || fullImage.hidden == true){
			fullImage = new FullImage(page, fullPath);
		}
	}
	// Mouse over action
	this.sprite.mouseover = function(data){
		if (this.position.doneTweening == true){
			new TWEEN.Tween(this.whiteBorder)
			.to({alpha:1},400)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
		}
		this.isOver = true;
		if(this.isdown)return
	}
	// Mouse out action
	this.sprite.mouseout = function(data){
		new TWEEN.Tween(this.whiteBorder)
			.to({alpha:.25},400)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
		this.isOver = false;
		if(this.isdown)return // behaves like continue in python
	}
}
// --- Gallery Page and thumbnail placement --- 
function GalleryPage(page, pageNum){
	this.page = page;
	this.pageThumbs = [];
	hTransform = page.thumbResolution[0]-page.thumbResolution[0]/2.5; // layout 2 = page.thumbResolution[0]
	hOffset = width*pageNum;
	//console.log(hOffset);

	// middle left
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[1][0], page.images.full[1][0], (width/2)-hTransform+hOffset, (height/2))); // -(page.thumbResolution[1]/26)
	// middle right
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[1][2], page.images.full[1][2], (width/2)+hTransform+hOffset, (height/2)));
	// top left
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[0][0], page.images.full[0][0], (width/2)-hTransform+hOffset, (height/2)-page.thumbResolution[1]+(page.thumbResolution[1]/3.5)));
	// top right
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[0][2], page.images.full[0][2], (width/2)+hTransform+hOffset, (height/2)-page.thumbResolution[1]+(page.thumbResolution[1]/3.5)));
	// bottom left
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[2][0], page.images.full[2][0], (width/2)-hTransform+hOffset, (height/2)+page.thumbResolution[1]-(page.thumbResolution[1]/3.5)));
	// bottom right
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[2][2], page.images.full[2][2], (width/2)+hTransform+hOffset, (height/2)+page.thumbResolution[1]-(page.thumbResolution[1]/3.5)));
	// bottom center
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[2][1], page.images.full[2][1], (width/2)+hOffset, (height/2)+page.thumbResolution[1]-(page.thumbResolution[1]/4)));
	// center image
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[1][1], page.images.full[1][1], width/2+hOffset, height/2));
	// top center
	this.pageThumbs.push(new GalleryThumb(page, page.images.thumbnail[0][1], page.images.full[0][1], (width/2)+hOffset, (height/2)-page.thumbResolution[1]+(page.thumbResolution[1]/4)));
}

// --- Gallery and gallery setup ---
function Gallery(jsonFile){
	this.json = jsonFile;
	this.pages = [];
	// populate the gallery
	for (var i = 0; i < this.json.gallery.pages.length; i++){
		this.pages.push(new GalleryPage(this.json.gallery.pages[i], i));
		//this.pages.push(new GalleryPage(this.json.gallery.pages[i], i+1));
	}
	new pageFlipButton(this.pages, 'left');
	new pageFlipButton(this.pages, 'right');
}
function loadNewJSON(file) {
	// stop ignore scrolling
	$('body').removeClass('stop-scrolling');
	// 
	currentPageNumber = 0;
	fullImage = null;
	// remove tweens
	TWEEN.removeAll();
	// remove all children from the stage
	for (var i = stage.children.length - 1; i >= 0; i--) {
		stage.removeChild(stage.children[i]);
	};
	// load the default json file
	$.getJSON(file, function(json) {
		Gallery(json);
	});
}
$.getJSON("default.json", function(json) {Gallery(json);});

// --- Handle inputs ---
// http://stackoverflow.com/questions/18880159/use-jquery-to-check-mousewheel-event-without-scrollbar
if (document.addEventListener) {
    document.addEventListener("mousewheel", MouseWheelHandler(), false);
    document.addEventListener("DOMMouseScroll", MouseWheelHandler(), false);
    document.addEventListener("keyup", KeyUpHandler(), false);
    document.addEventListener("mousedown", MouseDownHandler(), false);

} else {
    sq.attachEvent("onmousewheel", MouseWheelHandler());
}
function MouseWheelHandler() {
    return function (e) {
        // cross-browser wheel delta
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta < 0) { //scrolling down
        	console.log("scroll down");
            zoomOut();
        } else { //scrolling up
        	console.log("scroll up");
            zoomIn();
        }
        return false;
    }
}
function zoomIn(){
	fullImage.zoomIn();
}
function zoomOut(){
	fullImage.zoomOut();
}
function KeyUpHandler() {
	return function (e){
		// escape key up
		if (e.keyCode == 27) {
			if (fullImage.hidden == false){
				fullImage.hide();
			}
		}
		return false;
	}
}
function MouseDownHandler() {
	return function (e){
		console.log("mouse down pos:", e.clientX, e.clientY);
		if (fullImage != null){
			fullImage.calculateNewAnchr(e.clientX, e.clientY);
		}
		return false;
	}
}

// Update and draw
requestAnimFrame(animate);
function animate(){
	requestAnimFrame(animate);
	renderer.render(stage);
	TWEEN.update();
}