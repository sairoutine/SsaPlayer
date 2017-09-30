'use strict';

var SsPoint = require("./SsPoint");
var Constant = require("./constant");

// 頂点の枠をデバッグ用に表示するかどうか
var VERBOSE = false;

// 特定のパーツだけデバッグ用に表示する
var DebugPartNo = 0;

/*
 * ssaData: SpriteStudio が出力したJSONデータ
 * imageList: SsImageList インスタンス
 */
function SsAnimation(ssaData, imageList) {

	this._ssaData = ssaData;
	this._imageList = imageList;

	this._partsMap = {};

	for (var i = 0; i < ssaData.parts.length; i++) {
		this._partsMap[ssaData.parts[i]] = i;
	}
}

// このアニメーションのFPS
// This animation FPS.
SsAnimation.prototype.getFPS = function () {
	return this._ssaData.fps;
};

// トータルフレーム数を返す
// Get total frame count.
SsAnimation.prototype.getFrameCount = function () {
	return this._ssaData.ssa.length;
};

// パーツリストを返す
// Get parts list.
SsAnimation.prototype.getParts = function () {
	return this._ssaData.parts;
};

// パーツ名からNoを取得するマップを返す
// Return the map, to get the parts from number.
SsAnimation.prototype.getPartsMap = function () {
	return this._partsMap;
};

// 描画メソッド
// Draw method.
SsAnimation.prototype.drawFunc = function (ctx, frameNo, x, y, flipH, flipV, partStates, rootScaleX, rootScaleY) {
	var frameData = this._ssaData.ssa[frameNo];

	for (var refNo = 0; refNo < frameData.length; refNo++) {

		var partData = frameData[refNo];
		var partDataLen = partData.length;

		var partNo = partData[Constant.iPartNo];

		// for debug
		if (DebugPartNo && partNo !== DebugPartNo) continue;

		// 画像
		var img = this._imageList.getImage(partData[Constant.iImageNo]);

		// 切り出し元の位置とサイズ
		var sx = partData[Constant.iSouX];
		var sy = partData[Constant.iSouY];
		var sw = partData[Constant.iSouW];
		var sh = partData[Constant.iSouH];

		// 書き出し位置(TODO: 原点？左上？)
		var dx = x + partData[Constant.iDstX] * rootScaleX;
		var dy = y + partData[Constant.iDstY] * rootScaleY;

		// 書き出し位置(Origin)
		var odx = partData[Constant.iDstX];
		var ody = partData[Constant.iDstY];

		// パーツの位置を更新
		var state = partStates[partNo]; // SsPartState インスタンス
		state.x = dx;
		state.y = dy;

		// NOTE: 切り出しサイズの width or height が 0 なら描画しない
		if (sw <= 0 || sh <= 0) return;

		var dang = partData[Constant.iDstAngle];    // 回転
		var scaleX = partData[Constant.iDstScaleX]; // 拡縮
		var scaleY = partData[Constant.iDstScaleY]; // 〃


		// pivot offset
		var ox = (partDataLen > Constant.iOrgX) ? partData[Constant.iOrgX] : 0;
		var oy = (partDataLen > Constant.iOrgY) ? partData[Constant.iOrgY] : 0;

		// 反転
		var fh = (partDataLen > Constant.iFlipH) ? (partData[Constant.iFlipH] !== 0 ? -1 : 1) : (1);
		var fv = (partDataLen > Constant.iFlipV) ? (partData[Constant.iFlipV] !== 0 ? -1 : 1) : (1);

		var alpha = (partDataLen > Constant.iAlpha) ? partData[Constant.iAlpha] : 1.0;
		var blend = (partDataLen > Constant.iBlend) ? partData[Constant.iBlend] : 0;

		// オフスクリーンレンダリング
		var canvas = document.createElement('canvas');
		canvas.width  = sw;
		canvas.height = sh;
		var ctx2 = canvas.getContext('2d');

		ctx2.globalCompositeOperation = Constant.blendOperations[blend];
		ctx2.globalAlpha = alpha;
		ctx2.translate(sw / 2,sh / 2); 	// パーツの原点へ. To the origin of the parts.

		ctx2.rotate(-dang);
		ctx2.scale(scaleX, scaleY);
		ctx2.translate(0,0); 	// パーツの原点へ. To the origin of the parts.
		ctx2.scale(fh, fv); // パーツの中心点でフリップ. Flip at the center point of the parts.
		ctx2.drawImage(img, sx, sy, sw, sh, -sw/2, -sh/2, sw, sh);

		var ddx = dx - ox * rootScaleX;
		var ddy = dy - oy * rootScaleY;

		// 頂点変形座標
		var t = [
			(partDataLen > Constant.iVertULX) ? partData[Constant.iVertULX] : 0,
			(partDataLen > Constant.iVertULY) ? partData[Constant.iVertULY] : 0,
			(partDataLen > Constant.iVertURX) ? partData[Constant.iVertURX] : 0,
			(partDataLen > Constant.iVertURY) ? partData[Constant.iVertURY] : 0,
			(partDataLen > Constant.iVertDLX) ? partData[Constant.iVertDLX] : 0,
			(partDataLen > Constant.iVertDLY) ? partData[Constant.iVertDLY] : 0,
			(partDataLen > Constant.iVertDRX) ? partData[Constant.iVertDRX] : 0,
			(partDataLen > Constant.iVertDRY) ? partData[Constant.iVertDRY] : 0
		];
		var p = [
			new SsPoint(ddx + t[0],                 ddy + t[1]),
			new SsPoint(sw*rootScaleX + ddx + t[2], ddy + t[3]),
			new SsPoint(ddx + t[4],                 sh*rootScaleY + ddy + t[5]),
			new SsPoint(sw*rootScaleX + ddx + t[6], sh*rootScaleY + ddy + t[7])
		];

		this._drawTriangles(ctx, canvas, p);
	}
};

