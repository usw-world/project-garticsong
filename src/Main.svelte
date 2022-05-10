<style>
    #main-wrap {
        width: 100%;
        height: 100%;
        background-image: url(./imges-song/songbackground.png); 
        background-repeat: no-repeat;
        background-size: cover;
    }
    #content {
        width: 90%;
        margin: 0 auto;
    }
    #right-main{
    position: absolute;
    transform: translate(-50%,-50%);
    top: 33%;
    left: 70%;
    border-radius: 5px;
    box-shadow: 0 20px 35px rgba(0,0,0,0.3);
    overflow: hidden;
        /* 백그라운드 이미지를 넣어야하는듯하다. */
    }
    #right-main::before{
    content: "";
    height: 150%;
    width: 150%;
    position: absolute;
    background-image: url(./imges-song/songbackground.png);
    left: -25%;
    top: -25%; 
    }
    #right-main::after{
    content: "";
    position: absolute;
    background-color: #1c1b29;
    opacity: 80%;
    height: 97%;
    width: 97%;
    top: 1.5%;
    left: 1.5%;
    border-radius: 5px;
    font-family: 'Poppins',sans-serif;
    color: #ffffff;
    font-size: 20px;
    letter-spacing: 6px;
    display: grid;
    place-items: center;
    }
    .mainmenu { 
        float: left;
        width: 40%;
        height: 0%;
        padding-top:33.8%; 
        position: relative; 
        margin-top: 8%;
    }
    #LP-CHAR {
        width: 110%; 
        position: absolute; 
        bottom: -17%;
        left:20%
    }
    #right-ui-main {
        float:none;
        list-style: none; 
        position:static; 
        text-align: center; 
    }
    #right-ui-main li { 
        position: absolute;
    }
    #li-top {
        bottom: 40%; 
        width: 50%; 
        left: 25%; 
        height: 50%; 
        border: 5px solid #fff; 
        border-radius: 50%;
        z-index: 2;
    }
    #li-middle { 
        width: 50%; 
        left: 25%; 
        height: 10%; 
        bottom: 25%; 
        border: 3px solid #fff; 
        border-radius: 13px;
        background-clip: content-box;
        z-index: 2;
    }
    #inTop {
        width: 98%;
        height: 98%;
        border-radius: 50%;
        border:4px solid rgb(199, 185, 249);
            z-index: 3;
        position: absolute;
        left: 1%;
        bottom: 1%;
    }/* 안쪽 원 */
    #li-bottom { 
        width: 60%; 
        left: 20%; 
        bottom: 5%; 
        height: 15%; 
        margin: 0 auto; 
        letter-spacing:1vw;
        z-index: 2;
    }
    #li-bottom .bottom-play {
        font-size: 1.5vw; 
        line-height: 150%; 
        font-weight: 600; 
        z-index: 2;
        width: 60%;
        border-radius: 13px;
    }/* 
    .ul li {
        vertical-align: middle;
    }
    .playsmall{
        background-image: url(./imges-song/png.svg);
        width:  100px;
        height: 100px;
        z-index: 2;
    } */
    .bottom-play:hover{
        background-color: rgb(199, 185, 249);
        transition: ease-in-out 0.1s;
    }
</style>
<div id="main-wrap">
    <div id="content">
        <div id="left-main" class="mainmenu">
            <img src="./imges-song/LP.png" alt="" id="LP-CHAR">
        </div>
        <div id="right-main" class="mainmenu">
            <ul id="right-ui-main">
                <li id="li-top" class="ui-li">
                        <div id="inTop">  </div>
                </li>
                <li id="li-middle" class="ui-li">
                </li>
                <li id="li-bottom" class="ui-li">
                    <button class="bottom-play">
                        <img src="./imges-song/png.svg" alt="" width="31%" height="31%" style=" position: absolute; 
                        right: 56%; bottom: 60%;">
                        &nbsp;시작
                    </button>
                </li>
            </ul>
        </div>
    </div>
</div>