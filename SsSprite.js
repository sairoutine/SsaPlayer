'use strict';

var SsPartState = require("./SsPartState");

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

module.exports = SsSprite;
