function encodeBmp(data) {
  var out = new Uint8Array(61440 * 3);
  let rows = 240;
  let columns = 256;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let i = x + y * columns;
      let b = (data[i] & 0x000000ff);
      let g = (data[i] & 0x0000ff00) >> 8;
      let r = (data[i] & 0x00ff0000) >> 16;
      let offset = i * 3;
      out[offset] = r;
      out[offset + 1] = g;
      out[offset + 2] = b;
    }
  }
  let bitmap = new Uint8Array (
    [
      //bmp header stuff
      66, 77,  //BM header ('BM')
      54,208,2,0,  //file size in bytes (61440 + header bytes) (fix... 24 bit)
      0,0,0,0, //reserved/unused
      54,0,0,0, //offset to raster data (54?)
      40,0,0,0, //info header size
      0,1,0,0,  //width
      16,255,255,255, //height, negated because bmp is stupid
      1,0,       //planes
      24,0,      //bitCount
      0,0,0,0,   //compression type
      0,0,0,0,    // image size
      0,0,0,0,    // hr
      0,0,0,0,    // vr
      0,0,0,0,    // colorz
      0,0,0,0,    // coloursz
      ...out
    ]
  )
  return bitmap;
}

module.exports = encodeBmp;