<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center bg_login">
    <CContainer class="d-flex justify-content-center">
      <div class="wrap_login justify-content-center">
        <div class="d-flex justify-content-center w-100 js-tilt mb-3" data-tilt>
          <CImage class="d-flex justify-content-center m-auto" fluid src="/icons/404_error.svg"
                  width="200" height="200"/>
        </div>
        <CForm class="w-100">
          <h1 class="text-center">Ошибка!</h1>
          <CButton color="primary" type="button" @click="goMain"
                   class="d-flex w-100 justify-content-center m-auto mt-3 border-radius-10 button-login">На главную</CButton>
        </CForm>
      </div>
    </CContainer>
  </div>
</template>

<script lang="ts" setup>
const goMain = () => {
  window.location.href = '/'
}
</script>
