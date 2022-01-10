<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="main-content-title tx-24 mg-b-5">{{isCreate ? 'Add' : 'Edit'}} Category</h2>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="$router.go(-1)">Back</a></li>
          <li class="breadcrumb-item active" aria-current="page">{{isCreate ? 'Add' : 'Edit'}} Category</li>
        </ol>
      </div>
      <div class="d-flex">
      </div>
    </div>
    <div class="row row-sm justify-content-center">
      <div class="col-xl-7 col-lg-8 col-md-12">
        <div class="card custom-card">
          <div class="card-body">
            <div>
              <h6 class="main-content-label mb-1">Add Category</h6>
              <p class="text-muted card-sub-title">Add Category.</p>
            </div>
            <div>
              <Form
                :initial-values="formData"
                class="d-flex flex-column"
                @submit="formSubmit"
                :validation-schema="schema"
              >
                <TextInput
                  name="title"
                  :value="formData.name"
                  type="text"
                  label="Title"
                  placeholder="Category Title"
                />
                <div class="mb-4">
                  <Multiselect
                          v-model="subcategory"
                          :options="categoriesList"
                          :object="true"
                          :showOptions="true"
                          label="title"
                          valueProp="id"
                          placeholder="Select Subcategory"
                          @select="selectSubcategory"
                  />
                </div>
                <button class="btn ripple btn-main-primary">Save</button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Form } from 'vee-validate';
import TextInput from '../../components/TextInput'
import Multiselect from '@vueform/multiselect'

export default {
  name: 'CategoryAdd',
  data () {
    return {
      tag: '',
      tags: [],
      isEdit: false,
      showAddBranchModal: false,
      descriptionIsTouched: false,
      buttonDisable: false,
      subcategory: null,
      formData: {
        title: '',
        parent_id: '1',
        image: '',
      },
      branchFormData: {
        name: '',
        phone_numbers: [
          {
            phone: ''
          }
        ]
      },
      isCreate: false,
      shopId: ''
    }
  },
  components: {
    Form,
    TextInput,
    Multiselect,
  },
  computed: {
    ...mapState({
      categoriesList: state => state.category.categoriesList
    })
  },
  created () {
    this.getCategoriesList({});
    this.categoryId = this.$route.params.id;

    if (this.categoryId === 'add') {
      this.isEdit = false;
      this.isCreate = true;
    } else {
      this.isEdit = true;
      this.getCategory(this.categoryId).then(res => {
        this.formData = res.data;
      })
    }
  },
  methods: {
    ...mapActions({
      getCategory: 'category/getCategory',
      getCategories: 'category/getCategories',
    }),
    getCategoriesList (params) {
      this.getCategories(params).then(res => {
        this.pagination = res.pagination
      }).catch(() => {
        this.$toasted.error(this.$t('messages.error.somethingWentWrong')).goAway(1500)
      })
    },
    selectSubcategory (option) {
      this.formData.parent_id = option.id
      this.subcategory = option
    },
    formSubmit () {
      console.log(555555555);
    }
  }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
