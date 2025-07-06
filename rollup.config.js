import css from 'rollup-plugin-css-only';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/clock-date-timepicker.js',
    format: 'iife',
    name: 'ClockDateTimePicker'
  },
  plugins: [
    css({ output: 'clock-date-timepicker.css' })
  ]
};
