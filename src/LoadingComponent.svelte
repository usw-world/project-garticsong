<script></script>

<div class="loading-component">
    <div class="loading-wrap">
        <div class="loading-imagebox">
            <img src="/images/loading.svg" alt="">
        </div>
        <div class="loading-text">Now loading...</div>
    </div>
</div>

<style>
    .loading-component {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .loading-wrap {
        position: relative;
        animation: fadeUp 800ms ease 1 forwards;
        text-align: center;
    }
    .loading-imagebox {
        display: inline-block;
        width: 13rem;
        animation: spin8 infinite steps(8, end) 1200ms;
    }
    .loading-imagebox img {
        vertical-align: middle;
    }
    .loading-text {
        font-size: 3rem;
        font-weight: 900;
        line-height: 3;
    }
</style>