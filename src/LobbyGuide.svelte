<script>
    import GuideImage from '../public/images/GuideSvgs.svelte';

    
</script>

<div class="guide-wrap">
    <ul class="guide-list">
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
        <div class="pager-wrap"></div>
    </div>
</div>

<style>
    .guide-wrap {
        width: 100%;
        /* background-color: rgba(255, 255, 255, .12); */
        background-color: rgba(0, 0, 0, .75);
        overflow: hidden;
        border-radius: 25px;
        box-sizing: border-box;
    }
    .guide-list {
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
</style>