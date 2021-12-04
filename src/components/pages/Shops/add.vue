<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="main-content-title tx-24 mg-b-5">{{isCreate ? 'Add' : 'Edit'}} Shop</h2>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="$router.go(-1)">Back</a></li>
          <li class="breadcrumb-item active" aria-current="page">{{isCreate ? 'Add' : 'Edit'}} Shop</li>
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
              <h6 class="main-content-label mb-1">Add Shop</h6>
              <p class="text-muted card-sub-title">Add Shop and Brunches.</p>
            </div>
            <div>
              <Form
                :initial-values="formData"
                class="d-flex flex-column"
                @submit="formSubmit"
                :validation-schema="schema"
              >
                <TextInput
                  name="name"
                  :value="formData.name"
                  type="text"
                  label="Name"
                  placeholder="Shop Name"
                />
                <div class="form-group" >
                  <label>Description</label>
                  <ckeditor
                          name="description"
                          :editor="editor"
                          v-model="formData.description"
                  ></ckeditor>
                  <p v-if="formData.description === '' && descriptionIsTouched">Description is required</p>
                </div>
                <div class="accordion mb-4">
                  <legend class="col-form-label col-sm-12 pt-0 font-weight-bold">Branches</legend>
                  <div class="accordion-item" v-for="(branch, index ) in formData.branches" :key="index">
                    <h2 class="accordion-header">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" :aria-controls="'#collapse' + index">
                        {{branch.name}}
                      </button>
                    </h2>
                    <div :id="'collapse' + index" class="accordion-collapse collapse">
                      <div class="accordion-body">
                        <fieldset class="form-group">
                          <div class="row p-2">
                            <div class="col-sm-12 border mb-2 p-2 shadow-2">
                              <div class="form-group">
                                <label class="font-weight-bold">
                                  Branch Name
                                </label>
                                <p class="ml-2 font-italic">{{branch.name}}</p>
                              </div>
                              <div class="form-group">
                                <label class="font-weight-bold">
                                  Address
                                </label>
                                <p class="ml-2 font-italic">{{branch.address}}</p>
                              </div>
                              <div>
                                <legend class="fs-18 pt-0 font-weight-bold">Phone Numbers</legend>
                                <div>
                                  <div class="form-group pl-3" v-for="(phone, i) in branch.phone_numbers" :key="`phone- ${i} - ${index}`">
                                    <label class="font-weight-semibold">
                                      Phone
                                    </label>
                                    <p class="ml-2 font-italic">{{phone.phone}}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-end mt-2">
                    <button class="btn ripple btn-main-primary" @click="showAddBranchModal = true">Add New Branch +</button>
                  </div>
                </div>
                <button class="btn ripple btn-main-primary">Save</button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="showAddBranchModal" title="Add New Branch" hide-footer>
      <div class="row justify-content-center p-4">
        <div class="col-11">
          <Form
            @submit="branchFormSubmit"
            :initial-values="branchFormData"
            :validation-schema="branchFormSchema"
          >
            <TextInput
                    name="name"
                    type="text"
                    label="Branch Name"
                    placeholder="Shop Name"
            />
            <TextInput
                    name="address"
                    type="text"
                    label="Branch Address"
                    placeholder="Branch Address"
            />
            <FieldArray name="phone_numbers" v-slot="{ fields, push, remove }">
              <legend class="fs-18 pt-0 font-weight-bold">Phone Numbers</legend>
              <div
                v-for="(field, index) in fields"
                :key="field.key"
                class="d-flex justify-content-between"
              >
                <TextInput
                        class="flex-1"
                        :name="`phone_numbers[${index}].phone`"
                        type="text"
                        :placeholder="'Phone Number ' + (index + 1)"
                />
                <button type="button" class="btn btn-icon btn-outline-danger ml-3" v-if="index > 0" @click.prevent="remove(index)"><i class="fa fa-close"></i></button>
              </div>
              <button type="button" class="btn btn-main-primary" @click.prevent="push({phone: ''})">Add Phone Number +</button>
            </FieldArray>
            <div class="d-flex form-group justify-content-end">
              <button class="btn btn-main-primary">Save</button>
            </div>
          </Form>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Form, FieldArray } from 'vee-validate';
import * as Yup from 'yup';
import TextInput from '../../components/TextInput'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'CourseAdd',
  data () {
    return {
      tag: '',
      tags: [],
      editor: ClassicEditor,
      showVideo: false,
      isEdit: false,
      showAddBranchModal: false,
      descriptionIsTouched: false,
      buttonDisable: false,
      formData: {
        name: '',
        description: '',
        branches: []
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
    FieldArray,
    TextInput
  },
  computed: {
    ...mapState({
      shop: state => state.shop.shop
    })
  },
  setup() {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required('Name is required')
    });
    const branchFormSchema = Yup.object().shape({
      name: Yup.string()
        .required('Name is required'),
      address: Yup.string()
        .required('Address is required'),
      phone_numbers: Yup
        .array()
        .of(
          Yup.object().shape({
            phone: Yup.string().required().label("Phone"),
          })
        )
        .strict(),
    });

    return {
      branchFormSchema,
      schema
    };
  },
  created () {
    this.shopId = this.$route.params.id;
    console.log(this.shopId);
    if (this.shopId === 'add') {
      this.isEdit = false;
      this.isCreate = true;
      this.showVideo = true
    } else {
      this.isEdit = true;
      this.getShop(this.shopId).then(res => {
        this.formData = res.data;
      })
    }
  },
  methods: {
    ...mapActions({
      createShop: 'shop/createShop',
      getShop: 'shop/getShop',
      updateShop: 'shop/updateShop'

    }),
    branchFormSubmit(values) {
      this.formData.branches.push(values);
      this.showAddBranchModal = false;
    },
    x() {
      console.log(4444);
    },
    formSubmit () {
      console.log(555555555);
      // const form = document.getElementById('bookAddForm')
      // const formData = new FormData(form)
      // this.buttonDisable = true
      //
      // if (this.isCreate === true) {
      //   this.createBook(formData).then(() => {
      //     this.$toasted.success(this.$t('messages.success.courseCreated')).goAway(1500)
      //     this.$router.push('/books')
      //   }).catch(() => {
      //     this.$toasted.error(this.$t('messages.error.somethingWentWrong')).goAway(1500)
      //   }).finally(() => {
      //     this.buttonDisable = false
      //   })
      // } else {
      //   this.updateBook({ data: formData, id: this.$route.params.id }).then(() => {
      //     this.$toasted.success(this.$t('messages.success.courseUpdated')).goAway(1500)
      //     this.$router.push('/books')
      //   }).catch(() => {
      //     this.$toasted.error(this.$t('messages.error.somethingWentWrong')).goAway(1500)
      //   }).finally(() => {
      //     this.buttonDisable = false
      //   })
      // }
    }
  }
}
</script>
