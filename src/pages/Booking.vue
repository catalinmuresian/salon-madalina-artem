<template>
  <div class="booking-page">
    <q-stepper
      style="max-width: 80%;margin: 0 auto;"
      v-model="step"
      ref="stepper"
      animated
      flat
      done-color="green"
      inactive-color="grey">
      <q-step
        :name="1"
        prefix="1"
        title="Selecteaza serviciu"
        :done="step > 1"/>
      <q-step
        :name="2"
        prefix="2"
        title="Selecteaza tehnician"
        :done="step > 2"/>
      <q-step
        :name="3"
        title="Selecteaza data"
        prefix="3"
        :done="step > 3"/>
      <q-step
        :name="4"
        title="Selecteaza ora"
        prefix="4"
        :done="step > 4"
      />
      <template #navigation>
        <!-- No navigation controls -->
      </template>
    </q-stepper>
    <q-form style="max-width: 500px;margin: 0 auto;display: flex;flex-direction: column;gap: 30px">
      <q-select
        v-model="selectedService"
        :options="serviceOptions"
        label="Selecteaza serviciu"
        option-value="value"
        option-label="label"
        @update:model-value="(val) => handleService(val)"
      />
      <q-select
        v-if="selectedService"
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
      />
      <div v-if="existingAppointmentsList.length && (user.role === 'owner' || user.role === 'admin')">
        <h6 style="margin: 0;">Programari existente</h6>
        <div>
          <div
            v-for="{ start, end, appointmentDetails} in existingAppointmentsList"
            :key="start + end">
            <span :style="appointmentDetails.value === 'off' && 'font-style: italic;color: #a2a2a2'">{{ `${start}-${end} - ${appointmentDetails.label}` }}</span>

          </div>
        </div>
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
        <q-btn v-if="availableHours.length"
               :disable="!selectedHour"
               class="full-width"
               style="margin-top: 15px"
               no-caps
               dense
               color="green"
               rounded
               @click="handleSaveAppointment">Salveaza programarea
        </q-btn>
        <span v-else style="font-style: italic">Nu exista ora disponibila pentru data selectata !</span>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import ro from "quasar/lang/ro";
import {date} from "quasar";
import {useStore} from "vuex";
const { state, commit } = useStore()

const selectedHour = ref("");
const selectedService = ref("");
const selectedDate = ref("");
const availableHours = ref([]);
const locale = ro;
const step = ref(0);
const services = [
  { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 },
  { label: "Pedichiura semipermanenta (60 minute)", value: "semi_permanenta_pedichiura", duration: 60 },
  { label: "Manichiura semipermanenta (60 minute)", value: "semi_permanenta_manichiura", duration: 60 },
  { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 },
  { label: "Pedichiura clasica (30 minute)", value: "pedichiura_clasica", duration: 30 },
];
const listProviders = computed(() => {
  return state.data.listProviders
})
const selectedProvider = ref('')
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
const serviceOptions = computed(() => services.map((service) => ({
  label: service.label,
  value: service.value,
  duration: service.duration
})));
const existingAppointmentsList = computed(() => {
  return (selectedProvider.value?.value && selectedDate.value)
    ? appointments.value[selectedProvider.value?.value][selectedDate.value] || []
    : []
})

