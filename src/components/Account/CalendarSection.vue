<template>
  <div class="calendar-section">
    <q-form style="max-width: 500px;display: flex;flex-direction: column;gap: 15px">
      <q-select
        v-model="selectedProvider"
        :options="listProviders"
        label="Selecteaza tehnician"
        option-value="value"
        option-label="label"
        @update:model-value="(val) => handleProvider(val)"
      />
      <q-date
        class="full-width"
        v-if="selectedProvider?.value"
        v-model="selectedDate"
        label="Select Date"
        landscape
        hint="Choose the date for your appointment"
        @update:model-value="updateAvailableHours"
        mask="YYYY-MM-DD"
        :locale="locale.date"
        :options="isDateAllowed"
        :events="disableDatesList"
        event-color="red"
      />
      <q-toggle
        style="justify-content: left;width: 130px;"
        v-if="selectedDate && selectedProvider"
        v-model="stateDay"
        color="green"
        @update:model-value="(val) => handleDisableDay(val)"
        label="Zi libera"
        left-label
      />
      <div v-if="existingAppointmentsList.length">
        <h6 style="margin: 0;">Programari existente</h6>
        <div v-for="({ start, end, appointmentDetails, id}, index) in existingAppointmentsList"
             :key="id"
             style="display: flex;flex-direction: column;">
          <div
            style="display: flex;align-items: center;justify-content: space-between">
            <span :style="appointmentDetails.value === 'off' && 'font-style: italic;color: #a2a2a2'">{{ `${start}-${end} - ${appointmentDetails.label}` }}</span>
            <q-btn rounded
                   flat
                   color="grey"
                   dense
                   size="12px"
                   icon="delete"
                   @click="handleDeleteAppointment(id)"
            />
          </div>
          <q-separator v-if="index + 1 !== existingAppointmentsList.length"
                       style="margin: 5px 0;"/>
        </div>
      </div>
      <div class="schedule-hours"
           v-if="!stateDay && selectedDate && startOptions.length">
        <span>Program de lucru</span>
        <div class="list-inputs">
          <q-select
            v-model="startSchedule"
            :options="startScheduleOptions"
            label="Ora de start"
            emit-value
            dense
            outlined
            @update:model-value="onScheduleStartChange"

          />
          <q-select
            v-model="endSchedule"
            :options="endScheduleOptions"
            label="Ora de incheiere"
            emit-value
            dense
            outlined
            :disable="!startSchedule"
          />
        </div>
        <q-btn v-if="endSchedule && (startSchedule !== schedule?.start || endSchedule !== schedule?.end)"
               class="full-width"
               style="margin-top: 15px"
               no-caps
               dense
               color="green"
               rounded
               @click="handleSaveSchedule">Salveaza
        </q-btn>
      </div>
      <div class="disable-hours"
           v-if="!stateDay && selectedDate && startOptions.length">
        <span>Interval ore libere</span>
        <div class="list-inputs">
          <q-select
            v-model="selectedStartTime"
            :options="startOptions"
            label="Ora de start"
            emit-value
            outlined
            dense
            @update:model-value="onStartTimeChange"
          />
          <q-select
            v-model="selectedEndTime"
            :options="endOptions"
            label="Ora de incheiere"
            emit-value
            dense
            outlined
            :disable="!selectedStartTime"
          />
        </div>
        <q-btn v-if="selectedEndTime"
               class="full-width"
               style="margin-top: 15px"
               no-caps
               dense
               color="green"
               rounded
               @click="handleSaveDisableHours">Salveaza
        </q-btn>
      </div>
      <div v-if="selectedDate">
        <q-chip
          v-for="hour in availableHours"
          :key="hour"
          :outline="selectedHour !== hour"
          @update:selected="() => handleValue(hour)"
          clickable
          color="primary"
          text-color="white">
          {{ hour }}
        </q-chip>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import {useStore} from "vuex";

const { state, commit } = useStore()
import ro from "quasar/lang/ro";

import {computed, nextTick, ref, watch} from "vue";
import {date} from "quasar";

const stateDay = ref(true);
const selectedHour = ref("");
const disableDatesList = ref([])
const selectedDate = ref("");
const availableHours = ref([]);
const startSchedule = ref(null);
const endSchedule = ref(null);
const selectedStartTime = ref(null);
const selectedEndTime = ref(null);
const locale = ro;
const selectedProvider = ref('')
const schedule = ref({})

