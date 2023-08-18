<template>
    <CSidebar
        position="fixed"
        :unfoldable="state.sidebarUnfoldable"
        :visible="state.sidebarVisible"
        @visible-change="(event) => mainStore.updateSidebarVisible(event)"
    >
        <CSidebarBrand>
          <CImage class="d-flex justify-content-center m-auto" fluid
                  src="/icons/telegram.svg"
                  width="75" height="75"/>
        </CSidebarBrand>
        <AppSidebarNav />
        <CSidebarToggler
            class="d-none d-lg-flex"
            @click="mainStore.toggleUnfoldable"
        />
    </CSidebar>
</template>

<script lang="ts" setup>
import { AppSidebarNav } from './AppSidebarNav'
import { useMainStore } from "../../stores/mainStore"
import { storeToRefs } from "pinia"

const mainStore = useMainStore()
const { state } = storeToRefs(mainStore)
</script>

<style lang="scss">

</style>
