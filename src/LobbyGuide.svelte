<script>
    import GuideImage from '../public/images/GuideSvgs.svelte';

    let guideList;
    let pagerList;
    let guideNumber = 0;
    function GuideMoveTo(index) {
        guideNumber = Math.min(5, Math.max(0, index));
        guideList.style.left = `${-100*guideNumber}%`;
        let items = pagerList.children;
        for(let i=0; i<items.length; i++) {
            items[i].classList.remove("selected");
        }
        items[index].classList.add("selected");
    }
    function OnClickGuide() {
        GuideMoveTo((guideNumber + 1) % 6);
    }
</script>

<div class="guide-wrap">
    <ul class="guide-list" bind:this="{guideList}" on:click="{() => { OnClickGuide(); }}">
        <li class="guide-item">
            <span class="svg-wrap">
                <GuideImage index={0}></GuideImage>
            </span>
            프로필을 설정하고 방에 입장하세요!
        </li>
        <li class="guide-item">
            <span class="svg-wrap">
                <GuideImage index={1}></GuideImage>
            </span>
            <span class="textbox">
                함께 플레이할 친구들에게 초대링크를 공유하세요!
            </span>
        </li>
        <li class="guide-item">
            <span class="svg-wrap">
                <GuideImage index={1}></GuideImage>
            </span>
            <span class="textbox">
                친구들이 모두 입장했다면 규칙을 정하고 시작하세요!
            </span>
        </li>
        <li class="guide-item">
            <span class="svg-wrap">
                <GuideImage index={2}></GuideImage>
            </span>
            <span class="textbox">
                규칙에 맞게 문제를 출제하세요! 친구들이 쉽게 알 수 있게 힌트를 줄 수 있어요!
            </span>
        </li>
        <li class="guide-item">
            <span class="svg-wrap">
                <GuideImage index={1}></GuideImage>
            </span>
            <span class="textbox">
                노래를 듣고 누구보다 빠르게 제목을 맞추세요!
            </span>
        </li>
        <li class="guide-item">
            <span class="svg-wrap">
                <GuideImage index={1}></GuideImage>
            </span>
            <span class="textbox">
                1등을 할 수 있게 노력하세요!
            </span>
        </li>
    </ul>
    <div class="guide-pager">
        <div class="pager-wrap" bind:this="{pagerList}">
            <span class="pager-item selected" on:click="{() => { GuideMoveTo(0) }}"></span>
            <span class="pager-item" on:click="{() => { GuideMoveTo(1) }}"></span>
            <span class="pager-item" on:click="{() => { GuideMoveTo(2) }}"></span>
            <span class="pager-item" on:click="{() => { GuideMoveTo(3) }}"></span>
            <span class="pager-item" on:click="{() => { GuideMoveTo(4) }}"></span>
            <span class="pager-item" on:click="{() => { GuideMoveTo(5) }}"></span>
        </div>
    </div>
</div>

<style>
    .guide-wrap {
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        cursor: pointer;
    }
    .guide-list {
        transition: left 400ms ease;
        position: relative;
        left: 0;
        width: 600%;
        display: flex;
    }
    .guide-item {
        padding: 3.5rem;
        flex-basis: calc(100% / 6);
        font-size: 1.7rem;
        font-weight: 900;
        word-break: keep-all;
        text-align: center;
        box-sizing: border-box;
    }
    .guide-item>.svg-wrap {
        display: block;
        padding: 45px 0;
        box-sizing: border-box;
    }
    .pager-wrap {
        padding-top: 3rem;
        text-align: center;
        user-select: none;
    }
    .pager-item {
        transition: width 400ms ease,
                    height 400ms ease,
                    margin 400ms ease;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        margin: .2rem;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
    }
    .guide-wrap:hover .pager-item {
        width: 2rem;
        height: 2rem;
        margin: .5rem;
    }
    .pager-item.selected {
        background: var(--point-color-b);
    }
    .pager-item:hover {
        opacity: 0.6;
    }
</style>