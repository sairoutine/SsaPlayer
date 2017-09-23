//-----------------------------------------------------------
// Ss5ConverterToSSAJSON v1.0.3
//
// Copyright(C) Web Technology Corp.
// http://www.webtech.co.jp/
//
// Ss5ConverterToSSAJSON
// https://github.com/SpriteStudio/Ss5ConverterToSSAJSON/wiki
// ����o�͂���JSON�t�@�C����HTML5�ōĐ�����T���v���v���O�����ł��B
//
//-----------------------------------------------------------

////////////////////////////////////////////////////////////
// SsImageList
////////////////////////////////////////////////////////////

function SsImageList(imageFiles, aFileRoot, loadImmediately, aOnLoad) {

	this.fileRoot = aFileRoot;
	this.imagePaths = new Array();
	this.images = new Array();

	// ���[�h�������ɌĂ΂��R�[���o�b�N
	// Callback that is called when the load is finished.
	this.onLoad = aOnLoad;

	// �S���ǂݍ��܂ꂽ�ꍇ�̂݃��[�U�[���ݒ肵���R�[���o�b�N���Ă�
	// Only when it is all loaded, is called a callback set by the user.
	this.onLoad_ = function () {
		for (var i in this.images)
			if (i != null && i.complete == false)
				return;
		if (this.onLoad != null)
			this.onLoad();
	}

	for (var i = 0; i < imageFiles.length; i++) {
		var path = this.fileRoot + imageFiles[i];
//        console.log(path);
		this.imagePaths.push(path);
		var image = new Image();
		if (loadImmediately)
		{
			image.onload = this.onLoad_;
			image.src = path;
		}
		this.images.push(image);
	}
}

// �w�肵���C���f�b�N�X��Image��Ԃ�
// Get image at specified index.
SsImageList.prototype.getImage = function (index) {
	if (index < 0 || index >= this.images.length) return null;
	return this.images[index];
}

// �w�肵���C���f�b�N�X�̉摜��imagePath�ō����ւ���B
// Replace image of specified index at imagePath.
SsImageList.prototype.setImage = function (index, imagePath) {
	if (index < 0 || index >= this.images.length) return null;
	this.imagePaths[index] = this.fileRoot + imagePath;
	this.images[index].onload = this.onLoad_;
	this.images[index].src = this.imagePaths[index];
}

// ���[�h�������R�[���o�b�N��ݒ肷��
// Set a callback when load is finished.
SsImageList.prototype.setOnLoad = function (cb) {
	this.onLoad = cb;
}


////////////////////////////////////////////////////////////
// SsPartState
////////////////////////////////////////////////////////////

function SsPartState(name) {

	// �p�[�c��
	// Parts name.
	this.name = name;
	// ���݂̕`��X�|�W�V����
	// Current x position at drawing.
	this.x = 0;
	// ���݂̕`��Y�|�W�V����
	// Current x position at drawing.
	this.y = 0;
}


////////////////////////////////////////////////////////////
// SsAnimation
////////////////////////////////////////////////////////////

function SsAnimation(ssaData, imageList) {

	this.ssaData = ssaData;
	this.imageList = imageList;

	this.partsMap = new Array();
	this.parts = ssaData.parts;
	for (var i = 0; i < this.parts.length; i++) {
		this.partsMap[this.parts[i]] = i;
	}
}

// ���̃A�j���[�V������FPS
// This animation FPS.
SsAnimation.prototype.getFPS = function () {
	return this.ssaData.fps;
}

// �g�[�^���t���[������Ԃ�
// Get total frame count.
SsAnimation.prototype.getFrameCount = function () {
	return this.ssaData.ssa.length;
}

// �p�[�c���X�g��Ԃ�
// Get parts list.
SsAnimation.prototype.getParts = function () {
	return this.ssaData.parts;
}

// �p�[�c������No���擾����}�b�v��Ԃ�
// Return the map, to get the parts from number.
SsAnimation.prototype.getPartsMap = function () {
	return this.partsMap;
}

