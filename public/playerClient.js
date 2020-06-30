function AutoSwitcher(player, profiles) {
	this.player = player;
	this.profiles = profiles;
	this.check_interval =  null;
	this.bitrate = 0;
}

AutoSwitcher.prototype.pause = function() {
	if(this.check_interval) {
		clearInterval(this.check_interval);
		delete this.check_interval;
	}
}

AutoSwitcher.prototype.resume = function() {
	this.current_layer = this.profiles.length - 1;
	this.check_interval = setInterval(() => {
		// console.log("bandwidth", this.bitrate);
		if(this.profiles[this.current_layer] * 0.9 > this.bitrate) { //network slow -> scale up to higher compress
			// console.log("Network slow:", this.current_layer, this.profiles[this.current_layer], this.bitrate, this.profiles, " -> finding new layer");
			for(let i = this.current_layer + 1; i < this.profiles.length; i++) {
				if(this.profiles[i] * 1.1 < this.bitrate ) { //find first match layer
					this.current_layer = i;
					this.player._internalSwitchQualityLevel(i);
					// console.log("	will using lower bitrate ", this.current_layer, this.profiles[this.current_layer]);
					break;
				} 
			}
		} else if(this.current_layer > 0 && this.profiles[this.current_layer - 1] * 1.1 < this.bitrate) { //will scale up
			// console.log("Network fast:", this.current_layer, this.profiles[this.current_layer - 1], this.bitrate, this.profiles, " -> finding new layer");
			let new_layer;
			for(let i = this.current_layer - 1; i >= 0; i--) {
				if(this.profiles[i] * 1.1 > this.bitrate) {
					break;
				}
				new_layer = i;
			}
			if(new_layer < this.current_layer) {
				this.current_layer = new_layer;
				this.player._internalSwitchQualityLevel(new_layer);
				// console.log("	will using higher bitrate ", this.current_layer, this.profiles[this.current_layer]);
			}
		}
	}, 2000);
}

AutoSwitcher.prototype.setBitrate = function(bitrate) {
	this.bitrate = bitrate;
}

let playerClient = function(id, wsConfig, playerConfig){
	this.timeNoData = 0;
	this.pingPongInterval = null;
	this.force_update_delta = false;
	this.url = wsConfig.url;
	this.last_ts = 0;
	this.delta_time = -1;
	this.frame_count = 0;
	this.playing = true;
	this.connected = false;
	this.ttl = 0;
	this.bandwidth = 1000000; //bootstrap 1mbs
	this.auto_switcher = null;
	this.timerInterval = null;

	/* H264 Part */
	this.player = new Player(playerConfig, (event, data) => {
		if(event == "DELAY_LIMITED") {
			this.force_update_delta = true;
		}
		if(event == "DELAYED"){
			this.DELAYED();
		}
		if(event == "LIVED"){
			this.LIVED();
		}
		if(event == "DELAY"){
			this.NOW_DELAY(data.nowDelay);
		}
	});
	if(window.debugMode){
		this.debug = new Debugger();
		this.player.onPictureDecoded = (buffer, width, height, infos) => {
			this.debug.frame(width, height);
		}
	}
	if(id){
		this.playerElement = document.getElementById(id);
		this.playerElement.appendChild(this.player.canvas);
	}

	return this;
}

playerClient.prototype.isPlaying = function(){
	return this.playing;
}

playerClient.prototype.pause = function(){
	this.playing = false;
}

playerClient.prototype.play = function(){
	this.playing = true;
}

playerClient.prototype.toLive = function(){
	if(this.ws && this.ws.readyState === 1){
		// console.log("back to live");
		this.ws.send("LIVE:");
		this.player.reinitDecoder();
	}
}

playerClient.prototype.splitFrames = function(msg) {
	if(typeof msg.data == 'string') {
		this.onCommand(msg.data);
		return;
	}

	if(msg.data.byteLength == 0) {
		// console.warn("why zero???");
		return;
	}
	
	let dataView = new DataView(msg.data);
	let ptr = 0;
	let count = 0;
	//console.log("Split frames:", msg.data.byteLength);
	while(count++ < 20) {
		//console.log(" Check frame:", ptr, '/', msg.data.byteLength);
		let frame_size = dataView.getUint32(ptr);
		ptr += 4;
		let frame_data = msg.data.slice(ptr, ptr + frame_size);
		if(window.debugMode){ 
			this.debug.nal(frame_size); 
		}
		//console.log("	Now frame:", ptr, frame_data.byteLength, '/', msg.data.byteLength);
		ptr += frame_size;
		this.extractTimeStamp({data: frame_data}, ptr >= msg.data.byteLength);
		if(ptr >= msg.data.byteLength)
			break;
	 }
}

playerClient.prototype.extractTimeStamp = function(msg, is_new) {
	this.timer(0, true);
	let data = new Uint8Array(msg.data);
	let dataView = new DataView(msg.data);

	let timestamp = dataView.getUint32(0);
	this.frame_count++;
	if(this.force_update_delta == true || this.delta_time < 0 || (is_new && (this.frame_count > 60*30 || Math.abs(timestamp - this.last_ts) > 200))) { //auto reset delta_time
		this.force_update_delta = false;
		let new_delta_time = new Date().getTime() - timestamp;
		// console.log("Adjusted delta_time:", this.delta_time, 'vs', new_delta_time, '->', new_delta_time - this.delta_time);
		this.delta_time = new_delta_time;
		this.frame_count = 0;
	}
	this.last_ts = timestamp;
	timestamp += this.delta_time;

	let seq = dataView.getUint32(4);
	let frameType = data[8];
	let frameData = data.slice(9);
	//console.log("timestamp", timestamp, seq, frameType, frameData);
	this.onFrameData(frameType, frameData, timestamp, seq);
}

