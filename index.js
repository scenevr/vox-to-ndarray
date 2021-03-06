var ndarray = require('ndarray')
var assert = require('assert')

function toArrayBuffer (buffer) {
  var ab = new ArrayBuffer(buffer.length)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}

function generateArray (vox) {
  var data;

  if (vox instanceof ArrayBuffer) {
    data = new DataView(vox);
  } else {
    throw new Error('vox is not of type ArrayBuffer');
  }

  // HEADER
  assert.equal(data.getUint32(0, true), 542658390)
  assert.equal(data.getUint32(4, true), 150)

  // SIZE
  assert.equal(data.getUint32(20, true), 1163544915)

  var resolutionX = data.getUint32(32, true) + 1
  var resolutionY = data.getUint32(36, true) + 1
  var resolutionZ = data.getUint32(40, true) + 1

  assert.equal(data.getUint32(44, true), 1230657880)

  var nbVoxels = data.getUint32(56, true)

  var n = ndarray(new Int32Array(resolutionX * resolutionY * resolutionZ), [resolutionX, resolutionY, resolutionZ])

  var startVoxelData = 60

  for (var i = 0; i < nbVoxels; i++) {
    var x = data.getUint8(startVoxelData, true)
    var y = data.getUint8(startVoxelData + 2, true)
    var z = data.getUint8(startVoxelData + 1, true)
    var c = data.getUint8(startVoxelData + 3, true)

    n.set(x, y, z, c)

    startVoxelData += 4
  }

  return n
}

module.exports = generateArray
