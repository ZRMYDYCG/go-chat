<script setup lang="ts">
import SvgRender from '@/components/SvgRender/index.vue'
import { useCurrentInstance } from '@/hooks'
import { useUserStore } from '@/store/modules/user.ts'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const currentInstance = useCurrentInstance()

const { userInfo } = storeToRefs(userStore)
const { $common } = currentInstance.proxy
</script>

<template>
  <div class="info-setting h-screen w-[40%] bg-gray-100">
    <div class="setting-wrapper py-[100px]">
      <!--  用户的基本信息  -->
      <div class="border-b-[1px] border-gray-200 px-[15px] pb-[10px]">
        <div class="avatar flex flex-col items-center">
          <img class="h-20 w-20 rounded-full" alt="用户头像" :src="$common.formatServerFilePath(userInfo.avatar)" />
          <div
            class="-mt-[20px] -mr-[60px] flex cursor-pointer items-center justify-center rounded-full bg-blue-400 p-[8px]"
          >
            <SvgRender name="edit" width="20" height="20" />
          </div>
        </div>
        <div class="flex flex-col items-center gap-2">
          <p class="text-lg font-thin">{{ userInfo.nickname ? userInfo.nickname : userInfo.account }}</p>
          <p class="text-sm text-gray-400">北京市 昌平区</p>
          <p class="text-[12px]">选择困难的路,以后只会越来越简单</p>
        </div>
        <div class="social-wrapper mt-[15px] flex justify-center gap-2">
          <div>
            <SvgRender name="weibo" width="30" height="30" />
          </div>
          <div>
            <SvgRender name="github" width="30" height="30" />
          </div>
          <div>
            <SvgRender name="weixin" width="30" height="30" />
          </div>
        </div>
      </div>
      <!--   用户的联系方式   -->
      <div class="flex flex-col items-center gap-2 border-b-[1px] border-gray-200 px-[15px] py-[10px] text-[12px]">
        <div class="chat-wrapper">
          <div class="flex gap-2">
            <span>联系电话:</span>
            <span class="text-gray-400">+86 13812345678</span>
          </div>
          <div class="flex gap-2">
            <span>电子邮件:</span>
            <span class="text-gray-400">547474747@qq.com</span>
          </div>
          <div class="flex gap-2">
            <span>个人网站:</span>
            <span class="text-gray-400">www.yike.com</span>
          </div>
        </div>
      </div>
      <!--   用户相册   -->
      <div class="border-b-[1px] border-gray-200 px-[15px] py-[10px] text-[12px]">
        <div class="title flex items-center justify-between">
          <div>相册</div>
          <div class="flex cursor-pointer items-center gap-1 text-blue-400">
            <span>查看全部</span>
            <SvgRender name="right" width="15" height="15" />
          </div>
        </div>
        <div class="list grid grid-cols-5 gap-1 pt-[10px]">
          <div class="overflow-hidden rounded-[5px]">
            <img src="https://pica.zhimg.com/v2-ba5b73f021a0f245a8b875d77de78b14_r.jpg" />
          </div>
          <div class="overflow-hidden rounded-[5px]">
            <img src="https://pic4.zhimg.com/v2-19ef12572eab9ccb8effd2bed190c627_r.jpg" />
          </div>
          <div class="overflow-hidden rounded-[5px]">
            <img src="https://pic4.zhimg.com/v2-863219151c7fd476b36bf3bd331b4c7b_r.jpg" />
          </div>
        </div>
      </div>
      <!--   用户的个人空间   -->
      <div class="px-[15px] py-[10px] text-[12px] hover:bg-gray-200">
        <div class="title flex items-center justify-between">
          <div>朋友圈</div>
          <div class="flex cursor-pointer items-center gap-1 text-blue-400" @click.prevent="">
            <span>分享新鲜事</span>
            <SvgRender name="right" width="15" height="15" />
          </div>
        </div>
        <div class="list">
          <!--  区分纯文本、（图片加文本、图片）、视频类型  -->
          <div class="list grid grid-cols-5 gap-1 py-[10px]">
            <div class="overflow-hidden rounded-[5px]">
              <img src="https://pic2.zhimg.com/v2-f162a3f5c583e288773041f58028df0d_1440w.jpg" />
            </div>
            <div class="overflow-hidden rounded-[5px]">
              <img src="https://picx.zhimg.com/v2-8661d655ec8139724d0cbc9dae587d9d_1440w.jpg" />
            </div>
            <div class="overflow-hidden rounded-[5px]">
              <img src="https://picx.zhimg.com/v2-f1a6a154adf94f2b3aadc0c9ccf13f5b_1440w.jpg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
