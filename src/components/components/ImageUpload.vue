<template>
  <validationProvider tag="div" class="pt-0" >
    <label class="form-label">{{ label }}</label>
    <label class="upload" @dragover="dragover" @dragleave="dragleave" @drop="drop('FileDoc',$event)">
      <div class="add">
        <img src="../../assets/img/svgs/cloud-computing.svg" width="49px" alt="">
      </div>
      <div class="info">{{info}}</div>
      <div class="choose-file cursor-pointer">
        <input ref="file" class="cursor-pointer" :accept="accept"
               @change="fileUpload($event.target.files)" :name="name" :multiple="isMultiple" type="file">
        <button class="choose btn">Drag and drop a file here or click</button>
      </div>
      <div v-if="startFileDownload" class="upload-loading">
        <b-spinner variant="primary" label="Spinning"></b-spinner>
      </div>
    </label>
    <div class="uploaded-files">
      <div v-if="uploadType === 'oneImage' && files" class="d-flex flex-wrap" >
        <div class="item">
          <img :src="files.path" alt="file" v-if="files">
        </div>
      </div>
      <div v-if="uploadType === 'oneImageType' && files" class="d-flex flex-wrap" >
        <div class="item">
          <img :src="files.path" alt="file" v-if="files">
        </div>
      </div>
      <div v-if="uploadType === 'image'" class="d-flex flex-wrap" >
          <div class="item" v-for="(file, index) in files" :key="index" >
            <a v-if="isMultiple" class="delete-btn" href="#" @click.prevent="deleteFile(index, files[0].id)">
              <i class="fa fa-times"></i>
            </a>
            <img :src="uploadType === 'image' ? files[0].path  : uploadType === 'images' ?  file : ''" alt="file" v-if=" uploadType=== 'image' || uploadType === 'images'">
         </div>
      </div>
      <div v-if="uploadType === 'images'" class="d-flex flex-wrap" >
        <div class="item" v-for="(file, index) in files" :key="index" @click.prevent="deleteFile(index, file.id)">
          <a v-if="isMultiple" class="delete-btn" href="#">
            <i class="fa fa-times"></i>
          </a>
          <img :src="file.path" alt="file" v-if=" uploadType=== 'image' || uploadType === 'images'">
        </div>
      </div>
      <div class="item"   v-else-if="uploadType === 'video'  && files.length>0" >
          <a  class="delete-btn" href="#" @click.prevent="deleteFile(0, files[0].id)">
            <i class="fa fa-times"></i>
          </a>
          <video :src="files[0].path" class="w-100 h-100" v-if="uploadType === 'video'"></video>
      </div>
      <div class="item item-file d-contents"   v-else-if="uploadType === 'files' && files.length>0">
        <div class="item" v-for="(file, index) in files" :key="index" >
          <a v-if="isMultiple" class="delete-btn" href="#" @click.prevent="deleteFile(index, file.id)">
            <i class="fa fa-times"></i>
          </a>
          <img src="./../../assets/img/file.png" alt="">
        </div>
      </div>
      <div class="item item-file"   v-else-if="uploadType === 'file' && files.length>0" >
          <a  class="delete-btn" href="#" @click.prevent="deleteFile(0, files[0].id)">
            <i class="fa fa-times"></i>
          </a>
          <div>
            <img src="./../../assets/img/file.png" alt="">
          </div>
      </div>
      <div v-else-if="uploadType === 'audio'  && files.length>0" class="position-relative">
            <a  class="audio-delete position-absolute " href="#" @click.prevent="deleteFile(0, files[0].id)">
              <i class="fa fa-times"></i>
            </a>
           <audio controls >
             <source :src="files[0].path" type="audio/ogg">
            </audio>
       </div>
    </div>
  </validationProvider>
</template>
<script>

