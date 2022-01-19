import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Api from '@/root/src/services/api';

import NProgress from 'nprogress';

export default function Home({ slug, ...props }) {
    const router = useRouter();
    const [form, setForm] = useState({});

    const [paste, setPaste] = useState({});

    const [window_height, setWindowHeight] = useState(0);
    const [resize_height, setResizeHeight] = useState(0);
    const [keyboard_open, setKeyboardOpen] = useState(false);

    const [timeout_count, setTimeoutCount] = useState(0);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => {
            setResizeHeight(window.innerHeight);
        };

        getPasted();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (resize_height >= window_height) setKeyboardOpen(false);
        else setKeyboardOpen(true);
    }, [resize_height]);

    const handleInputChange = (e) => {
        const input = e.target;
        const name = input.name || input.id;
        const value = input.value;

        paste = { ...paste, [name]: value };

        setPaste({ ...paste });
        clearTimeout(timeout_count);

        setTimeoutCount(setTimeout(() => {
            savePaste();
        }, 1000));
    };

    const getPasted = () => {
        NProgress.start();
        Api.get(`/paste/${slug}`).then(({ data }) => {
            const response = data;
            setPaste(response.data ?? {});
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            NProgress.done();
        });
    };

    const savePaste = () => {
        NProgress.start();
        console.log(paste);

        Api.post(`/paste/${slug}`, paste).then(({ data }) => {

        }).catch(err => {
            console.log(err);
        }).finally(() => {
            NProgress.done();
        });
    };

    return <main className="d-flex flex-column flex-fill">
        <Head>
            <title>{slug}</title>
        </Head>
        <textarea className="form-control p-2 flex-fill" name="content" value={paste.content ?? ''} onChange={handleInputChange} />

        <footer className="d-flex flex-row gap-1 p-1 align-items-center">
            <button type="button" className="btn btn-primary btn-sm fw-bold text-uppercase" onClick={getPasted}>Read</button>
            <button type="button" className="btn btn-success btn-sm fw-bold text-uppercase" onClick={savePaste}>{paste.uuid ? "Save" : "Create"}</button>
        </footer>
    </main>
}

export async function getServerSideProps(context) {
    console.clear();
    console.log('query', context.query);

    const slug = context.query.slug;
    return { props: { slug } };
}