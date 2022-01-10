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
              <b-table :items="categoriesList" :fields="tableFields">
                <template #cell(index)="row">
                  <div>{{row.items}}</div>
                </template>
                <template #cell(image)="row">
                  <img class="img-sm" v-if="row.image" :src="row.logo" alt="">
                  <img class="img-sm" v-else src="@/assets/img/no-image.png" alt="">
                </template>
                <template #cell(title)="row">
                  <p v-html="row.value"></p>
                </template>
                <template #cell(id)="row">
                  <router-link :to="`/category/${row.value}`" class="btn btn-outline-primary mr-2 mt-1 mb-1">
                    <i class="fe fe-edit"></i>
                  </router-link>
                  <button v-if="row.value === 'active'" @click="removeCategory(row.item.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                    <i class="ti-close"></i>
                  </button>
                  <div v-else class="d-inline-block">
                    <button @click="restoreCategory(row.item.id)" type="button" class="btn btn-outline-success mr-2 mt-1 mb-1">
                      <i class="fe fe-rotate-ccw"></i>
                    </button>
                    <button @click="removeCategory(row.item.id)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
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
      pagination: {}
    }
  },
  computed: {
    ...mapState({
      categoriesList: state => state.category.categoriesList
    }),
    tableFields () {
      return [
        { key: 'index', label: 'index' },
        {
          key: 'image',
          label: 'image',
          sortable: true
        },
        {
          key: 'title',
          label: 'title',
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
    this.getCategoriesList({})
  },
  methods: {
    ...mapActions({
      getCategories: 'category/getCategories',
    }),
    getCategoriesList (params) {
      this.getCategories(params).then(res => {
        this.pagination = res.pagination
      }).catch(() => {
        this.$toasted.error(this.$t('messages.error.somethingWentWrong')).goAway(1500)
      })
    },
    changePaginationPerPage (value) {
      this.getCategoriesList({ page: this.paginationCurrentPage, count: value })
    },
    changePagination (page) {
      this.getCategoriesList({ page: page, count: this.paginationPerPage })
    },
    removeCategory (id) {
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
    restoreCategory (id) {
      this.restoreCategory({ id }).then(() => {
      })
    }
  }
}
</script>
