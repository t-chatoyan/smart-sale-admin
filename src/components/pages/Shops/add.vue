<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="main-content-title tx-24 mg-b-5">{{isEdit ? 'Edit' : 'Add'}} Shop</h2>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="$router.go(-1)">Back</a></li>
          <li class="breadcrumb-item active" aria-current="page">{{isEdit ? 'Edit' : 'Add'}} Shop</li>
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
              <h6 class="main-content-label mb-1">{{isEdit ? 'Edit' : 'Add'}} Shop</h6>
              <p class="text-muted card-sub-title">{{isEdit ? 'Edit' : 'Add'}} Shop and Brunches.</p>
            </div>
            <div>
              <Form
                :initial-values="formData"
                class="d-flex flex-column"
                @submit="formSubmit"
                :validation-schema="schema"
                id="addShop"
              >
                <div>
                  <label class="form-label">Logo:</label>
                  <label class="upload" @dragover="dragover" @dragleave="dragleave" @drop="drop('FileDoc',$event)">
                    <div class="add">
                      <img src="../../../assets/img/svgs/cloud-computing.svg" width="49px" alt="">
                    </div>
                    <div class="choose-file cursor-pointer">
                      <input ref="file" class="cursor-pointer" accept="image/png,image/jpeg,image/jpg"
                             @change="fileUpload($event.target.files)" name="logo" type="file">
                      <button class="choose btn">Drag and drop a file here or click</button>
                    </div>
                  </label>
                  <div class="uploaded-files" v-if="formData.logo">
                    <div class="d-flex flex-wrap" >
                      <div class="item">
                        <img :src="formData.logo" alt="file" v-if="formData.logo">
                      </div>
                    </div>
                  </div>
                </div>
                <TextInput
                  name="name"
                  v-model="formData.name"
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
                  <p class="invalid-feedback d-block" v-if="formData.description === '' && descriptionIsTouched">Description is required</p>
                </div>
                <div class="accordion mb-4">
                  <legend class="col-form-label col-sm-12 pt-0 font-weight-bold">Branches</legend>
                  <div class="accordion-item" v-for="(branch, index ) in formData.branches" :key="index">
                    <h2 class="accordion-header">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" :aria-controls="'#collapse' + index">
                        <div class="d-flex justify-content-between align-items-center w-100">
                          <div>{{branch.name}}</div>
                          <button @click="removeBranch(branch.id, index)" type="button" class="btn btn-outline-danger mr-2 mt-1 mb-1">
                            <i class="fe fe-trash-2"></i>
                          </button>
                        </div>
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
                    <button type="button" class="btn ripple btn-main-primary" @click="showAddBranchModal = true">Add New Branch +</button>
                  </div>
                </div>
                <button class="btn ripple btn-main-primary" type="submit" :disabled="buttonDisable" :class="buttonDisable ? 'button-readonly' : ''">Save</button>
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
            id="branchFormData"
          >
            <TextInput
                    name="name"
                    type="text"
                    label="Branch Name"
                    placeholder="Shop Name"
                    v-model="branchFormData.name"
            />
            <TextInput
                    name="address"
                    type="text"
                    label="Branch Address"
                    placeholder="Branch Address"
                    v-model="branchFormData.address"
            />
            <FieldArray name="phone_numbers" key-path="phone" v-slot="{ fields, push, remove }">
              <legend class="fs-18 pt-0 font-weight-bold">Phone Numbers</legend>
              <div
                v-for="(field, index) in fields"
                :key="field.key"
                class="d-flex justify-content-between"
              >
                <TextInput
                  v-if="branchFormData.phone_numbers[index]"
                  class="flex-1"
                  :name="`phone_numbers[${index}].phone`"
                  type="text"
                  v-model="branchFormData.phone_numbers[index].phone"
                  :placeholder="'Phone Number ' + (index + 1)"
                />
                <button type="button" class="btn btn-icon btn-outline-danger ml-3" v-if="index > 0" @click.prevent="remove(index)"><i class="fa fa-close"></i></button>
              </div>
              <button type="button" class="btn btn-main-primary" @click.prevent="() => {branchFormData.phone_numbers.push({ phone: '' }); push({ phone: '' })}">Add Phone Number +</button>
            </FieldArray>
            <div class="mt-3" >
              <legend class="fs-18 pt-0 font-weight-bold">Working Days</legend>
              <div class="d-flex">
                <div class="mr-4">
                  <input type="radio" id="always-open" value="always" v-model="workingDays">
                  <label class="ml-1" for="always-open">Always open</label>
                </div>
                <div>
                  <input type="radio" id="selected" value="selected" v-model="workingDays">
                  <label class="ml-1" for="selected">Open on selected hours</label>
                </div>
              </div>
              <div class="form-group" v-if="workingDays === 'selected'">
                <div v-for="(item, index) in working_days" :key="index" class="d-flex align-items-center mb-3">
                  <div class="mr-4 fw-normal fs-7 text-capitalize" style="width: 100px">{{item.name}}</div>
                  <Datepicker name="" v-model="item.value" timePicker range />
                </div>
              </div>
            </div>
            <div class="d-flex form-group justify-content-end">
              <button type="submit" class="btn btn-main-primary">Save</button>
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
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
import Swal from 'sweetalert2'

