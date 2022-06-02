<script>
    import { game } from '../store';
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    export let user;
</script>

<div class="answerer-board">
    <div class="question-title">
        <span>정답은 바로</span><br>
        {thisGame.room.lastQuestion.title}
    </div>
    <div class="answerer-info">
        <div class="imagebox">
            <div class="boxframe"></div>
            <div class="image-frame">
                <img src="/images/character-tambo.svg" alt="">
            </div>
        </div>
        <div class="answerer-name">
            잘 하셨어요, <span class="name">{user.name}</span>!
        </div>
    </div>
</div>

<style>
    .answerer-board {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #151515;
        padding-top: 4.9rem;
        box-sizing: border-box;
        text-align: center;
    }
    .question-title {
        font-size: 4rem;
        font-weight: 900;
        text-align: center;
        
    }
    .question-title>span {
        display: inline-block;
        margin-bottom: 1rem;
        color: #fff;
        font-weight: 100;
        font-size: 1.7rem;
    }
    .answerer-info>.answerer-name {
        margin-bottom: 2rem;
        font-size: 2.8rem;
        font-weight: 900;
        text-align: center;
        line-height: 1.6;
    }
    .answerer-info>.answerer-name>span.name {
        display: inline-block;
        color: var(--point-color-b);
    }
    .answerer-info>.imagebox {
        position: relative;
        display: inline-block;
        width: 30rem;
        height: 33rem;
        text-align: center;
        margin: 1rem 0 2rem;
        border-radius: 0 0 15rem 15rem;
    }
    .answerer-info>.imagebox .boxframe {
        position: absolute;
        top: 3rem; left: 0;
        display: inline-block;
        width: 30rem;
        height: 30rem;
        text-align: center;
        border: .5rem solid #fff;
        border-radius: 50%;
        box-sizing: border-box;
    }
    .answerer-info>.imagebox .image-frame {
        position: absolute;
        width: calc(100% - 1rem);
        bottom: .5rem; left: .5rem;
        border-radius: 0 0 15rem 15rem;
        box-sizing: border-box;
        text-align: center;
        overflow: hidden;
    }
    .answerer-info>.imagebox img {
        vertical-align: middle;
    }

</style>