<template>
<div>
  <div class="page-header">
    <div>
      <h2 class="main-content-title tx-24 mg-b-5">Smart Sale Shop</h2>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active" aria-current="page">Project Dashboard</li>
      </ol>
    </div>
    <div class="d-flex">
      <div class="justify-content-center">
        <button type="button" class="btn btn-primary my-2 btn-icon-text">
          <i class="fe fe-download-cloud mr-2"></i> Download Report
        </button>
      </div>
    </div>
  </div>
  <div class="row row-sm">
    <div class="col-sm-12 col-lg-12 col-xl-12">
      <div class="row row-sm  mt-lg-4">
        <div class="col-sm-12 col-lg-12 col-xl-12">
          <div class="card bg-primary custom-card card-box">
            <div class="card-body p-0">
              <div class="d-md-flex align-items-center">
                <div class="ml-md-4 img-bg ">
                  <div class="p-4 p-md-0">
                    <h4 class="d-flex  mb-3">
                      <span class="font-weight-bold text-white ">Find new clients with us!</span>
                    </h4>
                    <p class="tx-white-7 mb-1">Welcome to <b class="text-warning">Smart Sale</b>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row row-sm">
        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
          <div class="card custom-card">
            <div class="card-body">
              <div class="card-item">
                <div class="card-item-icon card-icon">
                  <i class="ti-shopping-cart-full" style="color: #6259ca"></i>
                </div>
                <div class="card-item-title mb-2">
                  <label class="main-content-label tx-13 font-weight-bold mb-1">Shop Count</label>
                  <span class="d-block tx-12 mb-0 text-muted">Total Shops in Smart Sale</span>
                </div>
                <div class="card-item-body">
                  <div class="card-item-stat">
                    <h4 class="font-weight-bold">{{dashboard.shop_count}}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
          <div class="card custom-card">
            <div class="card-body">
              <div class="card-item">
                <div class="card-item-icon card-icon">
                  <i class="ti-map-alt" style="color: #6259ca"></i>
                </div>
                <div class="card-item-title mb-2">
                  <label class="main-content-label tx-13 font-weight-bold mb-1">Branch Count</label>
                  <span class="d-block tx-12 mb-0 text-muted">All Branch count in Smart Sale</span>
                </div>
                <div class="card-item-body">
                  <div class="card-item-stat">
                    <h4 class="font-weight-bold">{{dashboard.branches_count}}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-4">
          <div class="card custom-card">
            <div class="card-body">
              <div class="card-item">
                <div class="card-item-icon card-icon">
                  <i class="ti-dropbox-alt" style="color: #6259ca"></i>
                </div>
                <div class="card-item-title  mb-2">
                  <label class="main-content-label tx-13 font-weight-bold mb-1">Product Count</label>
                  <span class="d-block tx-12 mb-0 text-muted">All Product count in Smart Sale</span>
                </div>
                <div class="card-item-body">
                  <div class="card-item-stat">
                    <h4 class="font-weight-bold">{{dashboard.product_count}}</h4>
                  </div>
                </div>
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
export default {
  name: 'Dashboard',
  data () {
    return {
      userCountBy: 'day'
    }
  },
  computed: {
    ...mapState({
      dashboard: state => state.dashboard.dashboard
    }),
  },
  created () {
    this.getDashboardData()
  },
  methods: {
    ...mapActions({
      getDashboardData: 'dashboard/getDashboardData',
    }),
  }
}
</script>
