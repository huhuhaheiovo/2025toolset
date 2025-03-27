import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Base64 to JSON Converter | Transform Image Files to JSON',
  description: 'Free online tool to convert Base64 and image files to JSON format. Quick and secure image to Base64 to JSON converter, no file size limits.',
  keywords: 'base64 to json, image to json, convert base64 to json, image file to json, base64 encoder, image converter, online converter',
  authors: [{ name: 'Base64 to JSON Tool' }],
  creator: 'Base64 to JSON Tool',
  publisher: 'Base64 to JSON Tool',
  openGraph: {
    title: 'Base64 to JSON Converter | Image Files to JSON',
    description: 'Free online tool to convert Base64 and image files to JSON format. Transform your images to Base64-encoded JSON quickly and securely.',
    url: 'https://tojson.mechabreak.click/',
    siteName: 'Base64 to JSON Converter',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 to JSON Converter | Image Files to JSON',
    description: 'Convert image files to JSON with Base64 encoding. Quick, simple and secure.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://tojson.mechabreak.click/" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E59GB4657Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E59GB4657Z');
          `}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Base64 to JSON Converter",
              "url": "https://tojson.mechabreak.click/",
              "description": "Free online tool to convert Base64 and image files to JSON format. Transform your images to Base64-encoded JSON quickly.",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "keywords": "base64 to json, image to json, image file to json, base64 encoder",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}