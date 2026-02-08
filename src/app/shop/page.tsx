'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletterAction } from '@/app/actions';
import './shop.css';

function NewsletterSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="newsletter-btn" disabled={pending}>
            {pending ? 'Anmelden...' : 'Anmelden'}
        </button>
    );
}

function NewsletterSection() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(subscribeToNewsletterAction, { success: undefined, error: undefined, message: undefined });
    const { toast } = useToast();

    useEffect(() => {
        if (state.success) {
            toast({ title: "Fast geschafft!", description: state.message });
            formRef.current?.reset();
        }
        if (state.error) {
            toast({ variant: "destructive", title: "Fehler", description: state.error });
        }
    }, [state, toast]);

    return (
        <section className="bg-gray">
            <div className="container">
                <div className="newsletter-box">
                    <h2>Neuigkeiten und Benachrichtigungen</h2>
                    <p>Verpasse keinen neuen Band und keine Lesung. Kein Spam, nur Sarkasmus.</p>
                    <form ref={formRef} action={formAction} className="newsletter-form">
                        <input type="email" name="email" placeholder="Deine E-Mail Adresse" className="newsletter-input" required />
                        <input type="hidden" name="source" value="shop-page-newsletter" />
                        <NewsletterSubmitButton />
                    </form>
                </div>
            </div>
        </section>
    );
}

