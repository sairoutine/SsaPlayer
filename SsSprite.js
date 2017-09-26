'use strict';

var SsPartState = require("./SsPartState");

function SsSprite(animation) {

	// プライベート変数
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

// 描画Xポジション
// X position at drawing.
SsSprite.prototype.x = 0;

// 描画Yポジション
// Y position at drawing
SsSprite.prototype.y = 0;

// ※未実装
// *Not implemented.
SsSprite.prototype.flipH = false;
SsSprite.prototype.flipV = false;

// scale
SsSprite.prototype.rootScaleX = 1.0;
SsSprite.prototype.rootScaleY = 1.0;

// アニメーションの設定
// Set animation.
SsSprite.prototype.setAnimation = function (animation) {
	this.inner.animation = animation;
	this.inner.initPartStates();
	this.inner.playingFrame = 0;
	this.inner.prevDrawnTime = 0;
	this.clearLoopCount();
}

// アニメーションの取得
// Get animation.
SsSprite.prototype.getAnimation = function () {
	return this.inner.animation;
}

// 再生フレームNoを設定
// Set frame no of playing.
SsSprite.prototype.setFrameNo = function (frameNo) {
	this.inner.playingFrame = frameNo;
	this.inner.prevDrawnTime = 0;
}

// 再生フレームNoを取得
// Get frame no of playing.
SsSprite.prototype.getFrameNo = function () {
	return this.inner.playingFrame >> 0;
}

// 再生スピードを設定 (1:標準)
// Set speed to play. (1:normal speed)
SsSprite.prototype.setStep = function (step) {
	this.inner.step = step;
}

// 再生スピードを取得
// Get speed to play. (1:normal speed)
SsSprite.prototype.getStep = function () {
	return this.inner.step;
}

// ループ回数の設定 (0:無限)
// Set a playback loop count.  (0:infinite)
SsSprite.prototype.setLoop = function (loop) {
	if (loop < 0) return;
	this.inner.loop = loop;
}

// ループ回数の設定を取得
// Get a playback loop count of specified. (0:infinite)
SsSprite.prototype.getLoop = function () {
	return this.inner.loop;
}

// 現在の再生回数を取得
// Get repeat count a playback.
SsSprite.prototype.getLoopCount = function () {
	return this.inner.loopCount;
}

// 現在の再生回数をクリア
// Clear repeat count a playback.
SsSprite.prototype.clearLoopCount = function () {
	this.inner.loopCount = 0;
}

// アニメーション終了時のコールバックを設定
// Set the call back at the end of animation.
SsSprite.prototype.setEndCallBack = function (func) {
	this.inner.endCallBack = func;
}

// パーツの状態（現在のX,Y座標など）を取得
// Gets the state of the parts. (Current x and y positions)
SsSprite.prototype.getPartState = function (name) {
	if (this.inner.partStates == null) return null;

	var partsMap = this.inner.animation.getPartsMap();
	var partNo = partsMap[name];
	if (partNo == null) return null;
	return this.inner.partStates[partNo];
}

// 描画実行
// Drawing method.
SsSprite.prototype.draw = function (ctx, currentTime) {

	if (this.inner.animation == null) return;

	if (this.inner.loop == 0 || this.inner.loop > this.inner.loopCount) {
		// フレームを進める
		// To next frame.
		if (this.inner.prevDrawnTime > 0) {

			var s = (currentTime - this.inner.prevDrawnTime) / (1000 / this.inner.animation.getFPS());
			this.inner.playingFrame += s * this.inner.step;

			var c = (this.inner.playingFrame / this.inner.animation.getFrameCount()) >> 0;

			if (this.inner.step >= 0) {
				if (this.inner.playingFrame >= this.inner.animation.getFrameCount()) {
					// ループ回数更新
					// Update repeat count.
					this.inner.loopCount += c;
					if (this.inner.loop == 0 || this.inner.loopCount < this.inner.loop) {
						// フレーム番号更新、再生を続ける
						// Update frame no, and playing.
						this.inner.playingFrame %= this.inner.animation.getFrameCount();
					}
					else {
						// 再生停止、最終フレームへ
						// Stop animation, to last frame.
						this.inner.playingFrame = this.inner.animation.getFrameCount() - 1;
						// 停止時コールバック呼び出し
						// Call finished callback.
						if (this.inner.endCallBack != null) {
							this.inner.endCallBack();
						}
					}
				}
			}
			else {
				if (this.inner.playingFrame < 0) {
					// ループ回数更新
					// Update repeat count.
					this.inner.loopCount += 1 + -c;
					if (this.inner.loop == 0 || this.inner.loopCount < this.inner.loop) {
						// フレーム番号更新、再生を続ける
						// Update frame no, and playing.
						this.inner.playingFrame %= this.inner.animation.getFrameCount();
						if (this.inner.playingFrame < 0) this.inner.playingFrame += this.inner.animation.getFrameCount();
					}
					else {
						// 再生停止、先頭フレームへ
						// Stop animation, to first frame.
						this.inner.playingFrame = 0;
						// 停止時コールバック呼び出し
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
	//	// 再生停止
	//	// Stop animation.
	//	this.inner.playingFrame = 0;
	//}

	this.inner.prevDrawnTime = currentTime;

	this.inner.animation.drawFunc(ctx, this.getFrameNo(), this.x, this.y, this.flipH, this.flipV, this.inner.partStates, this.rootScaleX, this.rootScaleY);
}

module.exports = SsSprite;
