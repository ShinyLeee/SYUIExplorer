/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const nodeResolve = require('eslint-import-resolver-node').resolve;

// recursively find the closest package.json
const findRoot = require('find-root');

const imageSuffixes = ['.png', '.jpg', '.gif', '.jpeg'];

exports.interfaceVersion = 2;
exports.resolve = resolve;

function resolve(source, file, config) {
  const r1 = reactNativeResolve(source, file, config);
  if (r1.found) return r1;
  const r2 = reactNativeResolve(`${source}/index`, file, config);

  if (r2.found) return r2;
  const appRoot = findRoot(file);
    const fPackage = require(path.join(appRoot, 'package.json')); // eslint-disable-line
  if (fPackage.name) {
    const namePath = `${fPackage.name}/`;
    if (source.indexOf(namePath) === 0) {
      const absSource = path.join(appRoot, source.replace(namePath, ''));
      return reactNativeResolve(absSource, file, config);
    }
  }

  return { found: false };
}

function reactNativeResolve(source, file, config) {
  const f = nodeResolve(source, file, config);
  if (f.found) return f;

  if (isImage(source)) {
    return imagesResolve(source, file, config);
  }
  const ios = resolvePlatform(source, file, config, 'ios');
  if (ios.found) {
    return resolvePlatform(source, file, config, 'android');
  }
  return { found: false };
}


function isImage(source) {
  let imageFound = false;
  imageSuffixes.forEach((suffix) => {
    if (source.endsWith(suffix)) {
      imageFound = true;
    }
  });
  return imageFound;
}

function imagesResolve(source, file, config) {
  if (isImage(source)) {
    const splitSource = source.split('.');
    const noSuffix = splitSource.slice(0, -1).join('.');
    const suffix = `.${splitSource.slice(-1)}`;
    const img1 = nodeResolve(`${noSuffix}@1x${suffix}`, file, config);
    const img2 = nodeResolve(`${noSuffix}@1.5x${suffix}`, file, config);
    const img3 = nodeResolve(`${noSuffix}@2x${suffix}`, file, config);
    const img4 = nodeResolve(`${noSuffix}@3x${suffix}`, file, config);
    const img5 = nodeResolve(`${noSuffix}@3.5x${suffix}`, file, config);

    if (img1.found) return img1;
    if (img2.found) return img2;
    if (img3.found) return img3;
    if (img4.found) return img4;
    if (img5.found) return img5;

    return { found: false };
  }
}

function resolvePlatform(source, file, config, platform) {
  return nodeResolve(`${source}.${platform}`, file, config);
}
