// Initial setup of pixi.js
var stage 		= new PIXI.Stage(0x000000);
var galleryDiv 	= document.getElementById("gallery");
var WIDTH 		= galleryDiv.offsetWidth;
var HEIGHT 		= galleryDiv.offsetHeight;
var renderer 	= new PIXI.autoDetectRenderer(WIDTH, HEIGHT);
document.getElementById("gallery").appendChild(renderer.view);
// http://pixijs.com/
// https://github.com/sole/tween.js/

function CloseTiler(tiler){
	tx 					= new PIXI.Texture.fromImage("img/ui/xbutton.png");
	sprite 				= new PIXI.Sprite(tx);
	sprite.interactive 	= true;
	sprite.buttonMode 	= true;
	sprite.anchor.x 	= .5;
	sprite.anchor.y 	= .5;
	sprite.position.x 	= WIDTH-40;
	sprite.position.y 	= 40;

	stage.addChild(sprite);

	sprite.touchstart = function(data) {}
	sprite.mouseup = sprite.mouseupoutside = sprite.touchend = sprite.touchendoutside = function(data) {
		tiler.close();
		remove();
	}
	this.remove = remove;
	function remove(){
		stage.removeChild(sprite);
	}
}

function ZoomSlider(tiler, min, max, posX, posY){
	zoom_v_scale = 200;

	z_cont_tx 					= new PIXI.Texture.fromImage("img/ui/zoom_cont.png");
	z_cont_sprite 				= new PIXI.Sprite(z_cont_tx);
	z_cont_sprite.interactive 	= true;
	z_cont_sprite.anchor.x 		= .5;
	z_cont_sprite.anchor.y 		= .5;
	z_cont_sprite.position.x 	= posX;
	z_cont_sprite.position.y 	= posY;

	z_knob_tx 					= new PIXI.Texture.fromImage("img/ui/zoom_knob.png");
	z_knob_sprite 				= new PIXI.Sprite(z_knob_tx);
	z_knob_sprite.interactive 	= true;
	z_knob_sprite.buttonMode 	= true;
	z_knob_sprite.anchor.x 		= .5;
	z_knob_sprite.anchor.y 		= .5;
	z_knob_sprite.position.x 	= -zoom_v_scale/2;
	z_knob_sprite.position.y 	= 0;

	radius = 3;
	progressbar = new PIXI.Graphics();
	progressbar.lineStyle(radius, 0x000000, 1);
	progressbar.moveTo((zoom_v_scale/2),-1);
	progressbar.lineTo(z_knob_sprite.position.x,-1);

	snapHitBox 			= new PIXI.DisplayObjectContainer();
	snapHitBox.interactive 	= true;
	snapHitBox.hitArea = new PIXI.Rectangle(-zoom_v_scale/2, -10, zoom_v_scale, 20);

	stage.addChild(z_cont_sprite);
	z_cont_sprite.addChild(progressbar);
	z_cont_sprite.addChild(snapHitBox);
	z_cont_sprite.addChild(z_knob_sprite);

	snapHitBox.mousedown = snapHitBox.touchstart = function(data) {
		this.isdown = true;
		this.dragging = true;
		this.data = data;
		var clickPos = this.data.getLocalPosition(this.parent);

		z_knob_sprite.position.x = Math.ceil(clickPos.x);
		progressbar.clear();
		progressbar.lineStyle(radius, 0x000000, 1);
		progressbar.moveTo((zoom_v_scale/2),-1);
		progressbar.lineTo(z_knob_sprite.position.x,-1);

		percent = ((zoom_v_scale/2-clickPos.x)/zoom_v_scale)*100;
		val = ((min-max)*(percent)/100)+max;

		tiler.zoom(val);
	}
	snapHitBox.mouseup = snapHitBox.mouseupoutside = snapHitBox.touchend = snapHitBox.touchendoutside = function(data) {
		this.isdown = false;
		this.dragging = false;
		this.data = null;
	}

	z_knob_sprite.mousedown = z_knob_sprite.touchstart = function(data) {
		this.isdown = true;
		this.dragging = true;
		this.data = data;
	}
	z_knob_sprite.mouseup = z_knob_sprite.mouseupoutside = z_knob_sprite.touchend = z_knob_sprite.touchendoutside = function(data) {
		this.isdown = false;
		this.dragging = false;
		this.data = null;
	}
	snapHitBox.mousemove = z_knob_sprite.mousemove = snapHitBox.touchmove = z_knob_sprite.touchmove = function(data){
		if(this.dragging) {
			var dragPos = this.data.getLocalPosition(this.parent);

			if (dragPos.x < -zoom_v_scale/2){
				dragPos.x = -zoom_v_scale/2;
			} else if (dragPos.x > zoom_v_scale/2){
				dragPos.x = zoom_v_scale/2;
			}

			percent = ((zoom_v_scale/2-dragPos.x)/zoom_v_scale)*100;
			val = ((min-max)*(percent)/100)+max;

			if (dragPos.x >= -zoom_v_scale/2 && dragPos.x <= zoom_v_scale/2){ // bound
				z_knob_sprite.position.x = Math.ceil(dragPos.x);
				progressbar.clear();
				progressbar.lineStyle(radius, 0x000000, 1);
				progressbar.moveTo((zoom_v_scale/2),-1);
				progressbar.lineTo(z_knob_sprite.position.x,-1);
				tiler.zoom(val);
			}
		}
	}
	z_knob_sprite.mouseup = z_knob_sprite.mouseupoutside = z_knob_sprite.touchend = z_knob_sprite.touchendoutside = function(data) {
		this.isdown = false;
		this.dragging = false;
		this.data = null;
	}

	this.remove = remove;
	function remove(){
		stage.removeChild(z_cont_sprite);
	}

}

