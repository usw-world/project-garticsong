<script>
    /* Socket io test area >> */
    import { io } from 'socket.io-client';

    const socket = io("http://10.30.5.129:3000/");


    const ConnectAnother = () => {
        MakeCall();
    }
    const configuration = {'iceServers': [{'urls':'stun:stun.l.google.com:19302'}]};
    const MakeCall = async () => {
        const peerConnection = new RTCPeerConnection(configuration);
        // peerConnection.addEventListener('connectionstatechange', event => {
        //     console.log(peerConnection.connectionState);
        //     if (peerConnection.connectionState === 'connected') {
        //         console.log(peerConnection);
        //     }
        // });
        // peerConnection.addEventListener("icecandidate", event => {
        //     socket.emit({'newIceCandidate': event.candidate});
        // })
        socket.on("answer", async payload => {
            const remoteDesc = new RTCSessionDescription(payload);
            await peerConnection.setRemoteDescription(remoteDesc);
            console.log(peerConnection);
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", {"offer": offer});
    }

    (async () => {
        const peerConnection = new RTCPeerConnection(configuration);
        // peerConnection.addEventListener('connectionstatechange', event => {
        //     console.log(peerConnection.connectionState);
        //     if (peerConnection.connectionState === 'connected') {
        //         console.log(peerConnection);
        //     }
        // });
        socket.on("offer", async payload => {
            peerConnection.setRemoteDescription(new RTCSessionDescription(payload));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            console.log(payload);
            socket.emit("answer", answer);
        })
        // socket.on("iceCandidate", async payload => {
        //     try {
        //         await peerConnection.addIceCandidate(payload);
        //         console.log(peerConnection);
        //     } catch (error) {
        //         console.error('Error adding received ice candidate', e);
        //     }
        // })
    })();
    /* << Socket io test area */
</script>

<main>
    <div class="userinfo">
        <div class="userinfo-name"></div>
        <div class="userinfo-headers"></div>
        <div class="userinfo-body"></div>
        <button class="do-link" on:click="{ConnectAnother}">LINK!!</button>
    </div>
    <div class="serveman">
        <button>Serve!</button>
    </div>
</main>