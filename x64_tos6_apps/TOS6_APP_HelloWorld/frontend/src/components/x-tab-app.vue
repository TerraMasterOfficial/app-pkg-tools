<template>
    <div>
        <div class="tab">
            <ul>
                <template v-for="(val, index) in tabList">
                    <li
                        class="tab-list"
                        :class="index == currentIndex ? 'active' : ''"
                        :key="index"
                        @click="handerTab(index, val)">
              <span
                  class="tab-list-icon"
                  :style="{ backgroundImage: `url(${val.icon})` }"
                  v-if="val.icon"></span>
                        <span class="tab-list-title">{{ MakeText(val.name) }}</span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: "x-tab-app",
    data() {
        return {
            tabList: [],
            currentIndex: 0,
        };
    },
    watch: {
        "$attrs.tabList": {
            handler(newVal) {
                if (newVal.length) {
                    this.tabList = newVal;
                    this.currentIndex = this.$attrs.index;
                }
            },
            deep: true,
        },
        '$attrs.index': {
            handler(newVal) {
                this.currentIndex = newVal;
            }
        }
    },
    methods: {
        handerTab(index, item) {
            this.$emit("handerTab", {item, index});
        },
    },
    created() {
    },
};
</script>
<style lang="scss" scoped>
@import "@/util/scss/global";

.tab-title {
    @include custom_position(100, null, 0, null, 0);

    .content {
        @include flexcolumn(row, null, center);
        cursor: pointer;
        height: 44px;
        padding-left: 15px;
        overflow: hidden;

        .iconfont {
            margin-right: 4px;
            font-size: 18px;
        }

        &:hover {
            background-color: $bg_hover_color;
        }

        .tab-title-name {
            flex: 1;
            line-height: 45px;
            white-space: nowrap;
        }
    }

    .tab-title-subTitle {
        height: 40px;
        line-height: 30px;
        box-sizing: border-box;
        font-weight: 800;
        white-space: nowrap;
        padding: 10px 10px 0;
    }
}

.tab {
    @include custom_position(99, 48px, null, 0px, 0);
    width: 100%;
    padding: 0;
    margin: 0px;
    font-size: 14px;
    overflow: hidden;

    ul {
        margin: 0 6px;
    }

    .tab-list {
        padding: 0px 0px 0px 15px;
        margin: 0;
        list-style: none;
        text-align: left;
        white-space: nowrap;
        outline: 0;
        height: 44px;
        @include flexcolumn(row, null, center);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            background-color: $bg_hover_color;
        }

        &.active {
            background-color: $bg_color;
            border-radius: 6px;
        }

        .tab-list-icon {
            @include custom_size(28px, 28px);
            margin-right: 4px;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 80%;
        }

        .tab-list-title {
            flex: 1;
            line-height: 44px;
        }
    }
}
</style>
