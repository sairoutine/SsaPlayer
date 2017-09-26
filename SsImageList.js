'use strict';

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

module.exports = SsImageList;
