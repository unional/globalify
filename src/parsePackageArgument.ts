export function parsePackageArgument(arg) {
  let nodes
  let packageName
  let version
  if (arg.indexOf('@') === 0) {
    // scoped package
    nodes = arg.slice(1).split('@');
    packageName = '@' + nodes[0];
  }
  else {
    nodes = arg.split('@');
    packageName = nodes[0];
  }
  version = nodes[1];

  return { packageName, version }
}
