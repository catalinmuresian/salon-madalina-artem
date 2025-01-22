<template>
  <div class="account-page">
    <q-drawer
      v-model="drawer"
      :width="200"
      bordered
      overlay>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item
            v-for="{label, id} in navLinks"
            @click="activeSection = id"
            :key="id"
            :active="activeSection === id"
            clickable
            v-ripple>
            <q-item-section>
              {{ label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script setup>
import {ref} from "vue";

const drawer = ref(true)

const activeSection = ref('calendar')

const navLinks = ref([
  {
    label: 'Calendar',
    id: 'calendar'
  },
  {
    label: 'Servicii',
    id: 'services'
  },
  {
    label: 'Cont',
    id: 'account'
  },
])

</script>

<style lang="scss">
.account-page {
  .q-drawer-container .q-drawer {
    top: 50px;
  }
}
</style>