// �`�惁�\�b�h
// Draw method.
SsAnimation.prototype.drawFunc = function (ctx2, frameNo, x, y, flipH, flipV, partStates, rootScaleX, rootScaleY) {

	var iPartNo = 0;
	var iImageNo = 1;
	var iSouX = 2;
	var iSouY = 3;
	var iSouW = 4;
	var iSouH = 5;
	var iDstX = 6;
	var iDstY = 7;
	var iDstAngle = 8;
	var iDstScaleX = 9;
	var iDstScaleY = 10;
	var iOrgX = 11;
	var iOrgY = 12;
	var iFlipH = 13;
	var iFlipV = 14;
	var iAlpha = 15;
	var iBlend = 16;

	var blendOperations = new Array(
		"source-over",
		"source-over",
		"lighter",
		"source-over"
	);

	var frameData = this.ssaData.ssa[frameNo];
	for (var refNo = 0; refNo < frameData.length; refNo++) {

		var partData = frameData[refNo];
		var partDataLen = partData.length;

		var partNo = partData[iPartNo];
		var img = this.imageList.getImage(partData[iImageNo]);
		var sx = partData[iSouX];
		var sy = partData[iSouY];
		var sw = partData[iSouW];
		var sh = partData[iSouH];
		var dx = partData[iDstX] * rootScaleX;
		var dy = partData[iDstY] * rootScaleY;

		var odx = partData[iDstX];
		var ody = partData[iDstY];



		if (partNo != 7) {
			//continue;
		}



		var vdw = sw;
		var vdh = sh;

		dx += x;
		dy += y;

		if (sw > 0 && sh > 0) {
			var dang = partData[iDstAngle];
			var scaleX = partData[iDstScaleX];
			var scaleY = partData[iDstScaleY];

			var ox = (partDataLen > iOrgX) ? partData[iOrgX] : 0;
			var oy = (partDataLen > iOrgY) ? partData[iOrgY] : 0;
			var fh = (partDataLen > iFlipH) ? (partData[iFlipH] != 0 ? -1 : 1) : (1);
			var fv = (partDataLen > iFlipV) ? (partData[iFlipV] != 0 ? -1 : 1) : (1);
			var alpha = (partDataLen > iAlpha) ? partData[iAlpha] : 1.0;
			var blend = (partDataLen > iBlend) ? partData[iBlend] : 0;


			var canvas = document.createElement('canvas');
			var canvas_size = vdw > vdh ? vdw : vdh;
			canvas.width  = canvas_size;
			canvas.height = canvas_size;
			var ctx = canvas.getContext('2d');

			ctx.globalCompositeOperation = blendOperations[blend];
			ctx.globalAlpha = alpha;
			//ctx.setTransform(1, 0, 0, 1, dx, dy); 		// �ŏI�I�ȕ\���ʒu��. To display the final position.
			//ctx.setTransform(1 * rootScaleX, 0, 0, 1 * rootScaleY, 0, 0); 	// �ŏI�I�ȕ\���ʒu��. To display the final position.
			ctx.rotate(-dang);
			ctx.scale(scaleX, scaleY);
			ctx.translate(vdw / 2,vdh / 2); 	// �p�[�c�̌��_��. To the origin of the parts.
			ctx.scale(fh, fv); 						    	// �p�[�c�̒��S�_�Ńt���b�v. Flip at the center point of the parts.

			// check
			//
			//      console.log(sx, sy, sw, sh);
			//      sw = (sx + sw < img.width) ? sw : img.width - sx;
			//      sh = (sy + sh < img.height) ? sh : img.height - sy;
			//      sw = (sw < 0) ? 0 : sw;
			//      sh = (sh < 0) ? 0 : sh;
			//      sx = (sx < 0) ? 0 : sx;
			//      sy = (sy < 0) ? 0 : sy;
			//      console.log(sx, sy, sw, sh);

			ctx.drawImage(img, sx, sy, sw, sh, -vdw/2, -vdh/2, vdw, vdh);
			//ctx2.drawImage(canvas, dx-ox*rootScaleX, dy-oy*rootScaleY);
			//ctx2.drawImage(canvas, 
			var ddx = dx-ox*rootScaleX;
			var ddy = dy-oy*rootScaleY;

			var iVertULX = 17;
			var iVertULY = 18;
			var iVertURX = 19;
			var iVertURY = 20;
			var iVertDLX = 21;
			var iVertDLY = 22;
			var iVertDRX = 23;
			var iVertDRY = 24;

			// ���_�ό`���W
			var t = [
                    (partDataLen > iVertULX) ? partData[iVertULX] : 0,
                    (partDataLen > iVertULY) ? partData[iVertULY] : 0,
                    (partDataLen > iVertURX) ? partData[iVertURX] : 0,
                    (partDataLen > iVertURY) ? partData[iVertURY] : 0,
                    (partDataLen > iVertDLX) ? partData[iVertDLX] : 0,
                    (partDataLen > iVertDLY) ? partData[iVertDLY] : 0,
                    (partDataLen > iVertDRX) ? partData[iVertDRX] : 0,
                    (partDataLen > iVertDRY) ? partData[iVertDRY] : 0 ];
			var p = [
				new Point(ddx + t[0],ddy + t[1]),
				new Point(canvas_size*rootScaleX + ddx + t[2], ddy + t[3]),
				new Point(ddx + t[4], canvas_size*rootScaleY + ddy + t[5]),
				new Point(canvas_size*rootScaleX + ddx + t[6], canvas_size*rootScaleY + ddy + t[7])
			];
			/*
			var p = [
				new Point(0 + partData[17],0 + partData[18]),
				new Point(1000 + partData[19], 0 + partData[20]),
				new Point(0 + partData[21], 1000 + partData[22]),
				new Point(1000 + partData[23], 1000 + partData[24])
			];
			*/

			drawTriangle(ctx2, canvas, p);
		}

		var state = partStates[partNo];
		state.x = dx;
		state.y = dy;
	}
}


