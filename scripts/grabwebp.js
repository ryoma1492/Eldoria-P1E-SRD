// https://online.anyflip.com/gfroi/pnmh/mobile/index.html

const webps = [...new Set(
  performance.getEntriesByType("resource")
    .map(e => e.name)
    .filter(url => /\.webp(?:[?#]|$)/i.test(url))
)];

console.log(`Found ${webps.length} WebP files`);
console.table(webps);
(async () => {
  // ------------------------------------------------------------
  // Find WebP resources
  // ------------------------------------------------------------

  const urls = [...new Set(
    performance.getEntriesByType("resource")
      .map(e => e.name)
      .filter(url => /\.webp(?:[?#]|$)/i.test(url))
  )];

  if (!urls.length) {
    console.error("No WebP resources found.");
    return;
  }

  console.log(`Found ${urls.length} WebP files.`);

  // ------------------------------------------------------------
  // CRC-32
  // ------------------------------------------------------------

  const crcTable = new Uint32Array(256);

  for (let n = 0; n < 256; n++) {
    let c = n;

    for (let k = 0; k < 8; k++) {
      c = (c & 1)
        ? 0xEDB88320 ^ (c >>> 1)
        : c >>> 1;
    }

    crcTable[n] = c >>> 0;
  }

  function crc32(data) {
    let crc = 0xFFFFFFFF;

    for (const byte of data) {
      crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
    }

    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  // ------------------------------------------------------------
  // ZIP helpers
  // ------------------------------------------------------------

  const encoder = new TextEncoder();

  function u16(value) {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, value, true);
    return b;
  }

  function u32(value) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, value >>> 0, true);
    return b;
  }

  function concat(...arrays) {
    const total = arrays.reduce((n, a) => n + a.length, 0);
    const result = new Uint8Array(total);

    let offset = 0;

    for (const a of arrays) {
      result.set(a, offset);
      offset += a.length;
    }

    return result;
  }

  // ------------------------------------------------------------
  // Download all images
  // ------------------------------------------------------------

  const files = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    console.log(`Downloading ${i + 1}/${urls.length}...`);

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Failed: ${url} (${response.status})`);
      continue;
    }

    const data = new Uint8Array(await response.arrayBuffer());

    files.push({
      name: `page-${String(i + 1).padStart(4, "0")}.webp`,
      data
    });

    console.log(
      `  ${(data.length / 1024).toFixed(1)} KB`
    );
  }

  if (!files.length) {
    console.error("No files could be downloaded.");
    return;
  }

  // ------------------------------------------------------------
  // Build ZIP
  //
  // WebP is already compressed, so we use ZIP "store"
  // rather than wasting CPU trying to compress it again.
  // ------------------------------------------------------------

  const localParts = [];
  const centralParts = [];

  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const crc = crc32(file.data);
    const size = file.data.length;

    // Local file header
    const localHeader = concat(
      new Uint8Array([0x50, 0x4B, 0x03, 0x04]), // signature
      u16(20),          // version needed
      u16(0),           // flags
      u16(0),           // compression = STORE
      u16(0),           // time
      u16(0),           // date
      u32(crc),
      u32(size),
      u32(size),
      u16(name.length),
      u16(0),           // extra length
      name
    );

    localParts.push(localHeader, file.data);

    // Central directory entry
    const centralHeader = concat(
      new Uint8Array([0x50, 0x4B, 0x01, 0x02]), // signature
      u16(20),          // version made by
      u16(20),          // version needed
      u16(0),           // flags
      u16(0),           // compression
      u16(0),           // time
      u16(0),           // date
      u32(crc),
      u32(size),
      u32(size),
      u16(name.length),
      u16(0),           // extra length
      u16(0),           // comment length
      u16(0),           // disk number
      u16(0),           // internal attributes
      u32(0),           // external attributes
      u32(offset),
      name
    );

    centralParts.push(centralHeader);

    offset += localHeader.length + size;
  }

  // Central directory
  const centralDirectory = concat(...centralParts);
  const localData = concat(...localParts);

  // End of central directory
  const endRecord = concat(
    new Uint8Array([0x50, 0x4B, 0x05, 0x06]),
    u16(0), // disk
    u16(0), // central directory disk
    u16(files.length),
    u16(files.length),
    u32(centralDirectory.length),
    u32(localData.length),
    u16(0)  // comment length
  );

  const zip = concat(
    localData,
    centralDirectory,
    endRecord
  );

  // ------------------------------------------------------------
  // Download ZIP
  // ------------------------------------------------------------

  const blob = new Blob([zip], {
    type: "application/zip"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pages.zip";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(link.href), 60000);

  const sizeMB = zip.length / 1024 / 1024;

  console.log(
    `Done! Created pages.zip containing ${files.length} files ` +
    `(${sizeMB.toFixed(2)} MB).`
  );
})();