const isDisabledDate = (date) => {
  const formattedDate = formatDate(date);
  return disableDates.value[selectedProvider.value?.value].includes(formattedDate);
};
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday (0) or Saturday (6)
};
const disablePastDates = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the start of today
  const selectedDate = new Date(dateStr);

  // Check if the date is in the disabled dates array
  if (isDisabledDate(selectedDate)) {
    return false; // Disable the date
  }

  // Check if the date is before today
  if (selectedDate < today) {
    return false; // Disable past dates
  }

  // Disable weekends, unless the date is in the exception list
  if (isWeekend(selectedDate) && !exceptionWeekendDays.value.includes(formatDate(selectedDate))) {
    return false; // Disable weekends not in exceptions
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
const disablePastAndSpecificFutureDates = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the start of today

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1); // Tomorrow
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(today.getDate() + 2); // Day after tomorrow
  dayAfterTomorrow.setHours(0, 0, 0, 0);

  const selectedDate = new Date(dateStr);

  // Check if the date is in the disabled dates array
  if (isDisabledDate(selectedDate)) {
    return false; // Disable the date
  }

  // Disable today and tomorrow
  if (selectedDate >= today && selectedDate < dayAfterTomorrow) {
    return false; // Disable today and tomorrow
  }

  // Disable weekends, unless the date is in the exception list
  if (isWeekend(selectedDate) && !exceptionWeekendDays.value.includes(formatDate(selectedDate))) {
    return false; // Disable weekends not in exceptions
  }

  // Check if the date is before today
  return selectedDate >= today;

  // Enable dates starting from the day after tomorrow
};
const formatDate = (customDate) => {
  return date.formatDate(customDate, 'YYYY-MM-DD'); // Return formatted date
};
const datePickerOptions = (dateStr, userRole) => {
  if (userRole === 'owner' || userRole === 'admin') {
    return disablePastDates(dateStr);
  } else {
    return disablePastAndSpecificFutureDates(dateStr);
  }
};
const isDateAllowed = (date) => {
  return datePickerOptions(date, user.value.role);
};
const handleValue = (val) => {
  selectedHour.value = val;
  step.value = 5
};
const updateAvailableHours = () => {
  selectedHour.value = ''
  if (selectedService.value && selectedDate.value && selectedProvider.value) {
    step.value = 4
    const selectedServiceObj = services.find(
      (service) => service.value === selectedService.value?.value
    );
    const serviceDuration = selectedServiceObj.duration;

    const filteredAppointments = appointments.value[selectedProvider.value?.value][selectedDate.value]
    availableHours.value = generateTimeSlots(
      serviceDuration,
      filteredAppointments
    );
  }
};
const generateTimeSlots = (serviceDuration, appointments) => {
  let startHour = 10
  let endHour = 17

  const schedule = scheduleModified.value[selectedProvider.value?.value][selectedDate.value]

  if (schedule) {
    startHour = schedule.startHour
    endHour = schedule.endHour
  }


  const timeSlots = [];
  const now = new Date();
  const isToday = selectedDate.value === now.toISOString().slice(0, 10); // Check if selected date is today

  let currentTime = new Date();
  currentTime.setHours(startHour, 0, 0, 0);

  // If the selected day is today, start from the next available time
  if (isToday) {
    if (now.getHours() >= endHour) {
      // If the current time is past the work hours, return an empty array
      return [];
    }
    currentTime.setHours(
      now.getHours(),
      Math.ceil(now.getMinutes() / 30) * 30,
      0,
      0
    );
  }

  const endTime = new Date();
  endTime.setHours(endHour, 0, 0, 0);

  while (currentTime < endTime) {
    const slotStart = new Date(currentTime);
    const slotEnd = new Date(currentTime);
    slotEnd.setMinutes(slotStart.getMinutes() + serviceDuration);

    // Ensure the slot end time does not exceed the working hours
    if (slotEnd > endTime) {
      break;
    }

    // Check for conflicts

    const isConflict = appointments?.some((app) => {
      const appStart = parseTime(app.start);
      const appEnd = parseTime(app.end);
      return slotStart < appEnd && slotEnd > appStart;
    }) || false;

    if (!isConflict) {
      timeSlots.push(formatTime(slotStart));
    }

    // Increment by 30 minutes for the next slot
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return timeSlots;
};
const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const time = new Date();
  time.setHours(hours, minutes, 0, 0);
  return time;
};
const formatTime = (date) => {
  return date.toTimeString().slice(0, 5);
};
function handleProvider (val) {
  step.value = 3
  selectedProvider.value = val
  selectedDate.value = ''
  updateAvailableHours()
}
function handleService (val) {
  selectedService.value = val
  step.value = 2
  updateAvailableHours()
}
function handleSaveAppointment () {
  const startDateTime = `${selectedDate.value}T${selectedHour.value}:00`;
  const endDateTime = date.addToDate(startDateTime, { minutes: selectedService.value.duration });
  const endHour = date.formatDate(endDateTime, "HH:mm");
  const appointment = {
    start: selectedHour.value,
    end: endHour,
    date: selectedDate.value,
    appointmentDetails: {
      label: selectedService.value?.label,
      value: selectedService.value?.value,
      duration: selectedService.value?.duration
    }}

  commit('ADD_APPOINTMENT', {
    selectedProvider: selectedProvider.value?.value,
    selectedDate: selectedDate.value,
    appointment
  })
  selectedHour.value = ''
  updateAvailableHours()
}
</script>

<style lang="scss">
.booking-page {
  .q-stepper {
    .q-stepper__content {
      display: none;
    }
  }
}
</style>