export default {
  name: 'CourseAdd',
  data () {
    return {
      tag: '',
      workingDays: 'always',
      files: [],
      tags: [],
      editor: ClassicEditor,
      isEdit: false,
      showAddBranchModal: false,
      descriptionIsTouched: false,
      buttonDisable: false,
      formData: {
        name: '',
        description: '',
        branches: [],
        logo: '',
      },
      branchFormData: {
        name: '',
        address: '',
        working_days: {},
        phone_numbers: [
          {
            phone: ''
          }
        ]
      },
      working_days: [
        {
          name: 'monday',
          value: ''
        },
        {
          name: 'tuesday',
          value: ''
        },
        {
          name: 'wednesday',
          value: ''
        },
        {
          name: 'thursday',
          value: ''
        },
        {
          name: 'friday',
          value: ''
        },
        {
          name: 'saturday',
          value: ''
        },
        {
          name: 'sunday',
          value: ''
        },
      ],
      isCreate: false,
      shopId: ''
    }
  },
  components: {
    Form,
    FieldArray,
    TextInput,
    Datepicker
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
      schema,
    };
  },
  created () {
    this.shopId = this.$route.params.id;
    if (this.shopId === 'add') {
      this.isEdit = false;
      this.isCreate = true;
    } else {
      this.isEdit = true;
      this.getShop(this.shopId).then(res => {
        this.formData = res.data;
        if (this.formData.logo) {
          this.formData.logo = this.formData.logo.conversions.small;
        }
      })
    }
  },
  methods: {
    ...mapActions({
      createShop: 'shop/createShop',
      getShop: 'shop/getShop',
      updateShop: 'shop/updateShop',
      deleteBranch: 'shop/deleteBranch',
    }),
    branchFormSubmit(values) {
      let data = values;
      this.showAddBranchModal = false;
      const form = document.getElementById('branchFormData')
      if (this.workingDays === 'always') {
        data.working_days = {openAlways: true}
      } else {
        let weekDays = {}
        this.working_days.map((item, index) => {
          weekDays[index + 1] = item.value
        });
        data.working_days = weekDays
      }
      this.formData.branches.push(data);
      form.reset();
      this.branchFormData = {
        name: '',
        working_days: {},
        phone_numbers: [
          {
            phone: ''
          }
        ]
      };
      this.working_days.map(item => {
        item.value = '';
        return item;
      })
    },
    removeBranch (id = '', index) {
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
            this.deleteBranch({ id }).then(() => {
              this.formData.branches = this.formData.branches.filter(item => id !== item.id)
              this.$toast.success('Branch has been deleted successfully!')
            }).catch(() => {
              this.$toast.error('Something went wrong!')
            })
          } else {
            this.formData.branches = this.formData.branches.filter((item, i) => index !== i);
            this.$toast.success('Branch has been deleted successfully!')
          }
        }
      })
    },
    formSubmit () {
      const form = document.getElementById('addShop');
      const formData = new FormData(form);
      if (this.formData.description === '') {
        this.descriptionIsTouched = true;
        return false
      } else {
        formData.append('description', this.formData.description)
      }
      if (this.formData.branches && this.formData.branches.length) {
        this.formData.branches.map((item, index) => {
          if (!item.id) {
            formData.append('branches[' + index +'][name]', item.name);
            formData.append('branches[' + index +'][address]', item.address);
            formData.append('branches[' + index +'][working_days]', JSON.stringify(item.working_days));
            formData.append('branches[' + index +'][phone_numbers]', JSON.stringify(item.phone_numbers))
          }
        })
      } else {
        return false;
      }

      this.buttonDisable = true;

      if (this.isCreate === true) {
        this.createShop(formData).then(() => {
          this.$toast.success('Shop has been created successfully!')
          this.$router.push('/shops')
        }).catch(() => {
          this.$toast.error('Something went wrong!')
        }).finally(() => {
          this.buttonDisable = false
        })
      } else {
        this.updateShop({ data: formData, id: this.shopId }).then(() => {
          this.$toast.success('Shop has been updated successfully!')
          this.$router.push('/shops')
        }).catch(() => {
          this.$toast.error('Something went wrong!')
        }).finally(() => {
          this.buttonDisable = false
        })
      }
    },
    fileUpload (files) {
      this.formData.logo = ''
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
          _this.formData.logo = e.target.result
        };
        reader.readAsDataURL(files[i])
      }
    },
  }
}
</script>
<style lang="scss">
  .upload {
    border: 2px dashed #dcd9f5;
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 20px;
    min-height: 275px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    margin-bottom: 26px;
    position: relative;
    overflow: hidden;
    background-color: #f4f3ff;
    .add {
      margin-bottom: 10px;
    }
    .choose-file {
      position: relative;
      input {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 222;
      }
      .btn {
        height: 50px;
      }
    }
  }
  .uploaded-files {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    audio{
      &:focus{
        border: none;
        outline: none;
      }
    }
    .item {
      border: 1px solid #e9e9f3;
      border-radius: 2px;
      margin: 10px 10px;
      position: relative;
      padding: 5px;
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .delete-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 24px;
        height: 24px;
        text-align: center;
        background: #e56565;
        border-radius: 50%;
        line-height: 25px;
      }
    }
  }
</style>
