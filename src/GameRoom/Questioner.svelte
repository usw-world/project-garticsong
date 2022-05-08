<script>
    import { onMount } from "svelte";
    export let OnClear;

    let videoPlayerElmt;
    let questionOrder = 0;
    let wrapper;
    let answerObj = {};
    
    onMount(() => {
        wrapper = document.querySelector(".question-wrap");
    });

    let descriptions = ["재생할 영상의 주소(URL)를 입력해요!", "제목을 입력해요! 공백, 특수문자는 무시돼요!", "문제를 맞출 수 있게 설명을 적어요!", "오랫동안 아무도 못 맞추면 힌트를 보여줘요!"];
    let placeholders = ["https://www.youtube.com/watch?v=pKv_wua6kFE", "Dragon Rider", "영어 제목\nTwo Steps From Hell - oooooo ooooo", "용 기수, Dooooo Roooo"]
    let wrotenValues = [];

    function OnSubmit(e) {
        if(questionOrder >= descriptions.length) {
            wrapper.style.opacity = 0;
            answerElmt.value = value;
            OnClear();
            console.log("usoock");
            return;
        }
        let answerElmt = e.target.answer;
        let value = answerElmt.value;
        
        if(value === "") { // 공백 입력 에러
            OnEmptyInput();
            return;
        }
        switch(questionOrder) {
            case 0:
                answerObj["url"] = value;
                wrotenValues[questionOrder] = value;
                AddWrotenList(questionOrder, "url", value);
                break;
            case 1: 
                answerObj["title"] = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, "");
                wrotenValues[questionOrder] = value;
                AddWrotenList(questionOrder, "title", value);
                break;
            case 2: 
                answerObj["description"] = value;
                wrotenValues[questionOrder] = value;
                AddWrotenList(questionOrder, "description", value);
                break;
            case 3: 
                answerObj["hint"] = value;
                wrotenValues[questionOrder] = value;
                AddWrotenList(questionOrder, "hint", value);
                break;
        }
        questionOrder++;
        answerElmt.value = "";
        answerElmt.focus();
    }
    
    let wrotenWrapper;
    let wrotenList;
    function AddWrotenList(order, type, value) {
        try {
            let childSpan = document.createElement("span");
            childSpan.textContent = `${type.toUpperCase()} `;
            
            let childLi = document.createElement("li");
            childLi.appendChild(childSpan);
            childLi.className = "wroten-item";
            childLi.textContent += `: ${value}`;
            childLi.style.display = "block";
            childLi.style.overflow = "hidden";
            childLi.style.textOverflow = "ellipsis";
            childLi.style.whiteSpace = "nowrap";
            childLi.style.cursor = "pointer";

            childLi.attributes["order"] = order;
            childLi.addEventListener("click", function(e) {
                questionOrder = this.attributes.order;
                let listElmt = this.parentElement;
                let items = this.parentElement.children;

                for(let i=order; items.length>=order+1; i) {
                    listElmt.removeChild(items[i]);
                    RefreshWrotenHeight();
                }
                wrotenValues[questionOrder] = null;
            })
            wrotenList.appendChild(childLi);
            RefreshWrotenHeight();
        } catch (error) {
            console.error(error);
            questionOrder = 0;
        }
    }
    function RefreshWrotenHeight() {
        wrotenWrapper.style.height = wrotenList.offsetHeight + "px";
    }
    function OnEmptyInput() {
        document.querySelector(".question-answer").style.animation = "inputError 400ms ease 1 forwards";
    }
    function OnClickInput() {
        document.querySelector(".question-answer").style.animation = "none";
    }
    function ModifyWrotenList() {

    }
</script>

<div class="question-wrap">
    <div class="wroten-wrap" bind:this={wrotenWrapper}>
        <ul class="wroten-list" bind:this={wrotenList}>
            <!-- <li class="wroten-item"></li> -->
        </ul>
    </div>
    <form class="question-form" on:submit|preventDefault="{OnSubmit}">
        <div class="input-wrap">
            {#if questionOrder < descriptions.length}
                <div class="question-request">{descriptions[questionOrder]} <br> ({questionOrder+1}/{descriptions.length})</div>
                <input type="text" class="question-answer" name="answer" placeholder={placeholders[questionOrder]} autocomplete="off" 
                value={wrotenValues[questionOrder] || ""} on:click={OnClickInput}>
            {:else}
                <div class="question-request">확인해봐요! 제출한 뒤에는 수정할 수 없어요!</div>
            {/if}
            <input class="button" type="submit" value="제출">
        </div>
    </form>
</div>

<style>
    /* .edit-button {
        width: 6rem;
    } */
    .question-wrap {
        height: 100%;
    }
    .wroten-wrap {
        transition: height 400ms ease;
        height: 0;
        padding: 10rem 3rem 0;
        color: #fff;
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.5;
        text-align: center;
        overflow: hidden;
    }
    .wroten-list {
        height: auto;
        display: inline-flex;
        flex-direction: column;
    }
    .question-form {
        margin-top: 8rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .input-wrap {
        position: relative;
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .question-request {
        margin-bottom: 1.8rem;
        font-size: 2.3rem;
        font-weight: 900;
        text-align: center;
        line-height: 1.45;
    }
    .question-answer {
        transition: color 400ms ease;
        text-align: center;
        padding: 1rem;
        margin-bottom: 1rem;
        overflow: hidden;
        width: 60rem;
        resize: none;
        overflow: hidden;
        /* animation: inputError 400ms ease 1 forwards; */
    }
    .question-answer {
        display: inline-block;
        padding: 1rem 0;
        height: auto;
    }
    input[type="submit"] {
        display: inline-block;
        padding: 1rem 2rem;
    }
</style>