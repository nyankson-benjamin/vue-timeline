<template>
    <div class="w-full border-gray-100 rounded-lg border-2" :class="{
      'overflow-x-auto': overflowXAuto, 'fixedColumn': isFixedColumn
    }">
      <table class="min-w-full leading-normal border-none" :class="{ 'table-fixed': !overflowXAuto }"
        aria-describedby="table">
        <thead>
          <tr>
            <template v-for="(header, index) in headers" :key="header.key">
              <th :id="header.key" class="
                  px-5
                  py-5
                  bg-[#FAFBFF]
                  text-left
                  font-sans font-medium
                  N900
                  whitespace-nowrap
                  tracking-wider
                  text-sm
                " :style="{
                  width: getColumnWidths(header),
                  color: headerTextColor
                }" :class="{ className, 'whitespace-nowrap': overflowXAuto }">
                <slot :name="`header-${header.key}`" :header="header">
                  
  
                  <div class="flex items-center gap-1"  @mouseover="getCurrentHeader(index, true)" @mouseleave="getCurrentHeader(index, false)">
                    {{ header["label"] }}
                    <div class="cursor-pointer" @click="$emit('tableRowsReordered', header['label'])">
                      <component :is="header['icon']" v-if="index === currentHeader"/>
                    </div>
                  </div>
                </slot>
              </th>
            </template>
          </tr>
        </thead>
        <tbody v-if="displayedItems?.length > 0 || addNewRows" class="text-base font-normal N800 border-l-0 border-r-0">
          <tr v-for="(item, index) in displayedItems" :key="item.id" :class="rowStyle" class="hover:bg-gray-100">
            <td v-for="header in headers" :key="header.key" class="py-3 px-5 mr-10 "
              :class="{ rowDataClass, 'border-b-[1.5px]': ((displayedItems?.length - 1) !== index), 'whitespace-nowrap': overflowXAuto }">
              <slot :name="header.key" :item="item" :index="index" :items="displayedItems" :header="header" >{{
                item[header.key]
              }}</slot>
            </td>
          </tr>
  
        </tbody>
  
      </table>
      <div v-if="displayedItems?.length === 0 && !addNewRows" class="
          h-[50vh]
          min-w-full
          leading-normal
          flex
          justify-center
          items-center
          py-4
        ">
        <div class="w-full m-auto mt-24 text-center">
          <p class="text-[#8F95B2]">{{ emptyMessage }} :(</p>
        </div>
      </div>
    </div>
    <!-- Pagination Controls -->
    <div v-if="showPagination && totalPages > 1" class="flex justify-end items-center my-4">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="hover:bg-[#f9e0d7] text-white font-bold py-3 px-4 rounded-l">
      </button>
      <div class="flex space-x-2">
        <button v-for="page in pages" :key="page" @click="changePage(page)" :class="[
          'hover:bg-[#dd5928] py-2 px-4 rounded',
          { 'bg-[#f9e0d7]': currentPage === page },
          { 'text-orange-400': currentPage === page }
        ]">
          {{ page }}
        </button>
      </div>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="hover:bg-[#f9e0d7] text-white font-bold py-3 px-4 rounded-r">
      </button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch, type Component } from "vue";
  
  interface Header {
    key: string;
    label: string;
    icon?: Component;
  }
  
  const emit = defineEmits(["tableRowsReordered"]);
  
  const props = defineProps({
    headers: {
      type: Array as () => Array<Header>,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10 // Set a default value for the number of items per page
    },
    emptyMessage: {
      type: String,
      default: "No data available"
    },
    columnWidths: {
      type: Object as () => Record<string, string>,
      default: () => ({})
    },
    rowStyle: {
      type: String,
      default: ""
    },
    pageRange: {
      type: Number,
      default: 1 // Set a default value for the page range
    },
    className: {
      type: String,
      default: ""
    },
    headerTextColor: {
      type: String,
      default: ""
    },
    rowDataClass: {
      type: String,
      default: ""
    },
    addNewRows: {
      type: Boolean,
      default: false
    },
    overflowXAuto: {
      type: Boolean,
      default: false
    },
    addNewRowsDataClass: {
      type: String,
      default: ""
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    dragHandleClass: {
      type: String,
      default: ""
    },
    dragImgClass: {
      type: String,
      default: ""
    },
    dragImgSrc: {
      type: String,
      default: ""
    },
    useDragHandler: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    truncate: {
      type: Boolean,
      default: false
    },
    isFixedColumn: {
      type: Boolean,
      default: false
    }
  
  });
  
  //set Data for Draggable Table
  const dragTableItems = ref<any>([]);
  
  // Data variables for pagination
  const currentPage = ref(1);
  
  //set table column widths
  const getColumnWidths = (header: Header) => {
    return props.columnWidths[header.key] || "auto";
  };
  
  // Compute the total number of pages based on the number of items and items per page
  const totalPages = computed(() =>
    Math.ceil(props.items?.length / props.itemsPerPage)
  );
  
  // Compute the items to be displayed on the current page
  const displayedItems: any = computed(() => {
    const startIndex = (currentPage.value - 1) * props.itemsPerPage;
    const endIndex = startIndex + props.itemsPerPage;
    dragTableItems.value = props.isDraggable
      ? props.items?.slice(startIndex, endIndex)
      : [];
    return props.items?.slice(startIndex, endIndex);
  });
  
  // Methods to navigate between pages
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  }
  
  // Method to handle table row drag changes
  function handleTableRowsOnDragChange() {
    emit(
      "tableRowsReordered",
      dragTableItems.value,
      currentPage.value,
      props.itemsPerPage
    );
  }
  
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
    }
  }
  // Compute an array of page numbers for pagination
  const pages = computed(() => {
    const range = [];
    const startPage = Math.max(1, currentPage.value - props.pageRange);
    const endPage = Math.min(
      totalPages.value,
      currentPage.value + props.pageRange
    );
  
    if (startPage > 1) {
      range.push(1);
      if (startPage > 2) {
        range.push("...");
      }
    }
  
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
  
    if (endPage < totalPages.value) {
      if (endPage < totalPages.value - 1) {
        range.push("...");
      }
      range.push(totalPages.value);
    }
  
    return range;
  });
  
  // Method to change the current page
  function changePage(pageNumber: number | string) {
    if (typeof pageNumber === "number") {
      currentPage.value = pageNumber;
    }
  }
  
  watch(totalPages, (oldVal, newVal) => {
    if (oldVal !== newVal) {
      currentPage.value = 1;
    }
  });
  
  const currentHeader = ref(10000);
  
  const getCurrentHeader = (idx:number, status:boolean)=>{
    if(status){
      currentHeader.value = idx;
    }
  
    else{
      currentHeader.value = 10000;
  
    }
  };
  
  </script>
  
  <style scoped>
  .fixedColumn {
    height: 85vh;
    overflow-y: scroll;
  }
  
  .fixedColumn td:nth-child(1),
  .fixedColumn th:nth-child(1) {
    position: sticky;
    left: 0px;
    z-index: 1;
    /* Ensure the header is above the content */
  
  }
  
  .fixedColumn th:nth-child(1) {
    background-color: #FAFBFF;
  }
  
  .fixedColumn thead {
    position: sticky;
    top: 0px;
    width: 100%;
    z-index: 2;
    /* Ensure the header is above the content */
  }
  
  .fixedColumn td:nth-child(1){
    background-color: #fff;
    border-right: 1px solid rgb(240, 239, 239);
  }
  
  .fixedColumn td:nth-child(1):hover{
    --tw-bg-opacity: 1;
      background-color: rgb(243 244 246 / var(--tw-bg-opacity));
      }
      
  </style>
  