<template>
  <div class="account-page">
    <q-drawer
      v-model="drawer"
      :width="200"
      bordered
      overlay>
      <q-scroll-area class="fit">
        <q-list padding
                class="menu-list">
          <q-item
            v-for="{label, id} in navLinks"
            @click="handleTab(id)"
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
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      vertical
      transition-prev="jump-up"
      transition-next="jump-up">
      <q-tab-panel name="calendar">
        <div class="text-h4 q-mb-md">Calendar</div>
        <CalendarSection />
      </q-tab-panel>

      <q-tab-panel name="services">
        <div class="text-h4 q-mb-md">Servicii</div>
      </q-tab-panel>

      <q-tab-panel name="account">
        <div class="text-h4 q-mb-md">Cont</div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import {ref} from "vue";
import CalendarSection from 'components/Account/CalendarSection.vue'

const drawer = ref(true)
const tab = ref('calendar')

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

function handleTab (id) {
  activeSection.value = id
  tab.value = id
}

</script>

<style lang="scss">
.account-page {
  .q-drawer-container .q-drawer {
    top: 50px;
  }
  .q-tab-panels {
    margin-left: 200px;
  }
}
</style>
