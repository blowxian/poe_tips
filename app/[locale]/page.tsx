import {useTranslations} from 'next-intl';

export default function Home() {
    const t = useTranslations('Index' as any);

    return (
        <main className="py-12 max-w-6xl mx-auto min-h-screen flex flex-col items-center justify-between">
            <h1 className="text-6xl title text-center mb-6 text-shadow-lg">流放之路 交流站</h1>
            <div
                className="flex flex-col items-center justify-between bg-black opacity-80 rounded-2xl shadow-custom">

                <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
                    <a
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className="mb-3 text-2xl font-semibold title">
                            攻略{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">
                            Find in-depth information about Next.js features and API.
                        </p>
                    </a>

                    <a
                        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className="mb-3 text-2xl font-semibold title">
                            技巧{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">
                            Learn about Next.js in an interactive course with&nbsp;quizzes!
                        </p>
                    </a>

                    <a
                        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className="mb-3 text-2xl font-semibold title">
                            地图{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">
                            Explore starter templates for Next.js.
                        </p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className="mb-3 text-2xl font-semibold title">
                            道具{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>
                        <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
                            Instantly deploy your Next.js site to a shareable URL with Vercel.
                        </p>
                    </a>
                </div>
            </div>

            <div className="z-10 w-full max-w-5xl items-center font-mono lg:flex text-xs">
                By&nbsp;<a className="hover:underline"
                           href="https://space.bilibili.com/3537125507074883"
                           target="_blank"
                           rel="noopener noreferrer">
                <span className="text-base text-[#dfcf99]">@TuberPOE大佬攻略汇集地</span>
            </a>
            </div>
        </main>
    );
}
