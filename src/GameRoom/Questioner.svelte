<script>
    let videoPlayerElmt;
    let questionOrder = 0;

    let descriptions = ["재생할 영상의 주소(URL)를 입력해요!", "제목을 입력해요! 공백, 특수문자는 무시돼요!", "문제를 맞출 수 있게 설명을 적어요!", "오랫동안 아무도 못 맞추면 힌트를 제공해요!"];
    let placeholders = ["https://www.youtube.com/watch?v=pKv_wua6kFE", "Dragon Rider", "영어 제목\nTwo Steps From Hell - oooooo ooooo", "용 기수, Dooooo Roooo"]

    function OnSubmit(e) {
        console.dir(e.target.answer.value);
        // document.querySelector(".input-title").classList.add(".input-area.disappear");
        questionOrder++;
    }
</script>

<div class="question-wrap">
    <form class="question-form" on:submit|preventDefault="{OnSubmit}">
        <div class="input-wrap">
            <div class="input-item">
                <div class="span">{descriptions[questionOrder]}</div>
                <textarea type="text" name="answer" placeholder={placeholders[questionOrder]} autocomplete="off"></textarea>
            </div>
            <input class="button" type="submit" value="제출">
        </div>
        <!-- <button class="edit-button"><img src="../images/recycle-b.svg" alt=""></button> -->
    </form>
</div>

<style>
    /* .edit-button {
        width: 6rem;
    } */
    .question-wrap {
        height: 100%;
    }
    textarea {
        text-align: center;
        padding: 1rem;
        overflow: hidden;
        width: 60rem;
        resize: none;
        overflow: hidden;
    }
    .input-wrap {
        position: relative;
        display: flex;
        width: 100%;
        height: 6rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .question-form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    input[type="submit"] {
        display: inline-block;
        padding: 1rem 2rem;
    }
</style>