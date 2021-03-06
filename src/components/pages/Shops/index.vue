<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="main-content-title tx-24 mg-b-5">Shops</h2>
      </div>
      <div class="d-flex">
        <div class="justify-content-center">
          <router-link to="/shop/add" type="button" class="btn btn-primary my-2 btn-icon-text">
            <i class="fe fe-plus-square mr-2"></i> Add Shop
          </router-link>
        </div>
      </div>
    </div>
    <div class="row row-sm">
      <div class="col-lg-12">
        <div class="card custom-card">
          <div class="card-body">
            <div>
              <h6 class="main-content-label mb-1">Shops List</h6>
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
                      :rows="shopsList"
                      @is-finished="tableIsLoading = false"
                      :is-hide-paging="true"
                      :sortable="sortable"
                      @do-search="filter"
              >
                <template  v-slot:description="data">
                  <div v-html="data.value.description"></div>
                </template>
                <template  v-slot:logo="data">
                  <div class="overflow-hidden rounded-2" style="width: 70px">
                    <img v-if="data.value.logo" :src="data.value.logo.conversions.small" :alt="data.name">
                  </div>
                </template>
                <template  v-slot:branches="data">
                  <div v-if="data.value.branches && data.value.branches.length">
                    <div v-for="(branch, index) in data.value.branches" :key="index" class="d-flex">
                      <p class="font-weight-bold mr-1">{{index + 1}}.</p>
                      {{branch.name}}
                    </div>
                  </div>
                  <div v-else>No branch</div>
                </template>
                <template  v-slot:actions="data">
                  <router-link :to="`/shop/${data.value.id}`" class="btn btn-outline-primary mr-2 mt-1 mb-1">
                    <i class="fe fe-edit"></i>
                  </router-link>
                  <button v-if="data.value.status === 'active'" @click="removeShop(data.value.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                    <i class="ti-close"></i>
                  </button>
                  <div v-else class="d-inline-block">
                    <button @click="restoreShopItem(data.value.id)" type="button" class="btn btn-outline-success mr-2 mt-1 mb-1">
                      <i class="fe fe-rotate-ccw"></i>
                    </button>
                    <button @click="removeShop(data.value.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                      <i class="fe fe-trash-2"></i>
                    </button>
                  </div>
                </template>
              </table-lite>
              <div class="d-flex justify-content-end  mt-3">
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
  name: 'Books',
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
      getShopsData: {
        page: '',
        count: '',
        sort: '',
        search: ''
      },
    }
  },
  components: {
    TableLite,
    VPagination,
  },
  computed: {
    ...mapState({
      shopsList: state => state.shop.shopsList
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
          field: 'logo',
          label: 'logo',
        },
        {
          field: 'name',
          label: 'name',
          sortable: true,
          isKey: true,
        },
        {
          field: 'description',
          label: 'description',
          sortable: true,
          isKey: true,
        },
        {
          field: 'branches',
          label: 'branches',
        },
        {
          field: 'actions',
          label: 'actions',
        }
      ]
    }
  },
  created () {
    this.getShopsData.sort = `${this.sortable.order}.${this.sortable.sort}`;
    this.getShopsList(this.getShopsData)
  },
  methods: {
    ...mapActions({
      getShops: 'shop/getShops',
      restoreShop: 'shop/restoreShop',
      deleteShop: 'shop/deleteShop',
    }),
    getShopsList (params) {
      this.tableIsLoading = true;
      this.getShops(params).then(res => {
        this.pagination = res.pagination
      }).catch(() => {
        this.$toast.error('Something went wrong!')
      }).finally(() => {
        this.tableIsLoading = false;
      })
    },
    searchItem (value) {
      this.getShopsData.search = value;
      this.getShopsList(this.getShopsData)
    },
    filter (offset, limit, order, sort) {
      this.getShopsData.sort = `${order}.${sort}`;
      this.getShopsList(this.getShopsData)
    },
    changePaginationPerPage (value) {
      this.getShopsData.count = value;
      this.getShopsList(this.getShopsData)
    },
    changePagination (page) {
      this.getShopsData.page = page;
      this.getShopsList(this.getShopsData)
    },
    removeShop (id) {
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
          this.deleteShop({ id }).then(() => {
            this.$toast.success('Shop has been deleted successfully!')
          }).catch(() => {
            this.$toast.error('Something went wrong!')
          })
        }
      })
    },
    restoreShopItem (id) {
      this.restoreShop({ id }).then(() => {
        this.$toast.success('Shop has been restored successfully!')
      }).catch(() => {
        this.$toast.error('Something went wrong!')
      })
    }
  }
}
</script>
<style scoped lang="scss">
  ::v-deep(.vtl-table .vtl-thead .vtl-thead-th) {
    color: #fff;
    background-color: #6259ca;
    border-color: #6259ca;
  }
  ::v-deep(.vtl-table td),
  ::v-deep(.vtl-table tr) {
    border: none;
  }
  ::v-deep(.vtl-paging-info) {
    color: rgb(172, 0, 0);
  }
  ::v-deep(.loading-mask) {
    width: calc(100% - 22px);
    height: calc(100% - 15px);
    left: 11px;
  }
  ::v-deep(.vtl-paging-count-label),
  ::v-deep(.vtl-paging-page-label) {
    color: rgb(172, 0, 0);
  }
  ::v-deep(.vtl-paging-pagination-page-link) {
    border-color: #6259ca;
  }
</style>