////////////////////////////////////////////////////////////
// SsSprite
////////////////////////////////////////////////////////////

function SsSprite(animation) {

	// �v���C�x�[�g�ϐ�
	// Private variables.
	this.inner = {
		animation: animation,
		playingFrame: 0,
		prevDrawnTime: 0,
		step: 1,
		loop: 0,
		loopCount: 0,
		endCallBack: null,    // draw end callback

		partStates: null,
		initPartStates: function () {
			this.partStates = null;
			if (this.animation != null) {
				var parts = this.animation.getParts();
				var states = new Array();
				for (var i = 0; i < parts.length; i++) {
					states.push(new SsPartState(parts[i]));
				}
				this.partStates = states;
			}
		}
	};

	this.inner.initPartStates();
}

// �`��X�|�W�V����
// X position at drawing.
SsSprite.prototype.x = 0;

// �`��Y�|�W�V����
// Y position at drawing
SsSprite.prototype.y = 0;

// ��������
// *Not implemented.
SsSprite.prototype.flipH = false;
SsSprite.prototype.flipV = false;

// scale
SsSprite.prototype.rootScaleX = 1.0;
SsSprite.prototype.rootScaleY = 1.0;

// �A�j���[�V�����̐ݒ�
// Set animation.
SsSprite.prototype.setAnimation = function (animation) {
	this.inner.animation = animation;
	this.inner.initPartStates();
	this.inner.playingFrame = 0;
	this.inner.prevDrawnTime = 0;
	this.clearLoopCount();
}

// �A�j���[�V�����̎擾
// Get animation.
SsSprite.prototype.getAnimation = function () {
	return this.inner.animation;
}

// �Đ��t���[��No��ݒ�
// Set frame no of playing.
SsSprite.prototype.setFrameNo = function (frameNo) {
	this.inner.playingFrame = frameNo;
	this.inner.prevDrawnTime = 0;
}

