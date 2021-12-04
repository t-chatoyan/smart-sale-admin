<template>
    <div class="form-group" >
        <label :for="name" v-if="label">{{ label }}</label>
        <input
                :class="{ 'is-invalid': !!errorMessage, success: meta.valid }"
                class="form-control"
                :name="name"
                :id="name"
                :type="type"
                :value="inputValue"
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
      value: {
        type: String,
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
    },

    setup(props) {
      const {
        value: inputValue,
        errorMessage,
        handleBlur,
        handleChange,
        meta,
      } = useField(props.name, undefined, {
        initialValue: props.value,
      });

      return {
        handleChange,
        handleBlur,
        errorMessage,
        inputValue,
        meta,
      };
    },
  };
</script>