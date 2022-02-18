import "@/root/styles/global.scss";
import "@/root/styles/nprogress.scss";

const pkg = require("@/root/package.json");

import Head from "next/head";
import router from "next/router";

import NProgress from 'nprogress';
import { useEffect, useState } from "react";

router.onRouteChangeStart = () => NProgress.start();
router.onRouteChangeComplete = () => NProgress.done();
router.onRouteChangeError = () => NProgress.done();

export default function MyApp({ Component, pageProps, appProps }) {
    const [bootstrap, setBootstrap] = useState("bootstrap.min.css");
    useEffect(() => {
        var ls_theme = localStorage.getItem("theme");

        if (ls_theme === null || ls_theme === "" || ls_theme === undefined) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) localStorage.setItem("theme", "dark");
            else localStorage.setItem("theme", "light");
        }

        var theme = localStorage.getItem("theme");
        if (theme === "dark") setBootstrap("bootstrap.night.min.css");
        else bootstrap = setBootstrap("bootstrap.min.css");
    }, []);
    return <>
        <Head>
            <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no" />

            <title>{pkg.title}</title>

            <link rel="stylesheet" href={`/assets/plugins/bootstrap/${bootstrap}`} />
        </Head>
        <Component {...appProps} {...pageProps} />
    </>
}