// �Đ��t���[��No���擾
// Get frame no of playing.
SsSprite.prototype.getFrameNo = function () {
	return this.inner.playingFrame >> 0;
}

// �Đ��X�s�[�h��ݒ� (1:�W��)
// Set speed to play. (1:normal speed)
SsSprite.prototype.setStep = function (step) {
	this.inner.step = step;
}

// �Đ��X�s�[�h���擾
// Get speed to play. (1:normal speed)
SsSprite.prototype.getStep = function () {
	return this.inner.step;
}

// ���[�v�񐔂̐ݒ� (0:����)
// Set a playback loop count.  (0:infinite)
SsSprite.prototype.setLoop = function (loop) {
	if (loop < 0) return;
	this.inner.loop = loop;
}

// ���[�v�񐔂̐ݒ���擾
// Get a playback loop count of specified. (0:infinite)
SsSprite.prototype.getLoop = function () {
	return this.inner.loop;
}

// ���݂̍Đ��񐔂��擾
// Get repeat count a playback.
SsSprite.prototype.getLoopCount = function () {
	return this.inner.loopCount;
}

// ���݂̍Đ��񐔂��N���A
// Clear repeat count a playback.
SsSprite.prototype.clearLoopCount = function () {
	this.inner.loopCount = 0;
}

// �A�j���[�V�����I�����̃R�[���o�b�N��ݒ�
// Set the call back at the end of animation.
SsSprite.prototype.setEndCallBack = function (func) {
	this.inner.endCallBack = func;
}

// �p�[�c�̏�ԁi���݂�X,Y���W�Ȃǁj���擾
// Gets the state of the parts. (Current x and y positions)
SsSprite.prototype.getPartState = function (name) {
	if (this.inner.partStates == null) return null;

	var partsMap = this.inner.animation.getPartsMap();
	var partNo = partsMap[name];
	if (partNo == null) return null;
	return this.inner.partStates[partNo];
}

