<template>
    <div id="app">
        <x-tree :tabList="tabList" v-on:handerTab="handerTab" :index="index"></x-tree>
        <router-view class="flex-right" :title="title" @popup="popup"/>
        <div class="mark" v-show="markStatus"></div>
    </div>
</template>
<script>
import {getLang, getModule} from "@/api/module/api.js";
export default {
    data() {
        return {
            tabList: [],
            title: "",
            index: "",
            markStatus: false,
        };
    },
    components: {"x-tree": () =>import("@/components/x-tree")},
    methods: {
        handerTab(e) {
            this.navigate(e);
        },
        popup(e) {
            this.markStatus = e;
        },
        async loadingLang() {
            await getLang("TOS5_APP_HelloWorld").then((res) => {
                this.$store.commit("setLang", Object.assign(res.data.lng));
            });
        },
        loadingMenu() {
            // 侧边栏
            getModule({id: "TOS5_APP_HelloWorld"}).then((res) => {
                this.index = sessionStorage.getItem("index") || this.index;
                this.tabList = res.data;
                this.$router.push(this.tabList[this.index].path);
                this.title = res.data[this.index].name;
            });
        },
        navigate(e) {
            this.index = e.index;
            this.$router.push(this.tabList[this.index].path);
            this.title = this.tabList[this.index].name;
            sessionStorage.setItem("index", this.index);
        },
    },
    async mounted() {
        await this.loadingLang();
        this.loadingMenu();
    },
};
</script>
<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    display: flex;

    .flex-right {
        flex: 1;
        display: flex;
        padding-left: 24px;
        margin-top: 48px;
        flex-direction: column;
    }

    .mark {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0, 0, 0, 0.3);
        z-index: 99;
    }
}
</style>
