'use strict';

var SsPartState = require("./SsPartState");

function SsSprite(animation) {
	// 描画Xポジション
	// X position at drawing.
	this.x = 0;

	// 描画Yポジション
	// Y position at drawing
	this.y = 0;

	// ※未実装
	// *Not implemented.
	this.flipH = false;
	this.flipV = false;

	// scale
	this.rootScaleX = 1.0;
	this.rootScaleY = 1.0;


	// プライベート変数
	// Private variables.
	this._inner = {
		// 再生スピード
		step: 1,
		// ループ回数(0: infinite)
		loop: 0,

		// SsAnimation インスタンス
		animation: animation,
		// 再生フレームNo
		playingFrame: 0,
		// 前回描画したときの時刻(ミリ秒)(new Date().getTime() の値)
		prevDrawnTime: 0,
		// 何回ループしたか
		loopCount: 0,
		// draw end callback
		endCallBack: null,

		partStates: null,
	};

	this._initPartStates();
}

// アニメーションの設定
// Set animation.
SsSprite.prototype.setAnimation = function (animation) {
	this._inner.animation = animation;
	this._initPartStates();
	this._inner.playingFrame = 0;
	this._inner.prevDrawnTime = 0;
	this.clearLoopCount();
};

// アニメーションの取得
// Get animation.
SsSprite.prototype.getAnimation = function () {
	return this._inner.animation;
};

// 再生フレームNoを設定
// Set frame no of playing.
SsSprite.prototype.setFrameNo = function (frameNo) {
	this._inner.playingFrame = frameNo;
	this._inner.prevDrawnTime = 0;
};

// 再生フレームNoを取得
// Get frame no of playing.
SsSprite.prototype.getFrameNo = function () {
	return this._inner.playingFrame >> 0;
};

// 再生スピードを設定 (1:標準)
// Set speed to play. (1:normal speed)
SsSprite.prototype.setStep = function (step) {
	this._inner.step = step;
};

// 再生スピードを取得
// Get speed to play. (1:normal speed)
SsSprite.prototype.getStep = function () {
	return this._inner.step;
};

// ループ回数の設定 (0:無限)
// Set a playback loop count.  (0:infinite)
SsSprite.prototype.setLoop = function (loop) {
	if (loop < 0) return;
	this._inner.loop = loop;
};

// ループ回数の設定を取得
// Get a playback loop count of specified. (0:infinite)
SsSprite.prototype.getLoop = function () {
	return this._inner.loop;
};

// 現在の再生回数を取得
// Get repeat count a playback.
SsSprite.prototype.getLoopCount = function () {
	return this._inner.loopCount;
};

// 現在の再生回数をクリア
// Clear repeat count a playback.
SsSprite.prototype.clearLoopCount = function () {
	this._inner.loopCount = 0;
};

// アニメーション終了時のコールバックを設定
// Set the call back at the end of animation.
SsSprite.prototype.setEndCallBack = function (func) {
	this._inner.endCallBack = func;
};

// パーツの状態（現在のX,Y座標など）を取得
// Gets the state of the parts. (Current x and y positions)
SsSprite.prototype.getPartState = function (name) {
	if (this._inner.partStates === null) return null;

	var partsMap = this._inner.animation.getPartsMap();
	var partNo = partsMap[name];
	if (!partNo) return null;
	return this._inner.partStates[partNo];
};

// 描画実行
// Drawing method.
SsSprite.prototype.draw = function (ctx, currentTime) {

	if (!this._inner.animation) return;

	if (this._inner.loop === 0 || this._inner.loop > this._inner.loopCount) {
		// フレームを進める
		// To next frame.
		if (this._inner.prevDrawnTime > 0) {

			var s = (currentTime - this._inner.prevDrawnTime) / (1000 / this._inner.animation.getFPS());
			this._inner.playingFrame += s * this._inner.step;

			var c = (this._inner.playingFrame / this._inner.animation.getFrameCount()) >> 0;

			if (this._inner.step >= 0) {
				if (this._inner.playingFrame >= this._inner.animation.getFrameCount()) {
					// ループ回数更新
					// Update repeat count.
					this._inner.loopCount += c;
					if (this._inner.loop === 0 || this._inner.loopCount < this._inner.loop) {
						// フレーム番号更新、再生を続ける
						// Update frame no, and playing.
						this._inner.playingFrame %= this._inner.animation.getFrameCount();
					}
					else {
						// 再生停止、最終フレームへ
						// Stop animation, to last frame.
						this._inner.playingFrame = this._inner.animation.getFrameCount() - 1;
						// 停止時コールバック呼び出し
						// Call finished callback.
						if (this._inner.endCallBack) {
							this._inner.endCallBack();
						}
					}
				}
			}
			else {
				if (this._inner.playingFrame < 0) {
					// ループ回数更新
					// Update repeat count.
					this._inner.loopCount += 1 + -c;
					if (this._inner.loop === 0 || this._inner.loopCount < this._inner.loop) {
						// フレーム番号更新、再生を続ける
						// Update frame no, and playing.
						this._inner.playingFrame %= this._inner.animation.getFrameCount();
						if (this._inner.playingFrame < 0) this._inner.playingFrame += this._inner.animation.getFrameCount();
					}
					else {
						// 再生停止、先頭フレームへ
						// Stop animation, to first frame.
						this._inner.playingFrame = 0;
						// 停止時コールバック呼び出し
						// Call finished callback.
						if (this._inner.endCallBack) {
							this._inner.endCallBack();
						}
					}
				}
			}

		}
	}
	//else {
	//	// 再生停止
	//	// Stop animation.
	//	this._inner.playingFrame = 0;
	//}

	this._inner.prevDrawnTime = currentTime;

	this._inner.animation.drawFunc(ctx, this.getFrameNo(), this.x, this.y, this.flipH, this.flipV, this._inner.partStates, this.rootScaleX, this.rootScaleY);
};

SsSprite.prototype._initPartStates = function () {
	this._inner.partStates = null;
	if (this._inner.animation) {
		var parts = this._inner.animation.getParts();
		var states = [];
		for (var i = 0; i < parts.length; i++) {
			states.push(new SsPartState(parts[i]));
		}
		this._inner.partStates = states;
	}
};





module.exports = SsSprite;