export default function ShopPage() {
    return (
        <>
            <header>
                <div className="container">
                    <h1>Die Buchreihe: Hallo Welt</h1>
                </div>
            </header>

            <main>
                {/* === SEKTION 1: SHOP (HERO) === */}
                <section className="bg-gray">
                    <div className="container">
                        <div className="text-center mb-large">
                            <h2 style={{ fontSize: '2.5rem' }}>Ein satirischer Blick auf Bildung & Bürokratie</h2>
                            <p className="subtitle">Entdecke die Abenteuer in Band 1 und 2</p>
                        </div>

                        <div className="book-grid">
                            {/* BAND 1 */}
                            <article className="book-card">
                                <img src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1.png?alt=media&token=5f6e25e2-e706-4057-8fcb-a848df398cc6" alt="Hallo Welt Cover" className="book-cover" />
                                
                                <span className="series-tag">Band 1</span>
                                <h2 className="book-title">Hallo Welt</h2>
                                <p className="book-desc">Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S</p>

                                <div className="action-area">
                                    <a href="https://amzn.eu/d/02nS59t2" target="_blank" className="btn btn-amazon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m16.412 16.24l1.587-1.468a.53.53 0 0 0 .027-.736c-.655-.764-.852-1.401-.852-1.862V6.046c.007-1.025-.973-3.076-4.945-3.076c-3.538 0-4.826 2.1-5.115 3.495c-.055.263.148.496.416.52l2.09.189c.255.023.483-.152.583-.387c.26-.61.867-1.383 2.026-1.383c1.168 0 1.577.895 1.635 1.343V8.13c-5.724 0-7.204 2.492-7.204 4.867s1.733 3.563 3.855 3.563c1.409 0 2.709-.777 3.43-1.364a.55.55 0 0 1 .723.014l1.057 1.022a.5.5 0 0 0 .687.008m-3.53-2.578c1.283-.976.988-3.699.988-3.699s-2.412-.16-3.354 1.287c-.514.79-.348 1.862.275 2.412c.519.458 1.392.532 2.091 0m8.949 3.373c-.155-.176-.868-.115-1.553-.057c-.68.058-1.332.113-1.384-.067c-.105-.361 3.165-1.198 3.973-.542c.703.57-1.112 3.935-1.612 3.664c-.1-.054.05-.461.232-.963c.274-.751.626-1.716.344-2.035m-9.824 2.313c-4.527 0-7.771-1.568-9.447-2.378c-.701-.339-1.127-.545-1.258-.447c-.441.33 4.724 4.414 10.705 4.414c5.231 0 9.756-2.825 9.094-3.2c-.237-.134-.733.033-1.534.304c-1.442.486-3.872 1.307-7.56 1.307" clipRule="evenodd"/></svg>
                                        Bei Amazon kaufen
                                    </a>
                                    <a href="https://play.google.com/store/books/details?id=HZb3EAAAQBAJ&rdid=book-HZb3EAAAQBAJ&rdot=1&source=gbs_atb&pcampaignid=books_booksearch_atb" target="_blank" className="btn btn-google">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m17.668 8.212l3.318 1.982c1.352.808 1.352 2.804 0 3.612l-3.318 1.982L13.62 12l4.05-3.788Zm-1.786-1.068L6.085 1.29c-1.102-.658-2.432-.132-2.906.943l8.976 8.398zM3 4.804v14.391L10.691 12zm.179 16.963c.474 1.075 1.804 1.601 2.906.943l9.797-5.854l-3.727-3.487z" clipRule="evenodd"/></svg>
                                        Google Play E-Book
                                    </a>
                                    <a href="https://elevenreader.io/audiobooks/hallo-welt/PNgTk712as4goF7HwxJJ" target="_blank" className="link-11reader">
                                        <svg fill="none" viewBox="0 0 144 100" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M144 83.6985L104.222 72.8967L144 62.0948L139.581 45.7934L99.9897 56.539L129.098 27.0398L117.084 15.1747L88.2625 44.3863L98.8519 4.32287L82.5454 0L72.0005 39.8751L61.4676 0.00013332L45.1481 4.32267L55.7375 44.3863L26.9154 15.1743L14.915 27.0401L44.0117 56.5394L4.41927 45.7934L0 62.0948L39.7892 72.8967L0 83.6985L4.41931 100L52.1769 86.9297C58.9224 85.0835 63.6 78.9538 63.6 71.9601V66.1523H80.4V71.9601C80.4 78.9538 85.0775 85.0835 91.8231 86.9297L139.581 100L144 83.6985Z" fill="black" fillRule="evenodd"></path></svg>
                                        <span><small className="free-badge">Gratis hören auf</small> 11Reader</span>
                                    </a>
                                </div>
                            </article>

                            {/* BAND 2 */}
                            <article className="book-card">
                                <img src="https://placehold.co/400x600/eee/333?text=Cover+Band+2" alt="Band 2 Cover" className="book-cover" />
                                
                                <span className="series-tag">Band 2</span>
                                <h2 className="book-title">Hallo Welt 2</h2>
                                <p className="book-desc">Wie das Leben funktioniert (Platzhalter)</p>

                                <div className="action-area">
                                    <a href="#" className="btn btn-amazon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m16.412 16.24l1.587-1.468a.53.53 0 0 0 .027-.736c-.655-.764-.852-1.401-.852-1.862V6.046c.007-1.025-.973-3.076-4.945-3.076c-3.538 0-4.826 2.1-5.115 3.495c-.055.263.148.496.416.52l2.09.189c.255.023.483-.152.583-.387c.26-.61.867-1.383 2.026-1.383c1.168 0 1.577.895 1.635 1.343V8.13c-5.724 0-7.204 2.492-7.204 4.867s1.733 3.563 3.855 3.563c1.409 0 2.709-.777 3.43-1.364a.55.55 0 0 1 .723.014l1.057 1.022a.5.5 0 0 0 .687.008m-3.53-2.578c1.283-.976.988-3.699.988-3.699s-2.412-.16-3.354 1.287c-.514.79-.348 1.862.275 2.412c.519.458 1.392.532 2.091 0m8.949 3.373c-.155-.176-.868-.115-1.553-.057c-.68.058-1.332.113-1.384-.067c-.105-.361 3.165-1.198 3.973-.542c.703.57-1.112 3.935-1.612 3.664c-.1-.054.05-.461.232-.963c.274-.751.626-1.716.344-2.035m-9.824 2.313c-4.527 0-7.771-1.568-9.447-2.378c-.701-.339-1.127-.545-1.258-.447c-.441.33 4.724 4.414 10.705 4.414c5.231 0 9.756-2.825 9.094-3.2c-.237-.134-.733.033-1.534.304c-1.442.486-3.872 1.307-7.56 1.307" clipRule="evenodd"/></svg>
                                        Bei Amazon kaufen
                                    </a>
                                    <a href="#" className="btn btn-google">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m17.668 8.212l3.318 1.982c1.352.808 1.352 2.804 0 3.612l-3.318 1.982L13.62 12l4.05-3.788Zm-1.786-1.068L6.085 1.29c-1.102-.658-2.432-.132-2.906.943l8.976 8.398zM3 4.804v14.391L10.691 12zm.179 16.963c.474 1.075 1.804 1.601 2.906.943l9.797-5.854l-3.727-3.487z" clipRule="evenodd"/></svg>
                                        Google Play E-Book
                                    </a>
                                    <a href="#" className="link-11reader">
                                        <svg fill="none" viewBox="0 0 144 100" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M144 83.6985L104.222 72.8967L144 62.0948L139.581 45.7934L99.9897 56.539L129.098 27.0398L117.084 15.1747L88.2625 44.3863L98.8519 4.32287L82.5454 0L72.0005 39.8751L61.4676 0.00013332L45.1481 4.32267L55.7375 44.3863L26.9154 15.1743L14.915 27.0401L44.0117 56.5394L4.41927 45.7934L0 62.0948L39.7892 72.8967L0 83.6985L4.41931 100L52.1769 86.9297C58.9224 85.0835 63.6 78.9538 63.6 71.9601V66.1523H80.4V71.9601C80.4 78.9538 85.0775 85.0835 91.8231 86.9297L139.581 100L144 83.6985Z" fill="black" fillRule="evenodd"></path></svg>
                                        <span><small className="free-badge">Gratis hören auf</small> 11Reader</span>
                                    </a>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* === SEKTION 2: TESTIMONIALS (SOCIAL PROOF) === */}
                <section className="bg-white">
                    <div className="container">
                        <h2 className="text-center mb-large">Stimmen aus dem Chaos</h2>
                        <div className="quote-grid">
                            <div className="quote-card">
                                <p className="quote-text">»Ich habe das Buch im Zug gelesen und war so gefesselt, dass ich meinen Halt verpasste. Musste 30 km zurücklaufen. Aber es hat sich gelohnt!«</p>
                                <cite className="quote-author">Ein zufriedener Pendler</cite>
                            </div>
                            <div className="quote-card">
                                <p className="quote-text">»Seit ich das Buch verschlungen habe, sehe ich überall nur noch Bürokratie-Wahnsinn. Sogar mein Toaster will jetzt einen Antrag in dreifacher Ausführung!«</p>
                                <cite className="quote-author">Ein paranoider Leser</cite>
                            </div>
                            <div className="quote-card">
                                <p className="quote-text">»Endlich ein Buch, das so denkt wie ich! Jetzt fühle ich mich weniger alleine.«</p>
                                <cite className="quote-author">Ein Seelenverwandter</cite>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === SEKTION 3: WARUM BEIDE BÜCHER? === */}
                <section className="bg-gray">
                    <div className="container">
                        <h2 className="text-center mb-large">Warum Sie beide Bücher brauchen</h2>
                        <div className="features-grid">
                            <div className="feature">
                                <span className="feature-icon">🌌</span>
                                <h3>Zwei Bücher, ein Universum</h3>
                                <p>Erleben Sie das ganze Ausmaß des literarischen Unsinns, von der Schule bis zur Bürokratie. Nur ein Buch zu lesen ist, als würde man nur einen Schuh anziehen.</p>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">💊</span>
                                <h3>Doppelte Dosis Sarkasmus</h3>
                                <p>Verdoppeln Sie die Anzahl der chaotischen Beschreibungen und sarkastischen Bemerkungen für maximale Unterhaltung.</p>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">☕</span>
                                <h3>Unterstützen Sie die Autoren</h3>
                                <p>Helfen Sie Philipp und Max, ihre Sucht nach überteuertem Kaffee zu finanzieren – so können sie noch mehr Unsinn schreiben!</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === SEKTION 4: PRODUKTDETAILS === */}
                <section className="bg-white">
                    <div className="container">
                        <div className="details-layout">
                            
                            <div>
                                <h2>Hallo Welt – Stimmen einer Generation</h2>
                                <h3 style={{ color: 'var(--text-light)', fontWeight: 400, fontSize: '1.2rem', marginBottom: '20px' }}>Zwischen Euphorie und Überforderung: Fragmente des Schülerdaseins</h3>
                                
                                <p>"Hallo Welt" ist ein Buch, das die Perspektiven und Lebensumstände junger Menschen in einem besonderen Ort einfängt – der Schule. Es ist keine lineare Erzählung, kein Roman mit fester Handlung, sondern eine Sammlung von einzelnen Episoden, die stets mit neuem Stoff aufwarten. Dadurch entsteht ein vielseitiges Panorama, in dem das Alltägliche und das Außergewöhnliche nebeneinanderstehen.</p>
                                
                                <h3>Darum solltest du Hallo Welt lesen:</h3>
                                <ul className="check-list">
                                    <li>Einzelne Episoden statt einer in sich geschlossenen Handlung – wie das echte Leben</li>
                                    <li>Satire, Kritik und Selbstironie im Stil einer rebellischen Generation</li>
                                    <li>Humorvoll, scharfzüngig und zumeist gnadenlos ehrlich</li>
                                    <li>Ein Buch, das Gesellschaftskritik mit Alltagskomik verwebt</li>
                                    <li>Voller bissiger Beobachtungen über Schule, Lehrer und Bürokratie</li>
                                    <li>Ideal für zwischendurch: Ein Buch, das man immer wieder zur Hand nehmen kann</li>
                                </ul>
                            </div>

                            <div>
                                <h3 style={{ marginBottom: '20px' }}>Produktinformationen</h3>
                                <p style={{ fontSize: '0.8rem', color: '#888' }}>Stand: 08. Februar 2026</p>
                                
                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <span className="spec-label">Bewertung</span>
                                        <div className="spec-value">
                                            5,0 von 5 <span className="rating-stars">★★★★★</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Herausgeber</span>
                                        <span className="spec-value">Paulik & Reisch</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Seiten</span>
                                        <span className="spec-value">106 Seiten</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Erscheinungsdatum</span>
                                        <span className="spec-value">17. Feb. 2024</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Sprache</span>
                                        <span className="spec-value">Deutsch</span>
                                    </div>
                                     <div className="spec-item">
                                        <span className="spec-label">ASIN</span>
                                        <span className="spec-value">B0CVXT9X4J</span>
                                    </div>
                                    <div className="spec-item" style={{ gridColumn: 'span 2' }}>
                                        <span className="spec-label">Bestseller-Rang</span>
                                        <span className="spec-value">Nr. 1.267 in Schreibkunst</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <NewsletterSection />

            </main>
            <footer style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '0.9rem' }}>
                &copy; 2026 Philipp Paulik und Maximilian Reisch. Alle Rechte vorbehalten.
            </footer>
        </>
    );
}