const listProviders = computed(() => {
  return state.data.listProviders
})
const appointments = computed(() => {
  return state.data.appointments
});
const user = computed(() => {
  return state.data.user
})
const exceptionWeekendDays = computed(() => {
  return selectedProvider
    ? state.data.exeptionWeekendDays[selectedProvider.value?.value]
    : []
})
const disableDates = computed(() => {
  return state.data.disableDates
});
const scheduleModified = computed(() => {
  return state.data.scheduleModified
})
const existingAppointmentsList = computed(() => {
  return (selectedProvider.value?.value && selectedDate.value)
    ? appointments.value[selectedProvider.value?.value][selectedDate.value] || []
    : []
})
const startOptions = computed(() => {

  const startTimes = [];
  const occupiedTimes = new Set();
  // Get active appointments for the selected provider and selected date
  const providerAppointments = appointments.value[selectedProvider.value?.value] || {};
  const slots = providerAppointments[selectedDate.value] || [];

  // Add all start and end times from appointments to the occupied times set
  slots.forEach(slot => {
    occupiedTimes.add(slot.start);
    occupiedTimes.add(slot.end);
  });

  // Get start and end times from the schedule or default values
  let startHour = defaultSchedule.value[selectedProvider.value?.value]?.start || '10:00';
  let endHour = defaultSchedule.value[selectedProvider.value?.value]?.end || '17:00';

  const schedule = scheduleModified.value[selectedProvider.value?.value]?.[selectedDate.value];
  if (schedule) {
    startHour = schedule.startHour || startHour;
    endHour = schedule.endHour || endHour;
  }

  // Convert start and end hours to minutes
  const startMinutes = timeToMinutes(startHour);
  const endMinutes = timeToMinutes(endHour);

  // Generate available start times from startHour to endHour, excluding occupied times
  for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += 30) {
    const timeDate = new Date();
    timeDate.setHours(0, currentMinutes, 0, 0); // Set the time based on currentMinutes

    // Format the time using Quasar's formatDate function
    const time = date.formatDate(timeDate, 'HH:mm');

    // Check if the current time conflicts with any occupied slot
    const conflicting = slots.some(slot => {
      const slotStart = timeToMinutes(slot.start);
      const slotEnd = timeToMinutes(slot.end);
      const currentTime = timeToMinutes(time);

      return currentTime >= slotStart && currentTime < slotEnd; // Check if the time conflicts
    });

    // If no conflict, add the time to the startTimes array
    if (!conflicting) {
      startTimes.push(time);
    }
  }
  // For debugging purposes, you can remove or adjust this log
  return startTimes;
});
const endOptions = computed(() => {
  if (!selectedStartTime.value) return [];

  const startMinutes = timeToMinutes(selectedStartTime.value);
  const endTimes = [];

  // Get appointments for the selected provider and selected date
  const providerAppointments = appointments.value[selectedProvider.value?.value] || {};
  const slots = providerAppointments[selectedDate.value] || [];

  // Get the schedule's end time, defaulting to 17:00
  const schedule = scheduleModified.value[selectedProvider.value?.value]?.[selectedDate.value];

  const providerEndTime =
    schedule
      ? schedule.endHour
      : defaultSchedule.value[selectedProvider.value?.value]?.end || '17:00';
  const scheduleEndMinutes = timeToMinutes(providerEndTime);

  // Generate available end times from the selected start time to the end of the schedule
  for (let m = startMinutes + 30; m <= scheduleEndMinutes; m += 30) {
    const endTime = minutesToTime(m);

    // Check if the end time conflicts with any appointment slots
    if (!isTimeConflict(startMinutes, m, slots)) {
      endTimes.push(endTime);
    }
  }

  return endTimes;
});
const defaultSchedule = computed(() => {
  return state.data.defaultSchedule
})
const startScheduleOptions = computed(() => {
  const startTimes = [];
  if (selectedDate.value && schedule.value) {
    const scheduleEntry = schedule.value[selectedProvider.value?.value]?.[selectedDate.value];
    const startHour = scheduleEntry?.startHour || defaultSchedule.value[selectedProvider.value?.value]?.start;
    const endHour = scheduleEntry?.endHour || defaultSchedule.value[selectedProvider.value?.value]?.end;

    let currentTime = timeToMinutes(startHour);
    const endTime = timeToMinutes(endHour);

    while (currentTime < endTime) {
      startTimes.push(minutesToTime(currentTime));
      currentTime += 30; // Increment by 30 minutes
    }
  }
  return startTimes;
});
const endScheduleOptions = computed(() => {
  if (!startSchedule.value) return [];

  const scheduleEntry = schedule.value[selectedProvider.value?.value]?.[selectedDate.value];
  const endHour = scheduleEntry?.endHour || defaultSchedule.value[selectedProvider.value?.value]?.end;

  const startMinutes = timeToMinutes(startSchedule.value);
  const endTimes = [];

  for (let m = startMinutes + 30; m <= timeToMinutes(endHour); m += 30) {
    endTimes.push(minutesToTime(m));
  }

  return endTimes;
});

