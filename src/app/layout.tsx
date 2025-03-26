import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Base64 转 JSON 工具',
  description: '一个简单的在线工具，用于将图片转换为Base64编码并生成JSON格式',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
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
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}