var Birds = (function Birds(){
    "use strict";

    var publicAPI,
        birdWidth = 1,
        hitAreas,
        frames,
        frameWidth = 400,
        frameHeight = 400,
        objectPools;

    objectPools = {
        birds: []
    };

    hitAreas = [
        { x1: 50, y1: 100, x2: 350, y2: 300, },
    ];

    frames = [
        { src: "images/birds/frame-1.svg", },
        { src: "images/birds/frame-2.svg", },
        null, // placeholder for side-reference to `bird-1` entry
        { src: "images/birds/frame-3.svg", },
    ];

    // frame side-reference
    frames[2] = frames[0];

    seedObjectPool();

    publicAPI = {
        load: load,
        getBird: getBird,
        setBirdWidth: setBirdWidth,
        recycleBirdObject: recycleBirdObject,
        tick: tick,

    };

    return publicAPI;


    // ******************************

    function load() {
        return Promise.all(
            frames.map(Utils.loadImgOnEntry)
        );
    }

    function generateBird() {
        var bird = {
            tickCount = null,
            frameIdx = null,
            cnv = Browser.createCanvas(),
            ctx = null,
            scaledHitAreas = []
        };

        bird.ctx = bird.cnv.getContext("2d");

        return bird;
    }

    function seedObjectPool() {
        //seed bird pool
        for (var i = 0; i < 5; i++) {
            objectPools.birds.push(generateBird());
        }
    }

    function recycleBirdObject(birdObj) {
        birdObj.tickCount = null,
        birdObj.frameIdx = null;

        objectPools.birds.push(birdObj);
    }

    function setBirdWidth(width) {
        birdWidth = width;
    }

    function getBird() {
        var birdObj;

        // recycle object from object pool
		if (objectPools.birds.length > 0) {
			birdObj = objectPools.birds.shift();
		}
		// create a new object (for the pool)
		else {
			birdObj = generateBird();
		}

        // birdObj.dirty = true;
        birdObj.tickCount = -1;
        birdObj.frameIdx = 0;

        frames.forEach(function eacher(frame,frameIdx){
            scaleBird.call(birdObj, frame,frameIdx,birdWidth);
        });

        var ratio = birdObj.scaledFrames[0].ratio;
        birdObj.scaledHitAreas[0] = birdObj.scaledHitAreas[idx] || {};

        birdObj.scaledHitAreas[0].x1 = hitArea.x1 * ratio;
        birdObj.scaledHitAreas[0].x2 = hitArea.x2 * ratio;
        birdObj.scaledHitAreas[0].y1 = hitArea.y1 * ratio;
        birdObj.scaledHitAreas[0].y2 = hitArea.y2 * ratio;
    }

    function scaleBird(bird,frameIdx,birdWidth) {
        var scaledBird = (this.scaledFrames[frameIdx] = this.scaledFrames[frameIdx] || {});

        if (birdWidth !== scaledBird.birdWidth) {
            if (!scaledBird.cnv) {
                scaledBird.cnv = Browser.createCanvas();
                scaledBird.ctx = scaledBird.cnv.getContext("2d");
            }
            scaledBird.birdWidth = birdWidth;

            // recalculate scaled dimensions
            scaledBird.ratio = scaledBird.birdWidth / frameWidth;
            scaledBird.width = frameWidth * scaledBird.ratio;
            scaledBird.height = frameHeight * scaledBird.ratio;
            scaledBird.originX = scaledBird.width / 2;
            scaledBird.originY = scaledBird.height / 2;

            // update scaled image
            scaledBird.cnv.width = scaledBird.width;
            scaledBird.cnv.height = scaledBird.height;
            scaledBird.ctx.drawImage(
                bird.img,
                0,0,scaledBird.width,scaledBird.height
            );
        }
    }

    function tick(bird) {
        bird.tickCount++;
        if (bird.tickCount == 6) {

            bird.tickCount = 0;
            bird.frameIdx = (bird.frameIdx + 1) % frames.length;

            var frameIdx = bird.frameIdx;
            var scaledBird = bird.scaledFrames[frameIdx];

            scaledBird.ctx.drawImage(
                frames[frameIdx].img,
                0,0,scaledBird.width, scaledBird.height);
        }
    }

})();
