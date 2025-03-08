<script setup lang="ts">
import SvgRender from '@/components/SvgRender/index.vue'
</script>

<template>
  <div class="friend-container h-screen overflow-auto bg-gray-200">
    <!--  滚动过程中动态显示当前位置的用户信息  -->
    <div class="sticky top-0 flex h-[60px] items-center justify-center bg-gray-200"></div>
    <div class="mb-4 flex items-center justify-between px-[20px]">
      <div class="flex items-center gap-2">
        <div class="text-[30px] font-bold">朋友圈</div>
        <div>
          <SvgRender name="notice" />
        </div>
        <div>
          <SvgRender name="refresh" />
        </div>
      </div>
      <div>
        <el-button>
          <template #icon>
            <SvgRender name="publish" />
          </template>
          发布
        </el-button>
      </div>
    </div>
    <div class="content px-[20px] py-[20px]">
      <div class="item mb-4 rounded-[10px] bg-white p-[20px] shadow-sm">
        <!--  动态头部  -->
        <div class="header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="avatar h-[50px] w-[50px] overflow-hidden rounded-[50%]">
              <img src="https://pica.zhimg.com/v2-ba5b73f021a0f245a8b875d77de78b14_r.jpg" alt="#" />
            </div>
            <div>
              <p class="text-[16px] text-blue-600">一勺</p>
              <p class="text-[12px] text-gray-400">11:30</p>
            </div>
          </div>
        </div>
        <!--  动态内容  -->
        <div class="content py-2">
          <!--  文本内容 -->
          <p class="py-[10px] text-[14px]">要记得特别爱自己,再把多的爱分给别人</p>
          <!--  媒体内容  -->
          <div class="grid w-[40%] w-full grid-cols-3 gap-1">
            <template v-for="i in 1" :key="i">
              <div class="aspect-square">
                <img
                  src="https://pic2.zhimg.com/v2-52e1a952e141e0819db59749fb638a73_r.jpg"
                  alt="#"
                  class="h-full w-full rounded-md object-cover"
                />
              </div>
            </template>
          </div>
        </div>
        <!-- 点赞列表 -->
        <div class="grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] gap-0.5 bg-gray-100 p-2">
          <template v-for="i in 1" :key="i">
            <div class="w-[30px] cursor-pointer overflow-hidden rounded-sm">
              <img
                src="https://pica.zhimg.com/v2-ba5b73f021a0f245a8b875d77de78b14_r.jpg"
                alt="user"
                class="block h-auto w-full"
              />
            </div>
          </template>
        </div>
        <!-- 底部操作  -->
        <div class="mt-2 flex cursor-pointer items-center justify-end">
          <div class="bg-gray-100 px-[5px]">
            <SvgRender name="more" />
          </div>
        </div>
        <!-- 评论列表 -->
        <div class="mt-2 flex flex-col gap-1 bg-gray-100 p-[10px]">
          <template v-for="i in 7" :key="i">
            <div class="flex items-center justify-between bg-gray-200 p-[10px]">
              <div class="flex items-center gap-2">
                <span class="text-blue-600">一勺:</span>
                <span>你好，我是一勺，很高兴认识你！</span>
              </div>
              <div class="text-gray-400">11:29</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
