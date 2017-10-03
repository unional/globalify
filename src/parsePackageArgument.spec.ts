import test from 'ava'

import { parsePackageArgument } from './parsePackageArgument'

function assertPackageArgument(t, arg, expectedPackageName, expectedVersion) {
  const { packageName, version } = parsePackageArgument(arg)
  t.is(packageName, expectedPackageName)
  t.is(version, expectedVersion)
}

test('simple package', t => {
  assertPackageArgument(t, 'simple', 'simple', undefined)
})

test('package with special characters', t => {
  assertPackageArgument(t, 'm-x1.y', 'm-x1.y', undefined)
})

test('package with version x', t => {
  assertPackageArgument(t, 'm-x1.y@1', 'm-x1.y', '1')
  assertPackageArgument(t, 'm-x1.y@1.2', 'm-x1.y', '1.2')
  assertPackageArgument(t, 'm-x1.y@1.2.3', 'm-x1.y', '1.2.3')
  assertPackageArgument(t, 'm-x1.y@1.*', 'm-x1.y', '1.*')
  assertPackageArgument(t, 'm-x1.y@*', 'm-x1.y', '*')
})

test('scoped package', t => {
  assertPackageArgument(t, '@unional/m-x1.y', '@unional/m-x1.y', undefined)
  assertPackageArgument(t, '@unional/m-x1.y@1', '@unional/m-x1.y', '1')
})