playerClient.prototype.updateDebugView = function(element){
	if(window.debugMode)
		element.innerHTML = this.debug.updateView();
}

playerClient.prototype.timer = function(timeInterval, isMessage){
	   if(isMessage){
		   this.timeNoData = 0;
		   this.onMessage();
		   return;
	   }
	   this.timeNoData += timeInterval;
	   if(this.timeNoData >= 3000){
		   this.delta_time = -1;
		this.noMessage();
	   }
	   
}

playerClient.prototype.onFrameData = function(frameType, frameData, timestamp, seq) { //frameData is Uint8Array
	if(this.playing){
		//console.log("Frame:", frameType, frameData.length, timestamp, seq);
		if(frameType == 2){ //video
			this.player.decode(frameData, {ts: timestamp});
		}
	}
}

playerClient.prototype.onCommand = function(cmd) {
	// console.log("onCommand:", cmd);
	if(cmd.startsWith('MEASURE_RES1:')) { //for ttl
		let sent_time = parseInt(cmd.split(':')[1]);
		this.ttl = new Date().getTime() - sent_time;
		// console.log("Update ttl:", this.ttl);
	} else if(cmd.startsWith('MEASURE_RES2:')) { //for ttl
		let parts = cmd.split(':');
		let server_wait_res = parseInt(parts[1]);
		let sent_time = parseInt(parts[2]);
		let packet_size = parseInt(parts[3]);
		let all_time = new Date().getTime() - sent_time;

		let packet_send_cost = all_time - server_wait_res - this.ttl / 2;
		this.bandwidth = packet_size * 8 * 1000 / packet_send_cost;
		this.auto_switcher.setBitrate(this.bandwidth);
		// console.log("Speed: ", all_time, this.ttl, server_wait_res, packet_size, '->', this.bandwidth);
	} else if(cmd.startsWith('SWITCH_LAYER:')){
		this.player.reinitDecoder();
		this.CHANGED_QUALITY();
	}
}

playerClient.prototype.connect = function(){
	return new Promise((resolve, reject) => {
		let ws = new WebSocket(this.url);
		this.ws = ws;
		ws.binaryType = 'arraybuffer';
		ws.onopen = (e) => {
			// console.log('websocket connected')
			this.connected = true;
			this.auto_switcher = new AutoSwitcher(this, [800000, 400000, 200000]);
			this.auto_switcher.setBitrate(this.bandwidth);
			this.switchQualityLevel(-1); //default is auto select
			if(this.pingPongInterval){
				clearInterval(this.pingPongInterval);
				this.pingPongInterval = null;
			}
			this.pingPongInterval = setInterval(() => {
				this.mearsueBandwidth();
			},3000);
			ws.onmessage = this.splitFrames.bind(this);
			this.timerInterval = setInterval(() => {
				this.timer(300);
			}, 300)
			resolve();
		}
		ws.onclose = (e) => {
			clearInterval(this.timerInterval);
			this.connected = false;
			this.auto_switcher = null;
			if(this.pingPongInterval){
				clearInterval(this.pingPongInterval);
				this.pingPongInterval = null;
			}
			// console.log("on close ",e);
			this.reconnect();
			reject(e);
			// reconnect();
		}
		ws.onerror = (e) => {
			clearInterval(this.timerInterval);
			this.connected = false;
			this.auto_switcher = null;
			if(this.pingPongInterval){
				clearInterval(this.pingPongInterval);
				this.pingPongInterval = null;
			}
			// console.log(e);
			reject(e);
		}
	})
}

playerClient.prototype.reconnect = function(){
	// console.log("try to reconnect");
	setTimeout(() => {
		this.connect();
	}, 5000);
}

playerClient.prototype.getCanvasObject = function(){
	return this.player.canvas;
}
playerClient.prototype.onMessage = function(){};
playerClient.prototype.noMessage = function(){};
playerClient.prototype.CHANGING_QUALITY = function(nextLevel){};
playerClient.prototype.CHANGED_QUALITY  = function(){};
playerClient.prototype.DELAYED = function(){};
playerClient.prototype.NOW_DELAY = function(nowDelay){};
playerClient.prototype.LIVED = function(){};
playerClient.prototype.switchQualityLevel = function(level) {
	if(level >= 0) {
		this.auto_switcher.pause();
		return this._internalSwitchQualityLevel(level);
	} else {
		this.auto_switcher.pause();
		this.auto_switcher.resume();
		return true;
	}
}

playerClient.prototype._internalSwitchQualityLevel = function(level) {
	if(this.ws.readyState === 1){
		this.CHANGING_QUALITY(level);
		this.ws.send('SWITCH:' + level);
		return true;
	}
	else{
		console.log("websocket is not ready...");
		return false;
	}
}

playerClient.prototype.mearsueBandwidth = function() {
	if(this.ws.readyState === 1){
		this.ws.send('MEASURE:' + new Date().getTime());
		return true;
	}
	else{
		console.log("websocket is not ready...");
		return false;
	}
}

playerClient.prototype.closeRoom = function(){
	if(this.player){
		this.player.close();
		this.player = null;
	}

	this.ws.onclose = null;
	this.ws.close();
	this.onMessage = () => {};
	this.noMessage = () => {};
	clearInterval(this.timeInterval);
	clearInterval(this.pingPongInterval);
	this.timerInterval = null;
	this.pingPongInterval = null;
}

window.playerClient = playerClient;
// version 1.2