var current_page = 0;
var num_of_pages = 0;
function PageTurner(book){
	tx 						= new PIXI.Texture.fromImage("img/ui/pagebutton.png");
	spriteLeft 				= new PIXI.Sprite(tx);
	spriteLeft.interactive 	= true;
	spriteLeft.buttonMode 	= true;
	spriteLeft.anchor.x 	= .5;
	spriteLeft.anchor.y 	= .5;
	spriteLeft.position.x 	= 16;
	spriteLeft.position.y 	= HEIGHT/2;
	spriteLeft.alpha = .75;

	spriteRight 				= new PIXI.Sprite(tx);
	spriteRight.interactive 	= true;
	spriteRight.buttonMode 		= true;
	spriteRight.anchor.x 		= .5;
	spriteRight.anchor.y 		= .5;
	spriteRight.position.x 		= WIDTH-16;
	spriteRight.position.y 		= HEIGHT/2;
	spriteRight.scale.x 		= -1;
	spriteRight.alpha = .75;

	text = new PIXI.Text((current_page+1)+"/"+num_of_pages, {font: "10px Arial", fill: "white", align: "left"});
	text.position.x = 10;
	text.position.y = 10;
	stage.addChild(text);

	stage.addChild(spriteLeft);
	stage.addChild(spriteRight);

	spriteLeft.mouseover = spriteRight.mouseover = function(data){
		new TWEEN.Tween(this)
			.to({alpha:1},125)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
	}
	spriteLeft.mouseout = spriteRight.mouseout = function(data){
		new TWEEN.Tween(this)
			.to({alpha:.75},500)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
	}
	spriteLeft.touchstart = spriteRight.touchstart = function(data) {}
	spriteLeft.mouseup = spriteLeft.touchend = function(data){
		slideRight();
		stage.removeChild(text);
		text.setText((current_page+1)+"/"+num_of_pages);
		stage.addChild(text);
	}
	spriteRight.mouseup = spriteRight.touchend = function(data){
		slideLeft();
		stage.removeChild(text);
		text.setText((current_page+1)+"/"+num_of_pages);
		stage.addChild(text);
	}

	this.slideLeft = slideLeft;
	function slideLeft(){
		current_page += 1;
		if (current_page >= num_of_pages){
			current_page = num_of_pages-1;
		}

		target = -WIDTH*current_page;
		new TWEEN.Tween(book.container.position)
			.to({x:target},1000)
			.easing(TWEEN.Easing.Cubic.Out)
			.start();
	}
	this.slideRight = slideRight;
	function slideRight(){
		current_page -= 1;
		if (current_page < 0){
			current_page = 0;
		}

		target = -WIDTH*current_page;
		new TWEEN.Tween(book.container.position)
			.to({x:target},1000)
			.easing(TWEEN.Easing.Cubic.Out)
			.start();
	}
}