const isDisabledDate = (date) => {
  const formattedDate = formatDate(date);
  return disableDates.value[selectedProvider.value?.value].includes(formattedDate);
};
const isWeekend = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay()
  return day === 0 || day === 6; // Sunday (0) or Saturday (6)
};
const disablePastDates = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the start of today
  const selectedDate = new Date(dateStr);

  // Check if the date is in the disabled dates array
  if (isDisabledDate(selectedDate)) {
    disableDatesList.value.push(date.formatDate(selectedDate, 'YYYY/MM/DD')) // Disable the date
  }

  // Check if the date is before today
  if (selectedDate < today) {
    return false; // Disable past dates
  }

  // Disable weekends, unless the date is in the exception list
  if (isWeekend(selectedDate) && !exceptionWeekendDays.value.includes(formatDate(selectedDate))) {
    disableDatesList.value.push(date.formatDate(selectedDate, 'YYYY/MM/DD')) // Disable the date
  }

  // Check if today's work hours are past
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date();
    const endOfWorkHours = new Date();
    endOfWorkHours.setHours(17, 0, 0, 0); // Set work hours end to 5 PM
    return now < endOfWorkHours; // Enable only if current time is before 5 PM
  }
  return true; // Enable future dates
};
const formatDate = (customDate) => {
  return date.formatDate(customDate, 'YYYY-MM-DD');
};
const datePickerOptions = (dateStr) => {
  return disablePastDates(dateStr);
};
const isDateAllowed = (date) => {
  return datePickerOptions(date, user.value.role);
};
const handleValue = (val) => {
  selectedHour.value = val;
};
const updateAvailableHours = () => {
  selectedStartTime.value = null;
  selectedEndTime.value = null;
  selectedHour.value = ''
  disableDatesList.value = []
  if (selectedDate.value && selectedProvider.value) {
    const modifiedSchedule = scheduleModified.value?.[selectedProvider.value?.value]?.[selectedDate.value]
    if (modifiedSchedule) {
      startSchedule.value = modifiedSchedule.startHour;
      endSchedule.value = modifiedSchedule.endHour;
      schedule.value = {
        start: modifiedSchedule.startHour, end: modifiedSchedule.endHour
      }
    }
    else {
      startSchedule.value = `10:00`;
      endSchedule.value = `17:00`;
      schedule.value = {
        start: '10:00', end: '17:00'
      }
    }
    stateDay.value =
      isWeekend(selectedDate.value)
        ? !exceptionWeekendDays.value.includes(formatDate(selectedDate.value))
        : isDisabledDate(selectedDate.value)
  }
}
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};
const onStartTimeChange = (newStartTime) => {
  if (newStartTime) {
    selectedEndTime.value = null;  // Reset end time when start time changes
  }
};
const onScheduleStartChange = (newStartSchedule) => {
  if (newStartSchedule) {
    endSchedule.value = null;  // Reset end time when start time changes
  }
}
const isTimeConflict = (startMinutes, endMinutes, slots) => {
  return slots.some(slot => {
    const slotStart = timeToMinutes(slot.start);
    const slotEnd = timeToMinutes(slot.end);
    return (startMinutes < slotEnd && endMinutes > slotStart);
  });
};

function handleProvider (val) {
  disableDatesList.value = []
  selectedProvider.value = val
  selectedDate.value = ''
  updateAvailableHours()
}
function handleDisableDay (val) {
  commit('SET_DAY_AVAILABILITY', {
    isWeekend: isWeekend(selectedDate.value),
    isAdd: val,
    date: selectedDate.value,
    provider: selectedProvider.value?.value
  })
  nextTick(() => {
    updateAvailableHours()
  })
}
function getDuration(startTime, endTime) {
  // Convert time to minutes
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Calculate the difference in minutes
  return endTotalMinutes - startTotalMinutes;
}
function handleSaveSchedule () {
  commit('SET_SCHEDULE_MODIFIED', {
    provider: selectedProvider.value?.value,
    date: selectedDate.value,
    startHour: startSchedule.value,
    endHour: endSchedule.value
  })

}

function generateRandomId(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomId += chars[randomIndex];
  }
  return randomId;
}
function handleSaveDisableHours () {

  const appointment = {
    id: generateRandomId(),
    start: selectedStartTime.value,
    end: selectedEndTime.value,
    date: selectedDate.value,
    appointmentDetails: {
      label: 'Liber',
      value: 'off',
      duration: getDuration(selectedStartTime.value, selectedEndTime.value)
    }}

  commit('ADD_APPOINTMENT', {
    selectedProvider: selectedProvider.value?.value,
    selectedDate: selectedDate.value,
    appointment
  })

  selectedHour.value = ''
  updateAvailableHours()
}
function handleDeleteAppointment (id) {
  commit('DELETE_APPOINTMENT', {
    id,
    provider: selectedProvider.value?.value,
    date: selectedDate.value
  })
}

watch(selectedStartTime, (newStartTime) => {
  if (newStartTime) {
    selectedEndTime.value = null;
  }
});
watch(() => scheduleModified.value, (value) => {
  updateAvailableHours()
}, {deep: true})
</script>

<style lang="scss">
.calendar-section {
  .q-form {
    .disable-hours, .schedule-hours {
      > span {
        margin-bottom: 10px;
        display: block;
      }
      .list-inputs {
        display: flex;
        gap: 10px;
        > .q-field {
          width: 100%;
        }
      }
    }
  }
}


</style>
