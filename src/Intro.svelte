<style>
    * {
        margin: 0;
        padding: 0;
    }
    .wrap {
        width: 100%;
        height:auto;
    }
    .mainTop {
        height: 50px;
    }
    .mainMiddle{
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
    }
    .playerinfo-form {
        width: 50%;
        margin: 0 auto;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        text-align: center;
        border-radius: 0 10rem 10rem 0;
        /* border-radius: 5px;
        border: 1px solid black;
        box-shadow: 0 20px 20px rgba(0,0,0,0.3);
        border: solid 4px rgba(29,29,27,.15);  */
    }
    .greeting-character {
        width: 50%;
        max-width: 600px;
    }
    #Top {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        margin: 0 auto;
        margin-top: 50px;
        border: 8px solid #fff;
    }
    #middle{
        margin-top: 20px;
    }
    #down{
        margin-top: 40px;
        margin-bottom: 40px;
    }
    .start {
        width: 200px;
        height: 50px;
        font-size: 2em;
        font-weight: 600;
    }
    .startimage {
        width: 40px;
        float: left;
        left: 10px;
        padding-left: 10px;
        padding-top: 1px;
    }
    .UserName {
        width: 300px;
        height: 50px;
        font-size: 2em;
        border-radius: 11px;
        background-color: #fff;
    }
    @media screen and (max-width: 1199px) 
    { 
        .greeting-character {
            display: none;
        }
        .playerinfo-form {
            min-width: 400px;
        }
    }
</style>

<div class="wrap">
    <div class="mainTop"></div>
    <div class="mainMiddle">
        <div class="greeting-character">
            <img src="/images/main-character.svg" alt="" width="100%">
        </div>
        <form class="playerinfo-form outter-frame">
                <div class="image-box" id="Top">
                    <img src="/images/main-character.svg" alt="">
                </div>
                <div class="item" id="middle">
                    <input type="text"  placeholder="유저이름" class="UserName">
                </div>
                <div class="item" id="down">
                    <button class="start">
                        <img src="./imges-song/png.svg" alt="" class="startimage">시작
                    </button>
                </div>
        </form>
    </div>
</div>