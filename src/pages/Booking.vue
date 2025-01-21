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
        title="Selecteaza data"
        prefix="2"
        :done="step > 2"/>
      <q-step
        :name="3"
        title="Selecteaza ora"
        prefix="3"
        :done="step > 3"
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
        @update:model-value="updateAvailableHours"
      />
      <q-date
        class="full-width"
        v-if="selectedService"
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
            <span>{{ `${start}-${end} - ${appointmentDetails.label}` }}</span>
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

// Reactive variables
const selectedHour = ref("");
const selectedService = ref("");
const selectedDate = ref("");
const availableHours = ref([]);
const locale = ro;
const step = ref(0)

// Services array
const services = [
  { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 },
  { label: "Pedichiura semipermanenta (60 minute)", value: "semi_permanenta_pedichiura", duration: 60 },
  { label: "Manichiura semipermanenta (60 minute)", value: "semi_permanenta_manichiura", duration: 60 },
  { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 },
  { label: "Pedichiura clasica (30 minute)", value: "pedichiura_clasica", duration: 30 },
];

// Appointments array
const appointments = reactive([
  { start: "13:30", end: "15:30", date: "2025-01-21", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 }},
  { start: "13:30", end: "14:30", date: "2025-01-22", appointmentDetails: { label: "Pedichiura semipermanenta (60 minute)", value: "semi_permanenta_pedichiura", duration: 60 }},
  { start: "14:30", end: "16:30", date: "2025-01-22", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 }},
  { start: "12:00", end: "13:00", date: "2025-01-23", appointmentDetails: { label: "Manichiura semipermanenta (60 minute)", value: "semi_permanenta_manichiura", duration: 60 }},
  { start: "16:00", end: "16:30", date: "2025-01-23", appointmentDetails: { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 }},
  { start: "13:00", end: "13:30", date: "2025-01-24", appointmentDetails: { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 }},
]);

const user = ref({
    name: 'Madalina',
    email: 'madalin@yahoo.com',
    phone: '0763234567',
    role: 'owner'
})

// Computed properties
// Disable dates before today and disable today if work hours have passed
const disablePastDates = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the start of today
  const selectedDate = new Date(dateStr);

  // Check if the date is before today
  if (selectedDate < today) {
    return false; // Disable past dates
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

  // Disable today and tomorrow
  if (selectedDate >= today && selectedDate < dayAfterTomorrow) {
    return false; // Disable today and tomorrow
  }

  // Check if the date is before today
  return selectedDate >= today;

   // Enable dates starting from the day after tomorrow
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

const serviceOptions = computed(() =>
  services.map((service) => ({
    label: service.label,
    value: service.value,
    duration: service.duration
  }))
);

const existingAppointmentsList = computed(() => {
  return appointments
    .filter(appointment => appointment.date === selectedDate.value) // Filter by date
    .sort((a, b) => a.start.localeCompare(b.start)); // Sort by start time (asc)
});

// Methods
const handleValue = (val) => {
  selectedHour.value = val;
  step.value = 4
};

const updateAvailableHours = () => {
  step.value = 2
  selectedHour.value = ''
  if (selectedService.value && selectedDate.value) {
    step.value = 3
    const selectedServiceObj = services.find(
      (service) => service.value === selectedService.value.value
    );
    const serviceDuration = selectedServiceObj.duration;

    const filteredAppointments = appointments.filter(
      (app) => app.date === selectedDate.value
    );
    availableHours.value = generateTimeSlots(
      serviceDuration,
      filteredAppointments
    );
  }
};


const generateTimeSlots = (serviceDuration, appointments, startHour = 10, endHour = 17) => {
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
    const isConflict = appointments.some((app) => {
      const appStart = parseTime(app.start);
      const appEnd = parseTime(app.end);
      return slotStart < appEnd && slotEnd > appStart;
    });

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

function handleSaveAppointment () {
  const startDateTime = `${selectedDate.value}T${selectedHour.value}:00`;
  const endDateTime = date.addToDate(startDateTime, { minutes: selectedService.value.duration });
  const endHour = date.formatDate(endDateTime, "HH:mm");
  const appointment = {
    start: selectedHour.value,
    end: endHour,
    date: selectedDate.value,
    appointmentDetails: {
      label: selectedService.value.label,
      value: selectedService.value.value,
      duration: selectedService.value.duration
    }}

  appointments.unshift(appointment)
  selectedHour.value = ''
  updateAvailableHours()
  console.log(appointment)
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
