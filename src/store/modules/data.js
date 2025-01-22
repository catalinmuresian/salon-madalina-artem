
export const state = {
  appointments: {
    madalina_artem: {
      "2025-01-23": [
        { start: "13:30", end: "15:30", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 } },
        { start: "15:30", end: "16:30", appointmentDetails: { label: "Liber", value: "off", duration: 60 } }
      ],
      "2025-01-24": [
        { start: "13:30", end: "14:30", appointmentDetails: { label: "Pedichiura semipermanenta (60 minute)", value: "semi_permanenta_pedichiura", duration: 60 } },
        { start: "14:30", end: "16:30", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 } }
      ],
      "2025-01-28": [
        { start: "12:00", end: "13:00", appointmentDetails: { label: "Manichiura semipermanenta (60 minute)", value: "semi_permanenta_manichiura", duration: 60 } },
        { start: "16:00", end: "16:30", appointmentDetails: { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 } }
      ],
      "2025-01-27": [
        { start: "13:00", end: "13:30", appointmentDetails: { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 } }
      ]
    },
    marius_alexandru: {
      "2025-01-22": [
        { start: "13:30", end: "14:30", appointmentDetails: { label: "Pedichiura semipermanenta (60 minute)", value: "semi_permanenta_pedichiura", duration: 60 } }
      ],
      "2025-01-23": [
        { start: "14:30", end: "16:30", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 } }
      ],
      "2025-01-24": [
        { start: "12:00", end: "13:00", appointmentDetails: { label: "Manichiura semipermanenta (60 minute)", value: "semi_permanenta_manichiura", duration: 60 } }
      ]
    }
  },
  user: {
    name: 'Madalina',
    email: 'madalin@yahoo.com',
    phone: '0763234567',
    role: 'owner'
  },
  listProviders: [
    {
      value: 'madalina_artem',
      label: 'Madalina Artem'
    },
    {
      value: 'marius_alexandru',
      label: 'Marius Alexandru'
    }
  ],
  exeptionWeekendDays: {
    madalina_artem: ["2025-01-26", "2025-02-01"],
    marius_alexandru: ["2025-01-25", "2025-02-02"]
  },
  disableDays: {
    madalina_artem: ['2025-01-24'],
    marius_alexandru: ['2025-01-23']
  },
  scheduleModified: {
    madalina_artem: {
      ['2025-01-29']: {startHour: 12, endHour: 15},
      ['2025-01-30']: {startHour: 15, endHour: 17},
    },
    marius_alexandru: {}
  },
  disableDates: {
    madalina_artem: ['2025-01-28', '2025-01-29'],
    marius_alexandru: ['2025-01-23']
  }
}

export const actions = {}

export const mutations = {
  ADD_APPOINTMENT (state, {selectedProvider, selectedDate, appointment}) {
    console.log(selectedProvider, selectedDate, appointment)
    state.appointments[selectedProvider][selectedDate] = state.appointments[selectedProvider][selectedDate] ?? [];
    state.appointments[selectedProvider][selectedDate].push(appointment);
    state.appointments[selectedProvider][selectedDate].sort((a, b) => a.start.localeCompare(b.start))
  }
}
