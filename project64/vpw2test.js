console.log("freem's Test Script for VPW2")

/* Begin Settings Block */
// Determine if calls to LoadFile should be logged.
var ENABLE_LOADFILE_LOGGING = false

// Determine if calls to LoadDataDMA should be logged.
var ENABLE_LOADDATA_DMA_LOGGING = false

// Determine how many bytes an "interesting" DMA transfer takes.
var LOADDATA_DMA_THRESHOLD = 1024

var ENABLE_MOVESET_UNPACK_LOGGING = false
/* End Settings Block */

const JAL_LOADFILE = 0x0C000FA2

events.onopcode(ADDR_ANY, JAL_LOADFILE, function(pc){
	if(ENABLE_LOADFILE_LOGGING == true){
		console.log("LoadFile called from " + pc.hex())
	}
})

// LoadDataDMA
events.onexec(0x80000660, function(){
	if(ENABLE_LOADDATA_DMA_LOGGING == true && gpr.a2 >= LOADDATA_DMA_THRESHOLD){
		console.log("LoadDataDMA($a0/romLoc=" + gpr.a0.hex() + ", $a1/ramLoc=" + gpr.a1.hex() + ", $a2/size=" + gpr.a2.hex() + ")")
	}
})

// LoadFile
events.onexec(0x80003E88, function(){
	if(ENABLE_LOADFILE_LOGGING == true){
		console.log("LoadFile($a0=" + gpr.a0.hex() + ", $a1/fileID=" + gpr.a1.hex(4) + ", $a2/destAddr=" + gpr.a2.hex() + ")")
	}

	/*if(gpr.a1 >= 0x34C && gpr.a1 <= 0x357){*/
	if(gpr.a1 == 0x008B){
		console.log("LoadFile($a0=" + gpr.a0.hex() + ", $a1/fileID=" + gpr.a1.hex(4) + ", $a2/destAddr=" + gpr.a2.hex() + ")")
		debug.breakhere()
	}
})

/*
events.onexec(0x800051CC, function(){
	if(ENABLE_MOVESET_UNPACK_LOGGING == true){
		console.log("sub_800051CC($a0=" + gpr.a0.hex() + ", $a1=" + gpr.a1.hex(4) + ")")
	}
})
*/

events.onexec(0x80004D60, function(){
	if(ENABLE_MOVESET_UNPACK_LOGGING == true){
		if(gpr.a0 == 0){
			console.log("--------------------------------------------------")
		}
		console.log("sub_80004D60($a0=" + gpr.a0.hex() + ", $a2=" + gpr.a2.hex() + ", $a3=" + gpr.a3.hex() + ")")
	}
})
