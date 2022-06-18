<div class="alert-wrap">
    <div class="alert">
        시간 초과!
    </div>
    <div class="image-wrap">
        <img src="/images/timeout.svg" alt="">
    </div>
    <div class="message">
        더 대중적인 노래를 골라보는게 어떨까요...?
    </div>
</div>

<style>
    .alert-wrap {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        background-color: #151515;
        animation: fadeUpInAbs 400ms ease 1 forwards;
        z-index: 3;
    }
    .alert {
        padding-top: 6rem;
        text-align: center;
        font-size: 3.3rem;
        font-weight: 900;
    }
    .image-wrap {
        padding: 1rem 21rem 3rem;
        box-sizing: border-box;
    }
    .image-wrap>img {
        padding: 2rem 5rem;
        box-sizing: border-box;
        border-radius: 2.7rem;
    }
    .message {
        font-size: 2rem;
        font-weight: 900;
        text-align: center;
        line-height: 1.45;
    }
</style>