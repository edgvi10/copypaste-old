import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Api from '@/root/src/services/api';

export default function Home() {
    const router = useRouter();
    const [loading, toggleLoading] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
    }, []);

    const handleInputChange = (e) => {
        const input = e.target;
        const name = input.name || input.id;
        const value = input.value.toString().toLowerCase();
        setForm({ ...form, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        toggleLoading(true);

        if (form.slug) {
            router.push(`/${form.slug}`);
        } else {
            window.alert('Please enter a slug');
        }
    };
    const toggleTheme = (theme) => {
        if (!theme) localStorage.setItem('theme', localStorage.getItem('theme') === 'dark' ? 'light' : 'dark');
        else localStorage.setItem('theme', theme);
        router.reload();
    };

    return <main className="d-flex flex-fill">
        <Head>
            <title>Home</title>
        </Head>
        <section className="container p-3 align-self-center">
            <div className="row justify-content-center align-items-center">
                <div className="col-12 col-sm-10 col-md-10 col-lg-8 col-xl-6">
                    <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3">
                        <div className="input-group shadow-sm">
                            <input type="search" name="slug" id="slug" placeholder="Repositório" className="form-control" onChange={handleInputChange} />
                            <button type="submit" className="btn btn-primary btn-sm fw-bold text-uppercase lh-100">{loading ? "Entrando..." : "Entrar"}</button>
                        </div>

                        <button type="button" onClick={() => toggleTheme()} className="btn btn-outline-secondary btn-sm me-auto">Light/Dark</button>
                    </form>
                </div>
            </div>
        </section>
    </main>
}
