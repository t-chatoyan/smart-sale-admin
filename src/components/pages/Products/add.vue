<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="main-content-title tx-24 mg-b-5">{{isEdit ? 'Edit' : 'Add'}} Product</h2>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="$router.go(-1)">Back</a></li>
          <li class="breadcrumb-item active" aria-current="page">{{isEdit ? 'Edit' : 'Add'}} Product</li>
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
              <h6 class="main-content-label mb-1">{{isEdit ? 'Edit' : 'Add'}} Product</h6>
              <p class="text-muted card-sub-title">{{isEdit ? 'Edit' : 'Add'}} Product.</p>
            </div>
            <div>
              <Form
                :initial-values="formData"
                class="d-flex flex-column"
                @submit="formSubmit"
                :validation-schema="schema"
                id="addProduct"
              >
                <div>
                  <label class="form-label">Logo:</label>
                  <label class="upload" @dragover="dragover" @dragleave="dragleave" @drop="drop('FileDoc',$event)">
                    <div class="add">
                      <img src="../../../assets/img/svgs/cloud-computing.svg" width="49px" alt="">
                    </div>
                    <div class="choose-file cursor-pointer">
                      <input ref="photo" class="cursor-pointer" accept="image/png,image/jpeg,image/jpg"
                             @change="fileUpload($event.target.files)" name="photos[]" type="file" :multiple="true">
                      <button class="choose btn">Drag and drop a file here or click</button>
                    </div>
                  </label>
                  <div class="uploaded-files" v-if="formData.photos && formData.photos.length">
                    <div class="d-flex flex-wrap" >
                      <div class="item" v-for="(photo, index) in formData.photos" :key="index" @click.prevent="deleteFile(index, photo.id)">
                        <a class="delete-btn" href="#">
                          <i class="fa fa-times"></i>
                        </a>
                        <img :src="photo.path" alt="photo">
                      </div>
                    </div>
                  </div>
                </div>
                <TextInput
                  name="name"
                  v-model="formData.name"
                  type="text"
                  label="Name"
                  placeholder="Name"
                />
                <TextInput
                  name="description"
                  v-model="formData.description"
                  type="text"
                  label="Description"
                  placeholder="Description"
                />
                <div class="form-group" >
                  <label>Short Description</label>
                  <ckeditor
                    name="short_description"
                    :editor="editor"
                    v-model="formData.short_description"
                  ></ckeditor>
                  <p class="invalid-feedback d-block" v-if="formData.short_description === '' && shortDescriptionIsTouched">Short Description is required</p>
                </div>
                <TextInput
                  name="old_price"
                  v-model="formData.old_price"
                  type="number"
                  label="Price"
                  placeholder="Price"
                  :removeArrow="true"
                />
                <TextInput
                  name="discount"
                  v-model="formData.discount"
                  type="number"
                  label="Discount"
                  placeholder="Discount"
                  :removeArrow="true"
                />
                <TextInput
                  name="price"
                  v-model="formData.price"
                  type="number"
                  label="New Price"
                  placeholder="New Price"
                  :removeArrow="true"
                />
                <div class="mb-4">
                  <Multiselect
                          v-model="shop"
                          :options="userShopsList"
                          :object="true"
                          :showOptions="true"
                          label="name"
                          valueProp="id"
                          placeholder="Select Shop"
                          @select="selectShops"
                  />
                  <p class="invalid-feedback d-block" v-if="formData.shop_id === '' && shopIsTouched">Shop is required</p>
                </div>
                <div class="mb-4">
                  <Multiselect
                          v-model="categories"
                          :options="categoriesList"
                          :object="true"
                          :showOptions="true"
                          label="title"
                          valueProp="id"
                          placeholder="Select Category"
                          @select="selectCategory"
                  />
                  <p class="invalid-feedback d-block" v-if="categories && categoriesIsTouched">Categories is required</p>
                </div>
                <div class="mb-4" v-if="subCategoriesList && subCategoriesList.length">
                  <Multiselect
                          v-model="subCategories"
                          :options="subCategoriesList"
                          :object="true"
                          :showOptions="true"
                          label="title"
                          valueProp="id"
                          placeholder="Select Subcategories"
                          @select="selectSubCategory"
                  />
                  <p class="invalid-feedback d-block" v-if="subCategories && subCategoriesIsTouched">Subcategory is required</p>
                </div>
                <div class="form-group" >
                  <label for="is_available" class="mr-2">Is Available</label>
                  <input type="checkbox" id="is_available" name="is_available" v-model="formData.is_available">
                </div>
                <TextInput
                        v-if="formData.is_available"
                        name="in_stock"
                        v-model="formData.in_stock"
                        type="number"
                        label="In Stock"
                        placeholder="In Stock"
                        :removeArrow="true"
                />
                <button type="submit" class="btn ripple btn-main-primary" :disabled="buttonDisable" :class="buttonDisable ? 'button-readonly' : ''">Save</button>
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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Yup from 'yup';
import Multiselect from '@vueform/multiselect'
import Swal from 'sweetalert2'

