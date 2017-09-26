'use strict';
function SsAnimation(ssaData, imageList) {

	this.ssaData = ssaData;
	this.imageList = imageList;

	this.partsMap = new Array();
	this.parts = ssaData.parts;
	for (var i = 0; i < this.parts.length; i++) {
		this.partsMap[this.parts[i]] = i;
	}
}

// このアニメーションのFPS
// This animation FPS.
SsAnimation.prototype.getFPS = function () {
	return this.ssaData.fps;
}

// トータルフレーム数を返す
// Get total frame count.
SsAnimation.prototype.getFrameCount = function () {
	return this.ssaData.ssa.length;
}

// パーツリストを返す
// Get parts list.
SsAnimation.prototype.getParts = function () {
	return this.ssaData.parts;
}

// パーツ名からNoを取得するマップを返す
// Return the map, to get the parts from number.
SsAnimation.prototype.getPartsMap = function () {
	return this.partsMap;
}

// 描画メソッド
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
			//ctx.setTransform(1, 0, 0, 1, dx, dy); 		// 最終的な表示位置へ. To display the final position.
			//ctx.setTransform(1 * rootScaleX, 0, 0, 1 * rootScaleY, 0, 0); 	// 最終的な表示位置へ. To display the final position.
			ctx.rotate(-dang);
			ctx.scale(scaleX, scaleY);
			ctx.translate(vdw / 2,vdh / 2); 	// パーツの原点へ. To the origin of the parts.
			ctx.scale(fh, fv); 						    	// パーツの中心点でフリップ. Flip at the center point of the parts.

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

			// 頂点変形座標
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

//Pointクラス
function Point (x, y) {
	this.x = x;
	this.y = y;
	return {x:this.x, y:this.y};
}

function drawTriangle (ctx, img, p) {
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
//ctx.stroke();	
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
//ctx.stroke();	
	
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
	
}
	








module.exports = SsAnimation;
