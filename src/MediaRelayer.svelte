<script>
    /* Socket io test area >> */
    import { io } from 'socket.io-client';

    // const socket = io("https://garticsong.herokuapp.com/");
    // const socket = io("http://10.30.5.129:2023");
    const socket = io("http://192.168.219.101:2023");
    
    const ConnectAnother = () => {
        MakeCall();
    }
    const configuration = {'iceServers': [
        {
            'urls':['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']
        },
    ]};
    const peerConnection = new RTCPeerConnection(configuration);
    
    peerConnection.addEventListener("icecandidate", event => {
        socket.emit({'newIceCandidate': event.candidate});
    })
    peerConnection.addEventListener('connectionstatechange', event => {
        console.log(peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
            console.log(peerConnection);
        }
    });

    const GetUserMedia = async () => {
        try {
            const devices = await navigator.mediaDevices.getUserMedia({ "video": false, "audio": true });
            const stream = devices;
            const audioElmt = document.querySelector("audio#localaudio");
            audioElmt.srcObject = stream;
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });
        } catch (error) {
            console.error("Error opening audio device.", error);
        }
    }
    let OnSubmitMessage = () => {
        const channel = peerConnection.createDataChannel("usoock");
        channel.addEventListener("open", event => {
            channel.send("Dragon Usoock!");
        })
        console.log(channel);
    };
    
    const MakeCall = async () => {
        socket.on("iceCandidate", async payload => {
            try {
                await peerConnection.addIceCandidate(payload);
                console.log(peerConnection);
            } catch (error) {
                console.error('Error adding received ice candidate', e);
            }
        })
        socket.on("answer", async payload => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(payload));
            console.log("Receive answer.");
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", {"offer": offer});
    }

    const MakeServe = async () => {
        peerConnection.addEventListener("datachannel", event => {
            console.log("I can Fly!");
            let channel = event.channel;
            channel.onopen = (event) => {
                channel.send("Fly to the sky!");
            };
            channel.onmessage = (event) => {
                console.log(event.data);
            }
        })
            
        socket.on("offer", async payload => {
            peerConnection.setRemoteDescription(new RTCSessionDescription(payload));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            console.log("I receive offer");
            socket.emit("answer", answer);
        });
        socket.on("iceCandidate", async payload => {
            try {
                await peerConnection.addIceCandidate(payload);
                console.log(peerConnection);
            } catch (error) {
                console.error('Error adding received ice candidate', e);
            }
        })
        const audioElmt = document.querySelector("audio#localaudio");
        peerConnection.addEventListener("track", async(event) => {
            const[ remoteStream ] = event.streams;
            audioElmt.srcObject = remoteStream;
        })
        console.log("Get ready to serve");
    };
    /* << Socket io test area */
</script>

<main>
    <div class="userinfo">
        <div class="userinfo-name"></div>
        <div class="userinfo-headers"></div>
        <div class="userinfo-body"></div>
        <button class="do-link" on:click="{ConnectAnother}">LINK</button>
    </div>
    <div class="serveman">
        <button class="do-serve" on:click="{MakeServe}">SERVE</button>
    </div>
    <button class="do-finddevice" on:click="{GetUserMedia}">CONNECT</button><br>
    <audio id="localaudio" autoplay playsinline controls="false" muted></audio><br>
    <form class="messagebox-wrap" on:submit|preventDefault="{OnSubmitMessage}">
        <textarea name="message" id="message" cols="30" rows="5"></textarea><br>
        <input type="submit" value="SEND" />
    </form>
</main>

<style>
    main {
        text-align: center;
    }
    textarea {
        resize: none;
    }
</style>