function ViewPort(tiler){
	// fade bg
	bgFade = new PIXI.Graphics();
	bgFade.beginFill(0x000000);
	bgFade.drawRect(0, 0, WIDTH, HEIGHT);
	bgFade.endFill();
	bgFade.alpha = 0;
	stage.addChild(bgFade);
	this.bgFade = bgFade;

	mask = new PIXI.Graphics();
	this.mask = mask;
	this.setMaskSize = setMaskSize;
	function setMaskSize(width, height){
		mask.beginFill();
		mask.drawRect(((WIDTH/2)-((width)/2)), 
					  ((HEIGHT/2)-((height)/2)), 
					  width, 
					  height);
		mask.endFill();
		stage.addChild(mask);
	}
	this.setSpriteMask = setSpriteMask;
	function setSpriteMask(sprite){
		sprite.mask = mask;
	}

	this.bgFadeIn = bgFadeIn;
	function bgFadeIn(){
		new TWEEN.Tween(bgFade)
			.to({alpha:1},500)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();
	}
	this.bgFadeOut = bgFadeOut;
	function bgFadeOut(){
		new TWEEN.Tween(bgFade)
			.to({alpha:0},250)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start()
			.onComplete(function(){
				stage.removeChild(bgFade);
			});
	}
}

function Tiler (fullJSON){
	viewport = new ViewPort(this);
	this.viewport = viewport;

	transformContainer 			= new PIXI.DisplayObjectContainer();
	transformContainer.interactive 	= true;
	transformContainer.buttonMode 	= true;
	stage.addChild(transformContainer);
	this.transformContainer = transformContainer;

	text = new PIXI.Text("Loading...", {font: "16px Arial", fill: "white", stroke: 'black', strokeThickness: 3});
	text.position.x = WIDTH/2;
	text.position.y = 0;
	text.anchor.x = .5;
	text.anchor.y = 0;
	transformContainer.addChild(text);

	imageContainer 				= new PIXI.DisplayObjectContainer();
	imageContainer.interactive 	= true;
	imageContainer.buttonMode 	= true;
	imageContainer.defaultCursor = "move";
	transformContainer.addChild(imageContainer);

	// dummy texture to avoid panning issues with supposed gaps between sprites
	imageContainer.dummy = new PIXI.Sprite(new PIXI.Texture.fromImage("img/dummy.png"));
	imageContainer.addChild(imageContainer.dummy);

	this.imageContainer = imageContainer;
	parent = this;

	$.getJSON(fullJSON, function(json){
		create_tiles(json);
	});

	function create_tiles(json){
		console.log(json);
		viewport.bgFadeIn();
		imageContainer.width 		= json.img_width;
		imageContainer.height 		= json.img_height;
		imageContainer.dummy.width 	= json.img_width;
		imageContainer.dummy.height = json.img_height;

		row = json.grid_size;
		col = json.grid_size;
		y_offset = 0;
		x_offset = 0;
		for (var i = 0; i < json.tiles.length; i++){
			var tx = new PIXI.Texture.fromImage(json.tiles[i]);
			var sprite = new PIXI.Sprite(tx);

			sprite.x = x_offset;
			sprite.y = y_offset;
			viewport.setSpriteMask(sprite);
			imageContainer.addChild(sprite);

			y_offset += json.tile_height;
			if ((i+1)%json.grid_size == 0 && i != 0){
				y_offset = 0;
				x_offset += json.tile_width;
			}
		}
		// resize and center the tile container
		sc = (HEIGHT/json.img_height)*.95;
		imageContainer.scaleReference = sc;
		
		transformContainer.scale.x 		= sc;
		transformContainer.scale.y 		= sc;
		transformContainer.position.x 	= (WIDTH/2);
		transformContainer.position.y 	= (HEIGHT/2);
		imageContainer.position.x 		= -(json.img_width/2);
		imageContainer.position.y 		= -(imageContainer.height/2);

		viewport.setMaskSize(json.img_width*sc, json.img_height*sc);
		zoomSlider = new ZoomSlider(parent, sc, 1, (WIDTH/2), (HEIGHT*.95)-16);
		closeButton = new CloseTiler(parent);
		transformContainer.removeChild(text);
	}
	
	// mouse/touch input
	imageContainer.mousedown = imageContainer.touchstart = function(data) {
		this.isdown = true;
		this.dragging = true;
		this.data = data;

		this.dragOffset = this.data.getLocalPosition(this.parent);
		this.dragOffset.x -= this.position.x;
		this.dragOffset.y -= this.position.y;
	}
	// Mouse up action
	imageContainer.mouseup = imageContainer.mouseupoutside = imageContainer.touchend = imageContainer.touchendoutside = function(data) {
		this.isdown = false;
		this.dragging = false;
		this.data = null; // set the interaction data to null

		bounds();
	}
	// Mouse over action
	imageContainer.mouseover = function(data){
		this.isOver = true;
		if(this.isdown)return
	}
	// Mouse out action
	imageContainer.mouseout = function(data){
		this.isOver = false;
		this.dragging = false;
		bounds();
		if(this.isdown)return
	}
	// Mouse move action
	imageContainer.mousemove = imageContainer.touchmove = function(data){
		if(this.dragging) {
			var newPosition = this.data.getLocalPosition(this.parent); // dragging position
			this.position.x = newPosition.x - this.dragOffset.x;
			this.position.y = newPosition.y - this.dragOffset.y;
			//console.log(this.position);
			bounds();
		}
	}
	this.zoom = zoom;
	function zoom(amount){
		new TWEEN.Tween(transformContainer.scale)
			.to({x:amount,y:amount},400)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start()
			.onUpdate(function(){
				bounds();
			})
			.onComplete(function(){
				//bounds();
			});
	}

	this.bounds = bounds;
	function bounds(){
		topBound 	= -(imageContainer.height*imageContainer.scaleReference)/2; // -HEIGHT/2;
		botBound 	= (imageContainer.height*imageContainer.scaleReference)/2; 	// HEIGHT/2;
		leftBound 	= -(imageContainer.width*imageContainer.scaleReference)/2; 	// -WIDTH/2;
		rightBound	= (imageContainer.width*imageContainer.scaleReference)/2; 	// WIDTH/2;

		contPosX = (imageContainer.position.x*transformContainer.scale.x);
		contPosY = (imageContainer.position.y*transformContainer.scale.y);

		// dragging bounds
		// vertical bound
		if (contPosY > topBound && (imageContainer.height*transformContainer.scale.y) 	> botBound){ 
			imageContainer.position.y = topBound/transformContainer.scale.y;
		} else if ((contPosY+(imageContainer.height*transformContainer.scale.y)) 		< botBound 
				&& (imageContainer.height*transformContainer.scale.y) 					> botBound) {
			imageContainer.position.y = (botBound/transformContainer.scale.y)-(imageContainer.height);
		} else if ((imageContainer.height*transformContainer.scale.y) 					<= botBound){
			imageContainer.position.y = -(imageContainer.height/2);
		}
		// horizontal bound
		if (contPosX > leftBound && (imageContainer.width*transformContainer.scale.x) 	> rightBound){ 
			imageContainer.position.x = leftBound/transformContainer.scale.x;
		} else if ((contPosX+(imageContainer.width*transformContainer.scale.y)) 		< rightBound 
				&& (imageContainer.width*transformContainer.scale.x) 					> rightBound){
			imageContainer.position.x = (rightBound/transformContainer.scale.x)-(imageContainer.width);
		} else if ((imageContainer.width*transformContainer.scale.x) 					<= rightBound){
			imageContainer.position.x = -(imageContainer.width/2);
		}
	}

	this.close = close;
	function close(){
		viewport.bgFadeOut();
		stage.removeChild(transformContainer);
		zoomSlider.remove();
		closeButton.remove();
	}
}