SsAnimation.prototype._drawTriangles = function(ctx, img, p) {
	var w = img.width;
	var h = img.height;
	//セグメント1
	ctx.save();
	//四角形のパスを描く
	ctx.beginPath();
	ctx.strokeStyle = "yellow";
	ctx.moveTo(p[0].x, p[0].y);
	ctx.lineTo(p[1].x, p[1].y);
	ctx.lineTo(p[3].x, p[3].y);
	ctx.lineTo(p[2].x, p[2].y);
	ctx.closePath();
	//四角形のパス終了

	ctx.clip(); //以下に描画される画像を、これまで描いた四角形でマスクする

	if (VERBOSE) {
		ctx.stroke();
	}

	/*描画空間を変形（変換マトリックスを計算）*/
	var t1=(p[1].x-p[0].x)/w;
	var t2=(p[1].y-p[0].y)/w;
	var t3=(p[2].x-p[0].x)/h;
	var t4=(p[2].y-p[0].y)/h;
	var t5=p[0].x;
	var t6=p[0].y;

	//上記のt1〜t6の計算結果で描画空間を変形させる
	ctx.setTransform(t1,t2,t3,t4,t5,t6);

	//変形した空間に画像（写真）を配置
	ctx.drawImage(img, 0,0);

	ctx.restore(); //クリップ（マスク）領域をリセット

	//セグメント2
	ctx.save();
	// 右下の三角形を描く
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.moveTo(p[1].x, p[1].y);
	ctx.lineTo(p[2].x, p[2].y);
	ctx.lineTo(p[3].x, p[3].y);
	ctx.closePath();
	// 右下の三角形のパス終了

	ctx.clip(); //以下に描画される画像を、これまで描いた三角形でマスクする
	if (VERBOSE) {
		ctx.stroke();
	}

	/*描画空間を変形（変換マトリックスを計算）*/
	t1=(p[3].x-p[2].x)/w;
	t2=(p[3].y-p[2].y)/w;
	t3=(p[3].x-p[1].x)/h;
	t4=(p[3].y-p[1].y)/h;
	t5=p[2].x;
	t6=p[2].y;

	//上記のt1〜t6の計算結果で描画空間を変形させる
	ctx.setTransform(t1,t2,t3,t4,t5,t6);

	//変形した空間に画像（写真）を配置
	ctx.drawImage(img, 0, 0-h);

	ctx.restore(); //クリップ（マスク）領域をリセット

};

module.exports = SsAnimation;
