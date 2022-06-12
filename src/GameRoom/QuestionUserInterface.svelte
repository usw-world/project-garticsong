<script>
    import { game } from "../store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    import Answerform from "./AnswerForm.svelte"
    
    console.log(thisGame);
    function OnSubmit(e) {
        let showHint = true;    
        console.log(showHint)

    }
</script>

<form class="question-form" on:submit|preventDefault = {OnSubmit}>

        <div class="host-answer">정답 : {thisGame.room.currentQuestion.title} </div>
        <div class="host-description">설명 : {thisGame.room.currentQuestion.description} </div>
        <div class="hint-submit">힌트를 제출해봐요!</div>

        <input id="hint-submit-button" class="answer-button" type="submit" value="Hint">
        
    
    <div class="answer-description"></div>
</form>