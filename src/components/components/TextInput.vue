<template>
    <div class="form-group" >
        <label :for="name" v-if="label">{{ label }}</label>
        <input
          :class="{ 'is-invalid': !!errorMessage, success: meta.valid, 'remove-input-arrow': removeArrow }"
          class="form-control"
          :name="name"
          :id="name"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          @input="handleChange"
          @blur="handleBlur"
        />

        <p class="invalid-feedback" v-show="errorMessage">
            {{ errorMessage }}
        </p>
    </div>
</template>

<script>
  import {useField} from "vee-validate";

  export default {
    props: {
      type: {
        type: String,
        default: "text",
      },
      modelValue: {
        type: [String, Number],
        default: "",
      },
      name: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        default: "",
      },
      removeArrow: {
        type: Boolean,
        default: false,
      },
    },

    setup(props) {
      const {
        value: inputValue,
        errorMessage,
        handleBlur,
        meta,
      } = useField(props.name, undefined, {
        inputValue: props.value,
      });

      return {
        handleBlur,
        errorMessage,
        inputValue,
        meta,
      };
    },
    methods: {
      handleChange(event) {
        this.$emit("update:modelValue", event.target.value);
      }
    }
  };
</script>
