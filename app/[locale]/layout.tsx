import type {Metadata} from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
    title: "流放之路交流站 ｜ by @TuberPOE大佬攻略汇集地",
    description: "深入《流放之路》的世界，探索最全面的攻略和技巧。加入@TuberPOE大佬，与成千上万的玩家一起分享、学习并提升你的游戏技能。无论你是新手还是资深玩家，这里都是你的理想交流站。",
};

export default async function LocaleLayout({
                                               children,
                                               params: {locale}
                                           }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body>
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
        </Script>
        </body>
        </html>
    );
}
