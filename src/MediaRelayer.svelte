<script>
    /* Socket io test area >> */
    import { io } from 'socket.io-client';

    // const socket = io("https://garticsong.herokuapp.com/");
    const socket = io("http://10.30.5.129:2023");
    // const socket = io("http://192.168.219.101:2023");
    const configuration = {'iceServers': [
        {
            'urls':[
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
                "stun:stun.ekiga.net",
                "stun:stun.ideasip.com",
                "stun:stun.rixtelecom.se",
                "stun:stun.schlund.de",
                "stun:stun.stunprotocol.org:3478",
                "stun:stun.voiparound.com",
                "stun:stun.voipbuster.com",
                "stun:stun.voipstunt.com",
                "stun:stun.voxgratia.org",
                'turn:numb.viagenie.ca',
            ],
            username: 'webrtc@live.com',
            credential: 'muazkh',
        },
    ]};
    let isHosting = false;
    let hostConnections = [];
    let guestConnection;
    let dataChannels = [];

    const GetUserMedia = async (stream, peerConnection) => {
        try {
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });
        } catch(error) {
            console.error("Error adding track.", error);
        }
    }
    let OnSubmitMessage = () => {
        console.log(hostConnections);
        dataChannels.forEach(channel => {
            channel.send("usoock");
        });
    };
    
    const MakeHost = async () => {
        // const stream = await navigator.mediaDevices.getUserMedia({ "video": false, "audio": true });
        const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
        console.log("stream", stream.getAudioTracks());
        const audioElmt = document.querySelector("audio#localaudio");
        audioElmt.srcObject = stream;

        socket.on("link", async () => {
            let peerConnection = new RTCPeerConnection(configuration);
            await GetUserMedia(stream, peerConnection);
            hostConnections.push(peerConnection);

            peerConnection.onicecandidate = e => {
                socket.emit("newIceCandidate", e.candidate);
            }

            let channel = await peerConnection.createDataChannel("audio channel");
            channel.onopen = (e) => {
                console.log("Channel is Opened", e);
            };
            channel.onclose = (e) => {
                console.log("Channel is Closed", e);
            };
            dataChannels.push(channel);
 
            socket.on("answer", async desc => {
                peerConnection.setRemoteDescription(desc);
                console.log("Receive answer.");
                socket.off("answer");
            })
            const offer = await peerConnection.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 0 });
            await peerConnection.setLocalDescription(offer);
            socket.emit("offer", offer);
        })
        isHosting = true;

        socket.on("newIceCandidate", (e) => {
            hostConnections.forEach(pc => {
                HandleNewCandidate(pc, e);
            })
        })
    }
    const HandleNewCandidate = (pc, e) => {
        pc.addIceCandidate(e)
        .then(
            () => { console.log("Success adding new ICE Candidate"); },
            (error) => { console.error(error); }
        );
    }

    const Link = async () => {
        guestConnection = new RTCPeerConnection(configuration);
        guestConnection.onicecandidate = (e) => {
            socket.emit("newIceCandidate", e.candidate);
        }
        socket.on("newIceCandidate", e => {
            HandleNewCandidate(guestConnection, e);
        })
        socket.on("offer", async desc => {
            console.log("I receive offer");
            guestConnection.setRemoteDescription(desc);
            const answer = await guestConnection.createAnswer();
            await guestConnection.setLocalDescription(answer);
            
            socket.emit("answer", answer);
            socket.off("offer");
        });
        guestConnection.addEventListener("track", async(event) => {
            const audioElmt = document.querySelector("audio#localaudio");
            console.log("Track Event On");
            // const[ remoteStream ] = event.streams;
            // audioElmt.srcObject = remoteStream;
            audioElmt.srcObject = event.streams[0];
        });
        guestConnection.ondatachannel = (e) => {
            const dataChannel = e.channel;
            console.log("Data Channel Event On");
            dataChannel.onmessage = (e) => {
                console.log("Received Message");
                document.querySelector("#message").value = e.data;
            }
        };
        socket.emit("link");
    };
    /* << Socket io test area */
</script>

<main>
    <div class="userinfo">
        <div class="userinfo-name"></div>
        <div class="userinfo-headers"></div>
        <div class="userinfo-body"></div>
        <button class="do-link" on:click="{MakeHost}">Host Session</button>
    </div>
    <div class="serveman">
        <button class="do-serve" on:click="{Link}">Link into host</button>
    </div>
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