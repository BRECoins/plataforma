function getAcessoUserMedia(that, callback) {
    try {
        mydevices = []
        navigator.mediaDevices.enumerateDevices().then(devices => {
            //Adiciona todos os devices na lista
            $.each(devices, function (index, items) {
                if (items.kind == "videoinput") {
                    mydevices.push(items);
                }
            })
        }).then(function () {
			//debugger
            //se for linux ja volta o default
            if (navigator.userAgent.toLowerCase().indexOf("linux") > -1) {
                that.deviceUserMedia = {
                    video: {
                        width: { exact: 640 },
                        height: { exact: 480 }
                    }
                }
                callback(that.deviceUserMedia);
                return
            }

            if (that.options.cameraType == 'normal') {
                //Se for a camera normal tenta seta a logitec 720p 

                if (mydevices.length == 0) {
                    vertical_padding = Math.floor(that.view_height * 0.2);
                    horizontal_padding = Math.floor(that.view_width * 0.2);
                    that.message = document.createElement("div");
                    that.message["class"] = "message";
                    that.message.style.width = "100%";
                    that.message.style.height = "100%";
                    JpegCamera._add_prefixed_style(that.message, "boxSizing", "border-box");
                    that.message.style.overflow = "hidden";
                    that.message.style.textAlign = "center";
                    that.message.style.paddingTop = "" + vertical_padding + "px";
                    that.message.style.paddingBottom = "" + vertical_padding + "px";
                    that.message.style.paddingLeft = "" + horizontal_padding + "px";
                    that.message.style.paddingRight = "" + horizontal_padding + "px";
                    that.message.style.position = "absolute";
                    that.message.style.zIndex = 3;
                    if (that.options.cameraType == "normal")
                        that.message.innerHTML = "Nenhum dispositivo conectado. Verifique as conexões e tente novamente";
                    that.container.appendChild(that.message);
                    return
                }

                var camera = mydevices.find(device => device.label.toLowerCase().indexOf("logitech") >= 0 && device.kind == "videoinput");
                if (camera) {
                    if (that.options.orientation == 'landscape') {
                        if (that.options.baseResolution == 'vga') {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 640 },
                                    height: { exact: 480 }
                                }
                            }
                        } else {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 1280 },
                                    height: { exact: 720 }
                                }
                            }
                        }

                    } else {
                        if (that.options.baseResolution == 'vga') {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 480 },
                                    height: { exact: 640 }
                                }
                            }
                        } else {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 640 },
                                    height: { exact: 480 }
                                }
                            }
                        }
                    }
                } else {
                    var camera = mydevices.find(device =>  device.kind == "videoinput");
                    if (that.options.orientation == 'landscape') {
                        if (that.options.baseResolution == 'vga') {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 640 },
                                    height: { exact: 480 }
                                }
                            }
                        } else {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 1280 },
                                    height: { exact: 720 }
                                }
                            }
                        }
                    } else {
                        if (that.options.baseResolution == 'vga') {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 480 },
                                    height: { exact: 640 }
                                }
                            }
                        } else {
                            that.deviceUserMedia = {
                                video: {
                                    deviceId: { exact: camera.deviceId },
                                    width: { exact: 640 },
                                    height: { exact: 480 }
                                }
                            }
                        }
                    }

                }

            } else if (that.options.cameraType == 'infrared') {
                //Se for a camera infrared tenta setar a webcam de resolução menor
                //debugger
                var camera
                if (that.options.devices_in_use && that.options.devices_in_use.length > 0) {
                    camera = mydevices.find(device => device.deviceId != that.options.devices_in_use[0].video.deviceId.exact && device.kind == "videoinput");
                } else {
                    camera = mydevices.find(device =>  device.kind == "videoinput");
                }

                if (camera == null) {
                    console.log("Camera IR não identificada")
                    callback();
                    return
                }

                that.deviceUserMedia = {
                    video: {
                        deviceId: { exact: camera.deviceId },
                        width: { exact: 640 },
                        height: { exact: 480 }
                    }
                }
            }

            if (that.deviceUserMedia == null) {
                //debugger
                that.deviceUserMedia = {
                    video: {
                        optional: [
                          {
                              minWidth: 1280
                          }, {
                              minWidth: 640
                          }, {
                              minWidth: 480
                          }, {
                              minWidth: 360
                          }
                        ]
                    }
                }
            }

            callback(that.deviceUserMedia);
        })
    } catch (ex) {
        callback();
    }
}

function getDevices(callback) {
	if (navigator.userAgent.toLowerCase().indexOf("linux") == -1) {
		try {
			mydevices = [];
			navigator.mediaDevices.enumerateDevices().then(devices => {
				//Adiciona todos os devices na lista
				$.each(devices, function (index, items) {
					if (items.kind == "videoinput") {
						mydevices.push(items);
					}
				})
			}).then(function () {
				callback(mydevices);
			})
		} catch (ex) {
			callback(mydevices);
		}
	}else{
		callback()
	}
    
}