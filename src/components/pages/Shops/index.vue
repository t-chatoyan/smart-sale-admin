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
              <b-table :items="shopsList" :fields="tableFields">
                <template #cell(logo)="row">
                  <img class="img-sm" v-if="row.logo" :src="row.logo" alt="">
                  <img class="img-sm" v-else src="@/assets/img/no-image.png" alt="">
                </template>
                <template #cell(description)="row">
                  <p v-html="row.value"></p>
                </template>
                <template #cell(branches)="row">
                  <p class="mb-1" v-for="(branch, i) in row.value" :key="i">
                    {{branch.address}}
                  </p>
                </template>
                <template #cell(id)="row">
                  <div>{{row.value}}</div>
                  <router-link :to="`/shop/${row.value}`" class="btn btn-outline-primary mr-2 mt-1 mb-1">
                    <i class="fe fe-edit"></i>
                  </router-link>
                  <button v-if="row.value === 'active'" @click="removeShop(row.item.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                    <i class="ti-close"></i>
                  </button>
                  <div v-else class="d-inline-block">
                    <button @click="restShop(row.item.id)" type="button" class="btn btn-outline-success mr-2 mt-1 mb-1">
                      <i class="fe fe-rotate-ccw"></i>
                    </button>
                    <button @click="removeShop(row.item.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                      <i class="fe fe-trash-2"></i>
                    </button>
                  </div>
                </template>
              </b-table>
              <div class="d-flex justify-content-end  mt-3">
                <div class="mr-3">
                  <b-form-select
                    @change="changePaginationPerPage"
                    style="width: 80px"
                    v-model="paginationPerPage"
                    :options="paginationOptions"
                  >
                  </b-form-select>
                </div>
                <div>
                  <b-pagination
                    class="m-0"
                    @change="changePagination"
                    v-model="paginationCurrentPage"
                    :total-rows="pagination.count"
                    :per-page="paginationPerPage"
                    first-text="<<"
                    prev-text="<"
                    next-text=">"
                    last-text=">>"
                  ></b-pagination>
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
      pagination: {}
    }
  },
  computed: {
    ...mapState({
      shopsList: state => state.shop.shopsList
    }),
    tableFields () {
      return [
        { key: 'index', label: 'index' },
        {
          key: 'logo',
          label: 'logo',
          sortable: true
        },
        {
          key: 'name',
          label: 'Name',
          sortable: true
        },
        {
          key: 'description',
          label: 'description',
          sortable: true
        },
        {
          key: 'branches',
          label: 'branches',
          sortable: true
        },
        {
          key: 'id',
          label: 'actions',
          sortable: false
        }
      ]
    }
  },
  created () {
    this.getShopsList({})
  },
  methods: {
    ...mapActions({
      getShops: 'shop/getShops',
    }),
    getShopsList (params) {
      this.getShops(params).then(res => {
        this.pagination = res.pagination
      }).catch(() => {
        this.$toasted.error(this.$t('messages.error.somethingWentWrong')).goAway(1500)
      })
    },
    changePaginationPerPage (value) {
      this.getShopsList({ page: this.paginationCurrentPage, count: value })
    },
    changePagination (page) {
      this.getShopsList({ page: page, count: this.paginationPerPage })
    },
    removeShop (id) {
      Swal.fire({
        text: this.$t('messages.warning.delete'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#748C41',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('buttons.yes'),
        cancelButtonText: this.$t('buttons.no')
      }).then((result) => {
        if (result.value) {
          this.deleteBook({ id }).then(() => {
          }).catch(() => {
            this.$toasted.error(this.$t('messages.error.somethingWentWrong')).goAway(1500)
          })
        }
      })
    },
    restShop (id) {
      this.restoreShop({ id }).then(() => {
      })
    }
  }
}
</script>
