import { useEffect, useState } from 'react';
import io from 'socket.io-client'
import Head from 'next/head'
import { useRouter } from 'next/router';
import Api from '@/root/src/services/api';
import NProgress from 'nprogress';
import ContentEditable from 'react-contenteditable';
const sockets = io("http://localhost:3000")

export default function Home({ slug, ...props }) {
    const router = useRouter();
    const [paste, setPaste] = useState({});
    const [timeout_count, setTimeoutCount] = useState(0);
    
    useEffect(() => {
        

        sockets.on("connection", socket => {
            console.log("socket connected -> ", socket.id);
        })

        sockets.emit('join room', slug);

        sockets.on("copypaste", socket => {
            console.log(socket)
            paste.content = socket
            setPaste({...paste})
        })

    }, []);

    const handleContentChange = (e) => {
        const input = e.currentTarget;
        var value = input.innerHTML;

        value = value.replaceAll("&nbsp;", ' ');

        paste = { ...paste, slug, content: value };

        setPaste({ ...paste });

        clearTimeout(timeout_count);
        setTimeoutCount(setTimeout(() => {
            console.log('emitting')
            sockets.emit('copypaste', [ slug, paste ]);
            // getPasted()
        }, process.env.NEXT_PUBLIC_UPDATE_INTERVAL ?? 1000));
    };

    const getPasted = () => {
        Api.get(`/paste/${slug}`).then(({ data }) => {
            const response = data;
            setPaste(response.data ?? {});
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

        <ContentEditable className="form-control p-2 flex-fill small w-100 overflow-auto" id="contenteditable" tag="section" html={paste.content ?? ''} onChange={handleContentChange} />
    </main>
}

export async function getServerSideProps(context) {
    // console.clear();
    // console.log('query', context.query);
    const slug = context.query.slug;
    return { props: { slug } };
}