export default {
  name: 'ProductAdd',
  data () {
    return {
      isEdit: false,
      shortDescriptionIsTouched: false,
      categoriesIsTouched: false,
      subCategoriesIsTouched: false,
      shopIsTouched: false,
      subCategoriesList: [],
      editor: ClassicEditor,
      categories: null,
      shop: null,
      subCategories: null,
      buttonDisable: false,
      formData: {
        name: '',
        code: '',
        description: '',
        short_description: '',
        price: '',
        old_price: '',
        discount: '',
        in_stock: '',
        is_available: false,
        categories: [],
        shop_id: '',
        photos: [],
        '1c_id': '',
      },
      isCreate: false,
    }
  },
  computed: {
    ...mapState({
      categoriesList: state => state.category.categoriesList,
      userShopsList: state => state.shop.userShopsList,
    }),
  },
  watch: {
    'formData.discount': function (newVal){
      if (newVal && newVal <= 100) {
        this.formData.price = this.formData.old_price - ((this.formData.old_price * newVal) / 100)
      } else {
        this.formData.price = this.formData.old_price
      }
    },
    'formData.old_price': function (newVal){
      if (this.formData.discount) {
        this.formData.price = newVal - ((this.formData.discount * newVal) / 100)
      } else {
        this.formData.price = this.formData.old_price
      }
    },
  },
  components: {
    Form,
    TextInput,
    Multiselect,
  },
  setup() {
    const schema = Yup.object().shape({
      discount: Yup.lazy((value) => (value === '' ? Yup.string() : Yup.number().min(1, 'Min value 1.').max(100, 'Max value 100.'))),
    });
    return {
      schema,
    };
  },
  created () {
    this.getUserShops({})
    this.getCategories({})
    this.productId = this.$route.params.id;

    if (this.productId === 'add') {
      this.isEdit = false;
      this.isCreate = true;
    } else {
      this.isEdit = true;
      this.getProduct(this.productId).then(res => {
        this.formData = res.data;
        if (this.formData.photos && this.formData.photos.length) {
          let photos = this.formData.photos
          this.formData.photos = []
          photos.map(item => {
            this.formData.photos.push({path: item.conversions.small, id: item.id});
          })
        }
        this.selectShops(this.formData.shop);
        this.selectCategory(this.formData.categories[0]);
        this.selectSubCategory(this.formData.categories[1])
      })
    }
  },
  methods: {
    ...mapActions({
      getProduct: 'product/getProduct',
      getCategories: 'category/getCategories',
      getUserShops: 'shop/getUserShops',
      createProduct: 'product/createProduct',
      updateProduct: 'product/updateProduct',
      deleteProductPhoto: 'product/deleteProductPhoto',
    }),
    formSubmit () {
      const form = document.getElementById('addProduct')
      const formData = new FormData(form);
      if (this.formData.short_description === '') {
        this.shortDescriptionIsTouched = true;
        return false
      } else {
        formData.append('short_description', this.formData.short_description)
      }
      if (this.formData.is_available) {
        formData.set('is_available', 1)
      } else {
        formData.set('is_available', 0)
        formData.set('in_stock', 0)
      }
      if (this.shop) {
        formData.append('shop_id', this.shop.id)
      } else {
        this.shopIsTouched = true
        return null;
      }
      if (this.categories) {
        formData.append('categories[0]', this.categories.id)
      } else {
        this.categoriesIsTouched = true
        return null;
      }
      if (this.subCategories) {
        formData.set('categories[1]', this.subCategories.id)
      } else {
        this.subCategoriesIsTouched = true
        return null;
      }

      this.buttonDisable = true;

      if (this.isCreate === true) {
        this.createProduct(formData).then(() => {
          this.$toast.success('Product has been created successfully!')
          this.$router.push('/products')
        }).catch(() => {
          this.$toast.error('Something went wrong!')
        }).finally(() => {
          this.buttonDisable = false
        })
      } else {
        this.updateProduct({ data: formData, id: this.productId }).then(() => {
          this.$toast.success('Product has been updated successfully!')
          this.$router.push('/products')
        }).catch(() => {
          this.$toast.error('Something went wrong!')
        }).finally(() => {
          this.buttonDisable = false
        })
      }
    },
    selectCategory (option) {
      this.formData.categories.push(option.id)
      this.categories = option
      if (this.isEdit) {
        this.categoriesList.map(item => {
          if (item.id === option.id) {
            this.subCategoriesList = item.children
          }
        })
      } else {
        this.subCategoriesList = option.children
      }
    },
    selectSubCategory (option) {
      this.formData.categories.push(option.id)
      this.subCategories = option
    },
    selectShops (option) {
      this.formData.shop_id = option.id
      this.shop = option
    },
    fileUpload (files) {
      this.fileReader(files)
    },
    dragover (event) {
      event.preventDefault()
      event.currentTarget.style.border = '3px solid #5152C6'
    },
    dragleave (event) {
      event.currentTarget.style.border = '2px dashed #dcd9f5'
    },
    drop (type, event) {
      event.preventDefault()
      this.fileReader(event.dataTransfer.files)
      event.currentTarget.style.border = '2px dashed #dcd9f5'
    },
    fileReader (files) {
      const _this = this;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function (e) {
          _this.formData.photos.push({ path: e.target.result, id: '' })
        };
        reader.readAsDataURL(files[i])
      }
    },
    deleteFile (index, id = '') {
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
          if (id !== '') {
            this.deleteProductPhoto(id).then(res => {
              console.log(res);
              this.files = this.files.filter(el => el.id !== id)
              this.$refs.photo.value = null
            })
          } else {
            this.formData.photos = this.formData.photos.filter((el, ind) => ind !== index)
            this.$refs.photo.value = null
          }
        }
      })
    },
  }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
