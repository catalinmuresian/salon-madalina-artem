
export const state = {
  appointments: {
    madalina_artem: {
      "2025-01-23": [
        { id: '321312', start: "13:30", end: "15:30", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 } },
        { id: '323246', start: "15:30", end: "16:30", appointmentDetails: { label: "Liber", value: "off", duration: 60 } }
      ],
      "2025-01-24": [
        { id: '64grf7', start: "13:30", end: "14:30", appointmentDetails: { label: "Pedichiura semipermanenta (60 minute)", value: "semi_permanenta_pedichiura", duration: 60 } },
        { id: 'gfdg44', start: "14:30", end: "16:30", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 } }
      ],
      "2025-01-28": [
        { id: 'dgfd52', start: "12:00", end: "13:00", appointmentDetails: { label: "Manichiura semipermanenta (60 minute)", value: "semi_permanenta_manichiura", duration: 60 } },
        { id: '43gfd9', start: "16:00", end: "16:30", appointmentDetails: { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 } }
      ],
      "2025-01-27": [
        { id: 'gfd5dx', start: "13:00", end: "13:30", appointmentDetails: { label: "Manichiura clasica (30 minute)", value: "manichiura_clasica", duration: 30 } }
      ]
    },
    marius_alexandru: {
      "2025-01-22": [
        { id: '21ds43', start: "13:30", end: "14:30", appointmentDetails: { label: "Pedichiura semipermanenta (60 minute)", value: "semi_permanenta_pedichiura", duration: 60 } }
      ],
      "2025-01-23": [
        { id: '432dsd', start: "14:30", end: "16:30", appointmentDetails: { label: "Intretinere gel (120 minute)", value: "intretinere_gel", duration: 120 } }
      ],
      "2025-01-24": [
        { id: 'xzxzzz', start: "12:00", end: "13:00", appointmentDetails: { label: "Manichiura semipermanenta (60 minute)", value: "semi_permanenta_manichiura", duration: 60 } }
      ]
    }
  },
  user: {
    name: 'Madalina',
    email: 'madalin@yahoo.com',
    phone: '0763234567',
    role: 'owner'
  },
  defaultSchedule: {
    madalina_artem: {
      start: '10:00',
      end: '17:00'
    },
    marius_alexandru: {
      start: '10:00',
      end: '17:00'
    }
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
      ['2025-01-29']: {startHour: '12:00', endHour: '15:00'},
      ['2025-01-30']: {startHour: '15:00', endHour: '17:00'},
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
  DELETE_APPOINTMENT (state, {id, provider, date}) {
    state.appointments[provider][date] = state.appointments?.[provider]?.[date].filter(app => app.id !== id)
  },
  SET_SCHEDULE_MODIFIED (state, {date, startHour, endHour, provider}) {
    console.log(date, startHour, endHour, provider)
    state.scheduleModified[provider][date] = {startHour, endHour}
  },
  SET_DAY_AVAILABILITY (state, {isAdd, date, provider, isWeekend}) {
    const key = isWeekend ? 'exeptionWeekendDays' : 'disableDates';
    state[key][provider] = state[key][provider] || [];
    state[key][provider] = isWeekend
      ? (!isAdd
        ? (state[key][provider].includes(date) ? state[key][provider] : [...state[key][provider], date])
        : state[key][provider].filter(d => d !== date))
      : (isAdd
        ? (state[key][provider].includes(date) ? state[key][provider] : [...state[key][provider], date])
        : state[key][provider].filter(d => d !== date));
  },
  ADD_APPOINTMENT (state, {selectedProvider, selectedDate, appointment}) {
    state.appointments[selectedProvider][selectedDate] = state.appointments[selectedProvider][selectedDate] ?? [];
    state.appointments[selectedProvider][selectedDate].push(appointment);
    state.appointments[selectedProvider][selectedDate].sort((a, b) => a.start.localeCompare(b.start))
  }
}
