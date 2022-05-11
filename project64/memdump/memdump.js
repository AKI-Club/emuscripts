/*
 * freem's memory dumper script for project 64
 * Based off of shygoo's work here:
 * https://github.com/shygoo/project64/commit/48a5e1357515302f40e0287bd6c99c18bd90bf2e
 */

var server = new Server({port: 80});
console.log("starting server on port 80...");

server.on('connection', function(socket){
	socket.on('data', function(data){
		/* cheating: shygoo's commented out code splits out method, path, version, etc.
		we're only interested in the query data. Since we're using GET, the parameters
		are a part of the URL, and we need to separate them. */

		var info = data.toString().split(/\n/); // HTTP headers are multiple lines
		var firstLine = info[0].split(" "); // first line contains info we want
		var queryData = firstLine[1].split("?"); // query params start at the '?'
		// check for extra parameters using '&'
		if(queryData[1]){
			queryData = queryData[1].split("&");
		}

		// convert params to table
		var query = {};
		if(queryData.length){
			for(var i in queryData){
				var splitData = queryData[i].split("=");
				query[splitData[0]] = splitData[1];
			}
		}

		//for(var q in query){
		//	console.log(q + " = " + query[q]);
		//}

		// parameters we care about:
		// "start" - memory dump start address
		// "end"   - memory dump end address
		// "filename" (optional) - filename to dump data to
		// ONLY USE HEX ADDRESSES OR I'LL PUNCH YA

		/*
		if(query["start"]){
			console.log("start at 0x"+query["start"]);
		}
		if(query["end"]){
			console.log("end at 0x"+query["end"]);
		}
		*/
		var dataLength = parseInt(query["end"],16)-parseInt(query["start"],16);
		//console.log("data size: " + dataLength + " bytes");

		var dumpData = mem.getblock(parseInt(query["start"],16), dataLength);
		var dataOut = new ArrayBuffer(dumpData);
		var u8arr = new Uint8Array(dataOut);

		// send a response so the web browser doesn't spin forever waiting for a reply
		/*
		var response = "HTTP/1.1 200 OK\r\n"+
			"Content-type: text/html\r\n"+
			"Access-Control-Allow-Origin: *\r\n"+
			"Content-length: 8\r\n"+
			"\r\n200 OKAY, i guess"
		;
		*/

		var outFilename = "output.bin"
		if(query["filename"]){
			outFilename = query["filename"];
		}

		var response = "HTTP/1.1 200 OK\r\n"+
			"Content-type: application/octet-stream\r\n" +
			"Access-Control-Allow-Origin: *\r\n" +
			'Content-disposition: attachment; filename="'+outFilename+'"\r\n'+
			"Content-length: " + u8arr.length + "\r\n" +
			"\r\n"+
			new Buffer(u8arr);
		socket.write(response);
	});
});
