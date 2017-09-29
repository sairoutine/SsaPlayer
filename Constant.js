'use strict';

var Constant = {
	// part ID
	iPartNo:    0,
	// reference image ID
	iImageNo:   1,
	// source rect-Left
	iSouX:      2,
	// source rect-Top
	iSouY:      3,
	// source rect-Width
	iSouW:      4,
	// source rect-Height
	iSouH:      5,
	// position-X
	iDstX:      6,
	// position-Y
	iDstY:      7,
	// angle (=Z axis rotation)
	iDstAngle:  8,
	// scale-X
	iDstScaleX: 9,
	// scale-Y
	iDstScaleY: 10,
	// pivot offset-X      default=0
	iOrgX:      11,
	// pivot offset-Y      default=0
	iOrgY:      12,
	// flip-H              defalut=false
	iFlipH:     13,
	// flip-V              defalut=false
	iFlipV:     14,
	// opacity             default=1.0
	iAlpha:     15,
	// alpha blend type    default=mix
	iBlend:     16,
	// vertex deformation-LeftTop-X
	iVertULX:   17,
	// vertex deformation-LeftTop-Y
	iVertULY:   18,
	// vertex deformation-RightTop-X
	iVertURX:   19,
	// vertex deformation-RightTop-Y
	iVertURY:   20,
	// vertex deformation-LeftBottom-X
	iVertDLX:   21,
	// vertex deformation-LeftBottom-Y
	iVertDLY:   22,
	// vertex deformation-RightBottom-X
	iVertDRX:   23,
	// vertex deformation-RightBottom-Y
	iVertDRY:   24,

	blendOperations: [
		"source-over",
		"source-over",
		"lighter",
		"source-over"
	],
};
module.exports = Constant;
