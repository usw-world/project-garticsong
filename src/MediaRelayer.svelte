<script>
    /* Socket io test area >> */
    import { io } from 'socket.io-client';

    const socket = io("http://10.30.5.129:3000/");

    socket.on("offer", server => {

    })
    socket.emit("usoock");

    const ConnectAnother = () => {
        
    }
    const MakeCall = () => {
        const configuration = {'iceServers': [{'urls':'stun:stun.l.google.com:19302'}]};
        const peerConnection = new RTCPeerConnection(configuration);
        socket.on
    }
    /* << Socket io test area */
</script>

<main>
    <div class="userinfo">
        <div class="userinfo-name"></div>
        <div class="userinfo-headers"></div>
        <div class="userinfo-body"></div>
        <button class="do-link" on:click="{ConnectAnother}">LINK!!</button>
    </div>
</main>