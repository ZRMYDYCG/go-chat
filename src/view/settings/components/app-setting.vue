<script setup lang="ts">
import SvgRender from '@/components/SvgRender/index.vue'
</script>

<template>
  <div class="app-setting flex w-full justify-center">
    <div class="app-setting-wrapper w-[60%] px-[30px] py-[100px]">
      <div>
        <div class="title my-[20px] text-[25px] font-extralight">隐私设置</div>
        <div class="border-b-[1px] border-gray-300 pb-[10px]">
          <div class="flex items-center justify-between">
            <div>添加好友时需要验证</div>
            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
        <div class="border-b-[1px] border-gray-300 py-[10px]">
          <div class="flex items-center justify-between">
            <div>推荐通讯录好友</div>
            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
          <p class="text-sm text-gray-300">上传的通讯录只能用来匹配好友列表, 本应用不会记录和发送任何信息给其它机构</p>
        </div>
        <div class="border-b-[1px] border-gray-300 py-[10px]">
          <div class="flex items-center justify-between">
            <div>只能通过账号搜索到我</div>
            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
      </div>
      <div>
        <div class="title my-[20px] text-[25px] font-extralight">通知设置</div>
        <div class="border-b-[1px] border-gray-300 pb-[10px]">
          <div class="flex items-center justify-between">
            <div>新消息通知</div>
            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
        <div class="border-b-[1px] border-gray-300 py-[10px]">
          <div class="flex items-center justify-between">
            <div>语音和视频通话通知</div>
            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
        <div class="border-b-[1px] border-gray-300 py-[10px]">
          <div class="flex items-center justify-between">
            <div>声音提醒</div>
            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
        <div class="border-b-[1px] border-gray-300 py-[10px]">
          <div class="flex items-center justify-between">
            <div>查看已静音好友列表</div>
            <div>
              <SvgRender name="right" width="16" height="16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
