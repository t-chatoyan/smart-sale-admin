<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="main-content-title tx-24 mg-b-5">Categories</h2>
      </div>
      <div class="d-flex">
        <div class="justify-content-center">
          <router-link to="/category/add" type="button" class="btn btn-primary my-2 btn-icon-text">
            <i class="fe fe-plus-square mr-2"></i> Add Category
          </router-link>
        </div>
      </div>
    </div>
    <div class="row row-sm">
      <div class="col-lg-12">
        <div class="card custom-card">
          <div class="card-body">
            <div>
              <h6 class="main-content-label mb-1">Categories List</h6>
            </div>
            <div class="table-responsive">
              <div class="form-group ml-1" style="width: 280px">
                <label class="font-weight-semibold" style="font-size: 14px" for="search">Search</label>
                <input
                        class="form-control"
                        name="search"
                        id="search"
                        type="text"
                        placeholder="Search Name"
                        @input="e => searchItem(e.target.value)"
                />
              </div>
              <table-lite
                      :is-slot-mode="true"
                      :is-loading="tableIsLoading"
                      :columns="tableFields"
                      :rows="categoriesList"
                      @is-finished="tableIsLoading = false"
                      :is-hide-paging="true"
                      :sortable="sortable"
                      @do-search="filter"
              >
                <template  v-slot:actions="data">
                  <router-link :to="`/category/${data.value.id}`" class="btn btn-outline-primary mr-2 mt-1 mb-1">
                    <i class="fe fe-edit"></i>
                  </router-link>
                  <button v-if="data.value.status === 'active'" @click="removeCategory(data.value.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                    <i class="ti-close"></i>
                  </button>
                  <div v-else class="d-inline-block">
                    <button @click="restoreCategoryItem(data.value.id)" type="button" class="btn btn-outline-success mr-2 mt-1 mb-1">
                      <i class="fe fe-rotate-ccw"></i>
                    </button>
                    <button @click="removeCategory(data.value.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                      <i class="fe fe-trash-2"></i>
                    </button>
                  </div>
                </template>
              </table-lite>
              <div v-if="pagination" class="d-flex justify-content-end  mt-3">
                <div class="mr-3">
                  <b-form-select
                          @change="changePaginationPerPage"
                          style="width: 80px"
                          v-model="paginationPerPage"
                          :options="paginationOptions"
                          :has-checkbox="true"
                  >
                  </b-form-select>
                </div>
                <div class="d-flex align-items-center">
                  <v-pagination
                          v-model="paginationCurrentPage"
                          :pages="pagination.count_pages"
                          :range-size="1"
                          active-color="#DCEDFF"
                          @update:modelValue="changePagination"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Swal from 'sweetalert2'
import TableLite from "vue3-table-lite";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

export default {
  name: 'Categories',
  data () {
    return {
      paginationOptions: [
        { value: 6, text: '6' },
        { value: 10, text: '10' },
        { value: 30, text: '30' },
        { value: 100, text: '100' }
      ],
      paginationCurrentPage: 1,
      paginationPerPage: 6,
      pagination: {},
      tableIsLoading: false,
      sortable: {
        order: "id",
        sort: "desc",
      },
      getCategoryData: {
        page: '',
        count: '',
        sort: '',
        search: ''
      }
    }
  },
  components: {
    TableLite,
    VPagination,
  },
  computed: {
    ...mapState({
      categoriesList: state => state.category.categoriesList
    }),
    tableFields () {
      return [
        {
          field: 'id',
          label: '#',
          sortable: true,
          isKey: true,
        },
        {
          field: 'title',
          label: 'title',
          sortable: true,
          isKey: true,
        },
        {
          field: 'image',
          label: 'image',
        },
        {
          field: 'actions',
          label: 'actions',
        }
      ]
    }
  },
  created () {
    this.getCategoryData.sort = `${this.sortable.order}.${this.sortable.sort}`;
    this.getCategoriesList(this.getCategoryData)
  },
  methods: {
    ...mapActions({
      getCategories: 'category/getCategories',
      deleteCategory: 'category/deleteCategory',
      restoreCategory: 'category/restoreCategory',
    }),
    getCategoriesList (params) {
      this.tableIsLoading = true;
      this.getCategories(params).then(res => {
        this.pagination = res.pagination
      }).catch(() => {
        this.$toast.error('Something went wrong!')
      }).finally(() => {
        this.tableIsLoading = false;
      })
    },
    searchItem (value) {
      this.getCategoryData.search = value;
      this.getCategoriesList(this.getCategoryData)
    },
    filter (offset, limit, order, sort) {
      this.getCategoryData.sort = `${order}.${sort}`;
      this.getCategoriesList(this.getCategoryData)
    },
    changePaginationPerPage (value) {
      this.getCategoryData.count = value;
      this.getCategoriesList(this.getCategoryData)
    },
    changePagination (page) {
      this.getCategoryData.page = page;
      this.getCategoriesList(this.getCategoryData)
    },
    removeCategory (id) {
      Swal.fire({
        text: 'Are you sure you want to delete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#748C41',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this.deleteCategory({ id }).then(() => {
            this.$toast.success('Category has been deleted successfully!')
          }).catch(() => {
            this.$toast.error('Something went wrong!')
          })
        }
      })
    },
    restoreCategoryItem (id) {
      this.restoreCategory({ id }).then(() => {
        this.$toast.success('Category has been restored successfully!')
      }).catch(() => {
        this.$toast.error('Something went wrong!')
      })
    }
  }
}
</script>
<style scoped>
  ::v-deep(.vtl-table .vtl-thead .vtl-thead-th) {
    color: #fff;
    background-color: #6259ca;
    border-color: #6259ca;
  }
  ::v-deep(.vtl-table td),
  ::v-deep(.vtl-table tr) {
    border: none;
  }
  ::v-deep(.loading-mask) {
    width: calc(100% - 22px);
    height: calc(100% - 15px);
    left: 11px;
  }
  ::v-deep(.vtl-paging-info) {
    color: rgb(172, 0, 0);
  }
  ::v-deep(.vtl-paging-count-label),
  ::v-deep(.vtl-paging-page-label) {
    color: rgb(172, 0, 0);
  }
  ::v-deep(.vtl-paging-pagination-page-link) {
    border-color: #6259ca;
  }
</style>
