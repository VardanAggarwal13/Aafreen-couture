async function verify() {
  const [rFavicon, rIcon, rApple, rHome] = await Promise.all([
    fetch('http://localhost:3000/favicon.ico'),
    fetch('http://localhost:3000/icon.png'),
    fetch('http://localhost:3000/apple-icon.png'),
    fetch('http://localhost:3000/')
  ]);

  const faviconBuf = await rFavicon.arrayBuffer();
  const iconBuf = await rIcon.arrayBuffer();
  const appleBuf = await rApple.arrayBuffer();
  const html = await rHome.text();

  console.log('/favicon.ico status:', rFavicon.status, 'size:', faviconBuf.byteLength);
  console.log('/icon.png status:', rIcon.status, 'size:', iconBuf.byteLength);
  console.log('/apple-icon.png status:', rApple.status, 'size:', appleBuf.byteLength);

  const iconMatches = html.match(/<link[^>]*rel="[^"]*(icon|apple)[^"]*"[^>]*>/gi) || [];
  console.log('\nFound icon links in <head>:');
  iconMatches.forEach(m => console.log('  ', m));

  // Test compositing on user's tab bar color and dark mode
  const sharp = (await import('sharp')).default;
  const bgColors = [
    { name: 'mint-tab', hex: '#D4E7D6' },
    { name: 'white-tab', hex: '#FFFFFF' },
    { name: 'dark-tab', hex: '#202124' },
  ];

  for (const bg of bgColors) {
    const bgSvg = Buffer.from(`<svg width="64" height="64"><rect width="64" height="64" fill="${bg.hex}"/></svg>`);
    const iconResized = await sharp('public/icon.png').resize(48, 48).toBuffer();
    const result = await sharp(bgSvg).composite([{ input: iconResized, top: 8, left: 8 }]).png().toBuffer();
    console.log(`Composited test on ${bg.name} (${bg.hex}): ${result.length} bytes OK`);
  }
}

verify().catch(console.error);