var currentViewImage = null;
function Page(book, page, page_num){
	// when one is pressed, create new Tiler(this, "img/img.jpg") in a global var
	// and close it when prompted to close.
	this.page_container = new PIXI.DisplayObjectContainer();
	this.page_container.setStageReference(stage);
	this.page_container.interactive 	= true;
	this.page_container.buttonMode 	= true;
	this.page_container.position.x = WIDTH/2 + WIDTH*page_num;
	this.page_container.position.y = HEIGHT/2;
	book.container.addChild(this.page_container);
	var page_container = this.page_container;

	if (page.thmb_res[1] > page.thmb_res[1]/3){
		this.page_container.scale.x = (HEIGHT/3)/page.thmb_res[1];
		this.page_container.scale.y = (HEIGHT/3)/page.thmb_res[1];
	}

	// front view layout
	v_top_transform  	= (page.thmb_res[1]/3.5);
	h_transform 		= (page.thmb_res[0]/2.5);

	//bottom
	img8 	 = [page.images.thumbs[2][2], page.images.full[2][2]];
	img8_pos = [page.thmb_res[0]-h_transform, page.thmb_res[1]-v_top_transform];
	new createThumb(img8[0], img8[1], img8_pos[0], img8_pos[1]);

	img6 	 = [page.images.thumbs[2][0], page.images.full[2][0]];
	img6_pos = [-page.thmb_res[0]+h_transform, page.thmb_res[1]-v_top_transform];
	new createThumb(img6[0], img6[1], img6_pos[0], img6_pos[1]);

	img7 	 = [page.images.thumbs[2][1], page.images.full[2][1]];
	img7_pos = [0, page.thmb_res[1]-(page.thmb_res[1]/4)];
	new createThumb(img7[0], img7[1], img7_pos[0], img7_pos[1]);

	//top
	img0 	 = [page.images.thumbs[0][0], page.images.full[0][0]];
	img0_pos = [-page.thmb_res[0]+h_transform, -page.thmb_res[1]+v_top_transform];
	new createThumb(img0[0], img0[1], img0_pos[0], img0_pos[1]);

	img2 	 = [page.images.thumbs[0][2], page.images.full[0][2]];
	img2_pos = [page.thmb_res[0]-h_transform, -page.thmb_res[1]+v_top_transform];
	new createThumb(img2[0], img2[1], img2_pos[0], img2_pos[1]);

	//middle
	img3 	 = [page.images.thumbs[1][0], page.images.full[1][0]];
	img3_pos = [-page.thmb_res[0]+h_transform, 0];
	new createThumb(img3[0], img3[1], img3_pos[0], img3_pos[1]);

	img5 	 = [page.images.thumbs[1][2], page.images.full[1][2]];
	img5_pos = [page.thmb_res[0]-h_transform, 0];
	new createThumb(img5[0], img5[1], img5_pos[0], img5_pos[1]);

	img4 	 = [page.images.thumbs[1][1], page.images.full[1][1]];
	img4_pos = [0, 0];
	new createThumb(img4[0], img4[1], img4_pos[0], img4_pos[1]);

	//top center
	img1 	 = [page.images.thumbs[0][1], page.images.full[0][1]];
	img1_pos = [0, -page.thmb_res[1]+(page.thmb_res[1]/4)];
	new createThumb(img1[0], img1[1], img1_pos[0], img1_pos[1]);
	

	function createThumb(path, fullJSON, x, y){
		tx 					= new PIXI.Texture.fromImage(path);
		sprite 				= new PIXI.Sprite(tx);
		sprite.interactive 	= true;
		sprite.buttonMode 	= true;
		// position tiles
		sprite.anchor.x = .5;
		sprite.anchor.y = .5;

		sprite.position.x = x*sprite.scale.x;
		sprite.position.y = y*sprite.scale.y;
		
		sprite.mouseover = function(data) {
			this.tint = 0xDFDFFF;
		}
		sprite.mouseout = function(data) {
			this.tint = 0xFFFFFF;
		}

		sprite.mousedown = sprite.touchstart = function(data) { // Mouse down action
			this.isdown = true;
		}
		
		sprite.mouseup = sprite.touchend = function(data) { // Mouse up action
			if (this.isdown == true) {
				currentViewImage = new Tiler(fullJSON);
			}
			this.isdown = false;
		}

		page_container.addChild(sprite);
	}
}

