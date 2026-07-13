import { NextResponse } from 'next/server';

// This endpoint serves the Android App Links verification file.
// It must be accessible at: https://fundee.inseec-fr.com/.well-known/assetlinks.json
// 
// ⚠️  IMPORTANT: When you create a release keystore for production, add its SHA-256
//    fingerprint to the sha256_cert_fingerprints array below.
//
// To get a release fingerprint:
//   keytool -list -v -keystore your-release.keystore -alias your-alias
//
// Current fingerprints:
//   - DEBUG keystore (for development/testing)

const assetLinks = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.example.mobile',
      sha256_cert_fingerprints: [
        // Debug keystore – used for development & testing
        '45:AB:F5:D5:DA:0F:41:2C:3D:D0:56:85:79:27:9D:DA:8F:42:86:31:67:13:0A:AF:0F:BF:E3:E0:AE:0C:38:5A',
        // TODO: Add your RELEASE keystore fingerprint here before publishing to Play Store
      ],
    },
  },
];

export async function GET() {
  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
