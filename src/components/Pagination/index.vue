<template>
  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    layout="->,total, sizes, prev, pager, next, jumper"
    @size-change="handlePageSizeChange"
    @current-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  pageSizes: {
    type: Array,
    default: () => [20, 30, 50],
  },
});

const emits = defineEmits(["update:currentPage", "update:pageSize"]);

const handlePageChange = (page: number) => {
  emits("update:currentPage", page);
};

const handlePageSizeChange = (size: number) => {
  emits("update:pageSize", size);
};
</script>
