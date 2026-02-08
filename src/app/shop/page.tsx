
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { AmazonIcon } from "@/components/ui/icons/amazon-icon";
import { GooglePlayIcon } from "@/components/ui/icons/google-play-icon";
import { ElevenReaderIcon } from "@/components/ui/icons/eleven-reader-icon";
import { ShopNewsletterForm } from "./ShopNewsletterForm";
import './shop.css';

export default function ShopPage() {
    return (
        <div className="shop-page">
            <Header />
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
                                <Image src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1.png?alt=media&token=5f6e25e2-e706-4057-8fcb-a848df398cc6" alt="Hallo Welt Cover" className="book-cover" width={220} height={330} />
                                
                                <span className="series-tag">Band 1</span>
                                <h2 className="book-title">Hallo Welt</h2>
                                <p className="book-desc">Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt SK-S</p>

                                <div className="action-area">
                                    <a href="https://amzn.eu/d/02nS59t2" target="_blank" rel="noopener noreferrer" className="btn btn-amazon">
                                        <AmazonIcon />
                                        Bei Amazon kaufen
                                    </a>
                                    <a href="https://play.google.com/store/books/details?id=HZb3EAAAQBAJ&rdid=book-HZb3EAAAQBAJ&rdot=1&source=gbs_atb&pcampaignid=books_booksearch_atb" target="_blank" rel="noopener noreferrer" className="btn btn-google">
                                        <GooglePlayIcon />
                                        Google Play E-Book
                                    </a>
                                    <a href="https://elevenreader.io/audiobooks/hallo-welt/PNgTk712as4goF7HwxJJ" target="_blank" rel="noopener noreferrer" className="link-11reader">
                                        <ElevenReaderIcon />
                                        <span><small className="free-badge">Gratis hören auf</small> 11Reader</span>
                                    </a>
                                </div>
                            </article>

                            {/* BAND 2 */}
                            <article className="book-card">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw2%2FGenerated%20Image%20February%2008%2C%202026%20-%204_09PM.jpeg?alt=media&token=36836903-31a9-4e04-9118-e3c4d2008f1c" alt="Band 2 Cover" className="book-cover" width={220} height={330} />
                                
                                <span className="series-tag">Band 2</span>
                                <h2 className="book-title">Hallo Welt 2</h2>
                                <p className="book-desc">Wie das Leben funktioniert (Platzhalter)</p>

                                <div className="action-area">
                                    <a href="#" className="btn btn-amazon">
                                        <AmazonIcon />
                                        Bei Amazon kaufen
                                    </a>
                                    <a href="#" className="btn btn-google">
                                        <GooglePlayIcon />
                                        Google Play E-Book
                                    </a>
                                    <a href="#" className="link-11reader">
                                        <ElevenReaderIcon />
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
                            
                            {/* Beschreibung & Argumente */}
                            <div>
                                <h2>Hallo Welt – Stimmen einer Generation</h2>
                                <h3 style={{color:'var(--text-light)', fontWeight:400, fontSize:'1.2rem', marginBottom:'20px'}}>Zwischen Euphorie und Überforderung: Fragmente des Schülerdaseins</h3>
                                
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

                            {/* Technische Daten */}
                            <div>
                                <h3 style={{marginBottom:'20px'}}>Produktinformationen</h3>
                                <p style={{fontSize:'0.8rem', color:'#888'}}>Stand: 08. Februar 2026</p>
                                
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
                                    <div className="spec-item" style={{gridColumn: 'span 2'}}>
                                        <span className="spec-label">Bestseller-Rang</span>
                                        <span className="spec-value">Nr. 1.267 in Schreibkunst</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* === SEKTION 5: NEWSLETTER === */}
                <section className="bg-gray">
                    <div className="container">
                        <div className="newsletter-box">
                            <h2>Neuigkeiten und Benachrichtigungen</h2>
                            <p>Verpasse keinen neuen Band und keine Lesung. Kein Spam, nur Sarkasmus.</p>
                            <ShopNewsletterForm />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
