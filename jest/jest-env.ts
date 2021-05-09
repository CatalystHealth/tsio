import fastDeepEqual from 'fast-deep-equal'

import { Validation } from '../packages/schema/src/validation'

expect.extend({
  toHaveValidationSuccess: (value: Validation<unknown>, expected: unknown) => {
    const validation = value
    if (!validation.valid) {
      return {
        pass: false,
        message: () => 'expected valid result, but result was invalid'
      }
    }

    return {
      pass: fastDeepEqual(validation.value, expected),
      message: () => ''
    }
  },
  toHaveValidationFailure: (value: Validation<unknown>, path: string[], message: string) => {
    const validation = value
    if (validation.valid) {
      return {
        pass: false,
        message: () => 'expected invalid result, but result was valid'
      }
    }

    const hasValidFailure = validation.errors.some(
      (error) => fastDeepEqual(error.path, path) && error.message === message
    )

    if (!hasValidFailure) {
      return {
        pass: hasValidFailure,
        message: () =>
          `watching for failure on: ${path.join('.')}; known errors: ${validation.errors
            .map((error) => `${error.path.join('.')}: ${error.message || ''}`)
            .join('\n')}`
      }
    }

    return {
      pass: true,
      message: () => ''
    }
  }
})
