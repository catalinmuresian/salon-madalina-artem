<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-3 text-black">
      <q-toolbar>
        <div style="display: flex;align-items: center;gap: 10px;justify-content: space-between;width: 100%;">
          Salon Madalina Artem

          <div style="display: flex;align-items: center;gap: 10px">
            <q-btn dense flat no-caps to="/">Prima pagina</q-btn>
            <q-btn dense flat no-caps to="/booking">Programari</q-btn>
            <q-btn dense flat no-caps to="/account">Cont</q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>
