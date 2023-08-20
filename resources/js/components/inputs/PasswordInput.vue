<script setup lang="ts">
import {ref} from "vue"

const props = defineProps({
  modelValue: {
    type: String,
  },
  errors: {
    type: Array
  },
  validated: {
    type: Boolean
  }
});

const emit = defineEmits(['update:modelValue'])

const passwordHidden = ref(true)

const changePasswordVisibility = () => {
  passwordHidden.value = !passwordHidden.value;
  document.getElementById('passwordInput').setAttribute('type', passwordHidden.value ? 'password' : 'text')
}
</script>

<template>
  <CInputGroup class="hidden-password mb-3">
    <CFormInput @input="emit('update:modelValue', $event.target.value)"
                :valid="!Object.prototype.hasOwnProperty.call(errors, 'password') && validated"
                :invalid="Object.prototype.hasOwnProperty.call(errors, 'password') && validated"
                :feedback="Object.prototype.hasOwnProperty.call(errors, 'password') ? errors.password[0] : ''"
                id="passwordInput" placeholder="Пароль" floatingLabel="Пароль" type="password"/>
    <CInputGroupText class="cursor-pointer h-58px" @click="changePasswordVisibility">
      <CIcon icon="cilEnvelopeClosed" v-if="passwordHidden"/>
      <CIcon icon="cilEnvelopeOpen" v-else/>
    </CInputGroupText>
  </CInputGroup>
</template>

<style scoped lang="scss">
  .hidden-password {
    & > .input-group-text {
      background: var(--cui-body-bg);
    }
  }

  .h-58px {
    height: 58px;
  }
</style>
