const fs = require('fs');

const imgBuffer = fs.readFileSync('public/logo.png');
const base64 = imgBuffer.toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="squircle">
      <rect width="512" height="512" rx="112" ry="112"/>
    </clipPath>
  </defs>
  <rect width="512" height="512" rx="112" fill="#0E0A24"/>
  <image href="data:image/png;base64,${base64}" width="512" height="512" clip-path="url(#squircle)" preserveAspectRatio="xMidYMid slice"/>
</svg>
`;

fs.writeFileSync('app/icon.svg', svgContent, 'utf8');
console.log('app/icon.svg updated with official logo image embedding');
