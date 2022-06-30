<template>
    <div class="tos-dialog-left" :style="styles">
        <div class="tos-dialog-left-resize" @mousedown="resize_frame($event)"></div>
        <div class="tos-dialog-wrap-space"></div>
        <div class="tos-dialog-content">
            <x-tab-app v-on="$listeners" v-bind="$attrs"></x-tab-app>
        </div>
    </div>
</template>
<script>
export default {
    name: "x-tree",
    components: {"x-tab-app":()=>import("./x-tab-app")},
    data() {
        return {
            styles: {
                width: "220px",
            },
        };
    },
    methods: {
        resize_frame(e) {
            let _this = this;
            let startwidth = parseInt(_this.styles.width),
                startx = e.clientX || e.pageX,
                maxwidth = 400;
            document.onmousemove = (e) => {
                let endx = e.clientX || e.pageX,
                    endwidth = endx - startx + startwidth;
                if (endwidth < 220) endwidth = 220;
                if (endwidth > maxwidth) endwidth = maxwidth;
                _this.$set(_this.styles, "width", endwidth + "px");
            };
            document.onmouseup = () => {
                document.onmousemove = null;
            };
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../util/scss/global";
.tos-dialog {
    &-left {
        width: 200px;
        min-width: 220px;
        border-radius: 6px 0 0 6px;
        max-width: 400px;
        @include flexcolumn(column);
        position: relative;
        background-color: $linkBgColor;
        &-resize {
            background: url("../assets/resize.png") right center no-repeat;
            @include custom_position(98, 0, -6px, 0, null);
            width: 6px;
            cursor: col-resize;
            @include userselect;
        }
    }
    &-wrap {
        position: relative;
        overflow: hidden;
        width: 100%;
        @include flexcolumn(row, null, stretch);
        &-space {
            height: 54px;
            width: 100%;
            flex-shrink: 0;
        }
    }
    &-content {
        flex: 1;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        border-bottom-right-radius: 8px;
    }
}
</style>