// �`����s
// Drawing method.
SsSprite.prototype.draw = function (ctx, currentTime) {

	if (this.inner.animation == null) return;

	if (this.inner.loop == 0 || this.inner.loop > this.inner.loopCount) {
		// �t���[����i�߂�
		// To next frame.
		if (this.inner.prevDrawnTime > 0) {

			var s = (currentTime - this.inner.prevDrawnTime) / (1000 / this.inner.animation.getFPS());
			this.inner.playingFrame += s * this.inner.step;

			var c = (this.inner.playingFrame / this.inner.animation.getFrameCount()) >> 0;

			if (this.inner.step >= 0) {
				if (this.inner.playingFrame >= this.inner.animation.getFrameCount()) {
					// ���[�v�񐔍X�V
					// Update repeat count.
					this.inner.loopCount += c;
					if (this.inner.loop == 0 || this.inner.loopCount < this.inner.loop) {
						// �t���[���ԍ��X�V�A�Đ��𑱂���
						// Update frame no, and playing.
						this.inner.playingFrame %= this.inner.animation.getFrameCount();
					}
					else {
						// �Đ���~�A�ŏI�t���[����
						// Stop animation, to last frame.
						this.inner.playingFrame = this.inner.animation.getFrameCount() - 1;
						// ��~���R�[���o�b�N�Ăяo��
						// Call finished callback.
						if (this.inner.endCallBack != null) {
							this.inner.endCallBack();
						}
					}
				}
			}
			else {
				if (this.inner.playingFrame < 0) {
					// ���[�v�񐔍X�V
					// Update repeat count.
					this.inner.loopCount += 1 + -c;
					if (this.inner.loop == 0 || this.inner.loopCount < this.inner.loop) {
						// �t���[���ԍ��X�V�A�Đ��𑱂���
						// Update frame no, and playing.
						this.inner.playingFrame %= this.inner.animation.getFrameCount();
						if (this.inner.playingFrame < 0) this.inner.playingFrame += this.inner.animation.getFrameCount();
					}
					else {
						// �Đ���~�A�擪�t���[����
						// Stop animation, to first frame.
						this.inner.playingFrame = 0;
						// ��~���R�[���o�b�N�Ăяo��
						// Call finished callback.
						if (this.inner.endCallBack != null) {
							this.inner.endCallBack();
						}
					}
				}
			}

		}
	}
	//else {
	//	// �Đ���~
	//	// Stop animation.
	//	this.inner.playingFrame = 0;
	//}

	this.inner.prevDrawnTime = currentTime;

	this.inner.animation.drawFunc(ctx, this.getFrameNo(), this.x, this.y, this.flipH, this.flipV, this.inner.partStates, this.rootScaleX, this.rootScaleY);
}
	function drawTriangle (ctx, img, p) {
		var w = img.width;
		var h = img.height;
		//�Z�O�����g1
		ctx.save();
		//�l�p�`�̃p�X��`��
		ctx.beginPath();
		ctx.strokeStyle = "yellow";
		ctx.moveTo(p[0].x, p[0].y);
		ctx.lineTo(p[1].x, p[1].y);
		ctx.lineTo(p[3].x, p[3].y);
		ctx.lineTo(p[2].x, p[2].y);
		ctx.closePath();
		//�l�p�`�̃p�X�I��
		
		ctx.clip(); //�ȉ��ɕ`�悳���摜���A����܂ŕ`�����l�p�`�Ń}�X�N����
	//ctx.stroke();	
		/*�`���Ԃ�ό`�i�ϊ��}�g���b�N�X���v�Z�j*/
		var t1=(p[1].x-p[0].x)/w;
		var t2=(p[1].y-p[0].y)/w;
		var t3=(p[2].x-p[0].x)/h; 
		var t4=(p[2].y-p[0].y)/h;
		var t5=p[0].x;
		var t6=p[0].y;
		
		//��L��t1�`t6�̌v�Z���ʂŕ`���Ԃ�ό`������
		ctx.setTransform(t1,t2,t3,t4,t5,t6);
		
		//�ό`������Ԃɉ摜�i�ʐ^�j��z�u
		ctx.drawImage(img, 0,0);
		
		ctx.restore(); //�N���b�v�i�}�X�N�j�̈�����Z�b�g
		
		//�Z�O�����g2
		ctx.save();
		// �E���̎O�p�`��`��
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.moveTo(p[1].x, p[1].y);
		ctx.lineTo(p[2].x, p[2].y);
		ctx.lineTo(p[3].x, p[3].y);
		ctx.closePath();
		// �E���̎O�p�`�̃p�X�I��
		
		ctx.clip(); //�ȉ��ɕ`�悳���摜���A����܂ŕ`�����O�p�`�Ń}�X�N����
	//ctx.stroke();	
		
		/*�`���Ԃ�ό`�i�ϊ��}�g���b�N�X���v�Z�j*/
		t1=(p[3].x-p[2].x)/w;
		t2=(p[3].y-p[2].y)/w;
		t3=(p[3].x-p[1].x)/h;
		t4=(p[3].y-p[1].y)/h;
		t5=p[2].x;
		t6=p[2].y;
		
		//��L��t1�`t6�̌v�Z���ʂŕ`���Ԃ�ό`������
		ctx.setTransform(t1,t2,t3,t4,t5,t6);

		//�ό`������Ԃɉ摜�i�ʐ^�j��z�u
		ctx.drawImage(img, 0, 0-h);
		
		ctx.restore(); //�N���b�v�i�}�X�N�j�̈�����Z�b�g
		
		}
		
		//Point�N���X
		function Point (x, y) {
			this.x = x;
			this.y = y;
			return {x:this.x, y:this.y};
		}
		







module.exports = {
	SsImageList: SsImageList,
	SsAnimation: SsAnimation,
	SsSprite:    SsSprite,
};
