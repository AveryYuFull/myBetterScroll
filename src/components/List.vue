<template>
    <div class="bs_wrapper">
        <div class="bs_wrapper-cont">
            <ul class="bs_cont">
                <li class="bs_cont-item"
                    :key="index"
                    v-for="(item, index) in (itemData || [])"
                    v-text="item">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import BetterScroll from '../commons/betterScroll';

export default {
    name: 'bs-list',
    data () {
        return {
            itemData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        };
    },
    mounted() {
        const _that = this;
        let bScroll = new BetterScroll(_that.$el);
    }
};
</script>

<style lang="less">
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
.bs_wrapper {
    overflow: hidden;
    height: 350px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    .bs_wrapper-cont {
        height: 410px;
    }
    .bs_cont {}
    .bs_cont-item {
        padding: 5px 10px;
        background: rgba(173, 164, 164, 0.5);
        line-height: 40px;
        font-size: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        &:last-child {
            border-bottom: none;
        }
    }
}
</style>
