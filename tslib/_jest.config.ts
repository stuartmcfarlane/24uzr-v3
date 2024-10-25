import type {Config} from 'jest'

const config: Config = {
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
}

export default config