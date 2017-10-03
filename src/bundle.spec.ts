import test from 'ava'

import { createBundle } from './bundle'

test('pjs', t => {
  createBundle({ entry: '/Users/hwong/github/unional/globalify/dist-es5/globalify_modules/node_modules/global-store'} as any)
  t.pass()
})
