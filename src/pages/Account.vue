<template>
  <div class="account-page">
    <q-drawer
      v-model="drawer"
      :width="200"
      bordered
      overlay>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item active clickable v-ripple>
            <q-item-section>
              Calendar
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              Account
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

const menuList = [
  {
    icon: 'inbox',
    label: 'Inbox',
    separator: true
  },
  {
    icon: 'send',
    label: 'Outbox',
    separator: false
  },
  {
    icon: 'delete',
    label: 'Trash',
    separator: false
  },
  {
    icon: 'error',
    label: 'Spam',
    separator: true
  },
  {
    icon: 'settings',
    label: 'Settings',
    separator: false
  },
  {
    icon: 'feedback',
    label: 'Send Feedback',
    separator: false
  },
  {
    icon: 'help',
    iconColor: 'primary',
    label: 'Help',
    separator: false
  }
]

</script>

<style lang="scss">
.account-page {
  .q-drawer-container .q-drawer {
    top: 50px;
  }
}
</style>