function Book(gallery, json){
	this.container = new PIXI.DisplayObjectContainer();
	this.container.setStageReference(stage);
	this.container.interactive 	= true;
	this.container.buttonMode 	= true;
	gallery.container.addChild(this.container);

	this.gallery = gallery;
	for (var i = 0; i < json.pages.length; i++){
		num_of_pages += 1;
		new Page(this, json.pages[i], i);
	}

	this.pageTurner = new PageTurner(this);
}

function Gallery(json){
	this.container 				= new PIXI.DisplayObjectContainer();
	this.container.setStageReference(stage);
	this.container.width 		= WIDTH;
	this.container.height 		= HEIGHT;
	stage.addChild(this.container);

	this.book = new Book(this, json);
}

$.getJSON("gallery.json", function(json){
	var gallery = new Gallery(json);
});

// Update and draw
requestAnimFrame(animate);
function animate(){
	requestAnimFrame(animate);
	renderer.render(stage);
	TWEEN.update();
}

// key inputs
if (document.addEventListener) {
    document.addEventListener("keyup", KeyUpHandler(), false);
}
function KeyUpHandler() {
	return function (e){
		// escape key up
		if (e.keyCode == 27) {
			if (currentViewImage != null){
				console.log("close");
				currentViewImage.close();
				currentViewImage = null;
			}
		}
		return false;
	}
}