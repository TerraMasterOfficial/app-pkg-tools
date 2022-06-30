<template>
    <div class="hello">
        {{ hello }}
    </div>
</template>

<script>
import {getFirst} from "@/api/module/api";

export default {
    data() {
        return {
            hello: "Hello, This is an example!"
        }
    },
    mounted() {
        getFirst("TOS5_APP_HelloWorld/").then((res) => {
            this.hello = res.data;
        });
    }
}
</script>

<style lang="scss" scoped>
@import "@/util/scss/global";

.hello {
    @include flexcolumn(column, center, center);
}
</style>