import { mapActions } from 'vuex'
import Swal from 'sweetalert2'
export default {
  name: 'ImageUpload',
  props: {
    isMultiple: {
      type: Boolean,
      required: false,
      default: false
    },
    uploadType: {
      type: String,
      default: 'image'
    },
    name: {
      type: String,
      required: false
    },
    page: {
      type: String,
      required: false
    },
    accept: {
      type: String,
      required: false
    },
    label: {
      type: String,
      required: false
    },
    filesData: null,
    info: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      startFileDownload: false,
      files: []
    }
  },
  created () {
    if (this.filesData && this.filesData !== null) {
      if (this.uploadType === 'image') {
        this.files = this.filesData
      } else if (this.uploadType === 'images') {
        const file = []
        this.filesData.forEach(el => {
          if (el.file_path) {
            file.push({ path: el.file_path.small, id: el.id })
          } else {
            file.push(el.small)
          }
        })
        this.files = file
      } else if (this.uploadType === 'files') {
        this.files = this.filesData
      } else if (this.uploadType === 'oneImage') {
        if (this.filesData && this.filesData.length) {
          this.files = { path: this.filesData[0], id: '' }
        } else {
          this.files = null
        }
      } else if (this.uploadType === 'oneImageType') {
        if (this.filesData) {
          this.files = { path: this.filesData, id: '' }
        } else {
          this.files = null
        }
      } else if (this.uploadType === 'audio') {
        this.files = [{ path: this.filesData, id: '' }]
      } else {
        this.files = [this.filesData]
      }
    } else {
      if (this.uploadType === 'oneImage') {
        this.files = null
      }
      if (this.uploadType === 'oneImageType') {
        this.files = null
      }
    }
  },
  methods: {
    ...mapActions({
      deleteFileInteresting: 'interesting/deleteFileInteresting',
      deleteFileMaterial: 'otherMaterial/deleteFileMaterial',
      deleteFileLessonBlock: 'lessonBlock/deleteFileLessonBlock',
      deleteFileTask: 'taskTest/deleteFileTask'
    }),
    fileUpload (files) {
      if (!this.uploadType === 'images' && !this.uploadType === 'files') {
        this.files = []
      }
      this.fileReader(files)
    },
    fileReader (files) {
      const _this = this
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = function (e) {
          if (_this.uploadType === 'oneImage' || _this.uploadType === 'oneImageType') {
            _this.files = { path: e.target.result, id: '' }
          } else if (_this.uploadType === 'audio') {
            _this.files = [{ path: e.target.result, id: '' }]
          } else {
            if (_this.isMultiple) {
              _this.files.push({ path: e.target.result, id: '' })
            } else {
              _this.files = [{ path: e.target.result, id: '' }]
            }
          }
        }
        reader.readAsDataURL(files[i])
      }
    },
    deleteFile () {
      Swal.fire({
        text: this.$t('message.warning.signOut'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#748C41',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('buttons.yes'),
        cancelButtonText: this.$t('buttons.no')
      }).then((result) => {
        if (result.value) {
          console.log(44444444);
        }
      })
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
    }
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
    &ed-file {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
    }
    &-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f2f2f2db;
      cursor: wait;
    }
    .add {
      margin-bottom: 10px;
    }
    .info {
      font-size: 16px;
      line-height: 24px;
      color: #000000;
      margin-bottom: 7px;
    }
    .small {
      font-size: 13px;
      line-height: 15px;
      letter-spacing: -0.312px;
      color: #5D5D5D;
      margin-bottom: 30px;
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
    .audio-delete{
      right: 0;
      top: -15px;
      border-radius:50% ;
      color: red;
    }
    .item {
      border: 1px solid #e9e9f3;
      border-radius: 2px;
      margin: 10px 10px;
      position: relative;
      padding: 5px;
      width: 80px;
      height: 80px;
      .file-item {
        background: linear-gradient(45deg, #2c38d869, #0014ff00);
        width: 100%;
        height: 100%;
      }
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
    .d-contents{
      display: contents;
    }
  }
</style>
