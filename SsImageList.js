'use strict';

function SsImageList(imageFiles, aFileRoot, loadImmediately, aOnLoadCallBack) {

	// 画像パスのroot
	this._fileRoot = aFileRoot;

	this._imagePaths = [];
	this._images = []; // Image インスタンスの配列

	// ロード完了時に呼ばれるコールバック
	// Callback that is called when the load is finished.
	this._onLoadCallBack = aOnLoadCallBack;

	for (var i = 0; i < imageFiles.length; i++) {
		var path = this._fileRoot + imageFiles[i];

		this._imagePaths.push(path);
		var image = new Image();
		if (loadImmediately) {
			image.onload = this._onLoad.bind(this);
			image.src = path;
		}
		this._images.push(image);
	}
}

// 指定したインデックスのImageを返す
// Get image at specified index.
SsImageList.prototype.getImage = function (index) {
	if (index < 0 || index >= this._images.length) return null;
	return this._images[index];
};

// 指定したインデックスの画像をimagePathで差し替える。
// Replace image of specified index at imagePath.
SsImageList.prototype.setImage = function (index, imagePath) {
	if (index < 0 || index >= this._images.length) return null;
	this._imagePaths[index] = this._fileRoot + imagePath;
	this._images[index].onload = this._onLoad.bind(this);
	this._images[index].src = this._imagePaths[index];
};

// ロード完了時コールバックを設定する
// Set a callback when load is finished.
SsImageList.prototype.setOnLoad = function (cb) {
	this._onLoadCallBack = cb;
};

// 全部読み込まれた場合のみユーザーが設定したコールバックを呼ぶ
// Only when it is all loaded, is called a callback set by the user.
SsImageList.prototype._onLoad = function () {
	for (var image in this._images) {
		if (image !== null && image.complete === false) {
			return;
		}
	}

	if (this._onLoadCallBack) {
		this._onLoadCallBack();
	}
};








module.exports = SsImageList;
