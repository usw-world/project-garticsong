<script>
    /* Socket io test area >> */
    import { io } from 'socket.io-client';

    const socket = io("http://192.168.219.101:2023/");
    
    const ConnectAnother = () => {
        MakeCall();
    }
    const configuration = {'iceServers': [
        {
            'urls':['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']
        },
    ]};
    const peerConnection = new RTCPeerConnection();

    peerConnection.addEventListener("icecandidate", event => {
        console.log("Ice event", event);
        socket.emit({'newIceCandidate': event.candidate});
    })
    peerConnection.addEventListener('connectionstatechange', event => {
        console.log(peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
            console.log(peerConnection);
        }
    });

    console.log(peerConnection.getConfiguration(configuration));
    // peerConnection.setConfiguration(configuration);
    

    const MakeCall = async () => {
        socket.on("iceCandidate", async payload => {
            try {
                await peerConnection.addIceCandidate(payload);
                console.log(peerConnection);
            } catch (error) {
                console.error('Error adding received ice candidate', e);
            }
        })
        // console.log(peerConnection.getConfiguration(configuration));
        // peerConnection.setConfiguration(configuration);
        
        socket.on("answer", async payload => {
            const remoteDesc = new RTCSessionDescription(payload);
            await peerConnection.setRemoteDescription(remoteDesc);
            console.log("Receive answer.");
            console.log(peerConnection.getConfiguration(configuration));
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", {"offer": offer});
    }

    const Serve = async () => {
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
        <button class="do-serve" on:click="{Serve}">SERVE</button>
    </div>
</main>