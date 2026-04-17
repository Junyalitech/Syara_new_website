import { Shield, Lock, Cookie, Database, Mail, Phone, UserX, ChevronRight } from "lucide-react";
import "./PrivacyPolicy.css";
import logo from "../../assets/Logo/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const sections = [
    {
        icon: Shield,
        title: "Introduction",
        content:
            "Syara Retails respects the privacy of our customers. This Privacy Policy outlines the manner in which your data is collected and used by SSL. By accessing the services provided by our company you agree to the collection and use of your data by our website 'www.syararetails.com' in the manner provided in this Privacy Policy.",
    },
    {
        icon: Database,
        title: "What We Collect",
        content:
            "We will only collect information where it is necessary for us to do so, and we will only collect information if it is relevant to our dealings with you. We will keep said information for as long as we are either required to by law, or as is relevant for the purpose for which it was collected.",
    },
    {
        icon: UserX,
        title: "Anonymous Browsing",
        content:
            "You can visit our website and browse without having to provide personal details. During your visit to the website, you remain anonymous and at no time can we identify you unless you have an account with us and log on with your username and password.",
    },
    {
        icon: Lock,
        title: "Payment Security",
        content:
            "Syara Retails collects the details provided by you on registration and the information about you from your use of our service and your visits to our website. Your Payment details such as Credit/Debit Card details etc. will not be saved or accessed. All transaction details are securely transmitted through a secured payment page. We will never have access to or store your complete card/account information.",
    },
    {
        icon: Cookie,
        title: "Cookies & Automatic Data",
        content:
            "While you use our website, we may have automatic access to certain anonymous information in standard usage logs through our web server, obtained from cookies sent to your browser from web server cookies stored on your hard drive.",
        list: [
            "Computer-identification information, IP address assigned to your computer",
            "The domain server through which you access our service",
            "First and last name, email, addresses, contact details including phone numbers, PIN/ZIP code",
            "Demographic profile",
            "Your opinion on services, products, features on our websites",
        ],
    },
    {
        icon: Shield,
        title: "How We Use Your Information",
        content:
            "We use this information to improve personalized features on our websites to enhance your shopping experience and to provide services requested by you. We make it very clear that none of your information or details will be shared with any third party.",
    },
];

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pp-page">
            {/* Header */}
            <header className="pp-header">
                <div className="pp-header-inner">
                    <span className="pp-logo">
                        <img src={logo} alt="Syara Retails Logo" />
                    </span>
                    <nav className="pp-breadcrumb">
                        <span onClick={()=>navigate('/')}>Home</span>
                        <ChevronRight />
                        <span className="pp-breadcrumb-current">Privacy Policy</span>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="pp-hero">
                <div className="pp-hero-inner">
                    <div className="pp-hero-badge">
                        <Shield />
                        Your Privacy Matters
                    </div>
                    <h1>Privacy Policy</h1>
                    <p className="pp-hero-desc">
                        We are committed to protecting your personal information and being transparent about what we collect and how we use it.
                    </p>
                    <p className="pp-hero-date">Last updated: April 9, 2026</p>
                </div>
                <div className="pp-hero-pattern" />
            </section>

            {/* Content */}
            <main className="pp-main">
                <div className="pp-sections">
                    {sections.map((section, i) => {
                        const Icon = section.icon;
                        return (
                            <article key={i} className="pp-card">
                                <div className="pp-card-header">
                                    <div className="pp-card-icon">
                                        <Icon />
                                    </div>
                                    <div className="pp-card-body">
                                        <h2>{section.title}</h2>
                                        <p>{section.content}</p>
                                        {section.list && (
                                            <ul className="pp-card-list">
                                                {section.list.map((item, j) => (
                                                    <li key={j}>
                                                        <span className="pp-card-list-dot" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Contact / Account Termination */}
                <div className="pp-cta">
                    <h2>Account Termination</h2>
                    <p>
                        You may terminate your account at any time by contacting us through the following channels.
                    </p>
                    <div className="pp-cta-buttons">
                        <a href="mailto:syararetails@gmail.com" className="pp-btn-primary">
                            <Mail />
                            syararetails@gmail.com
                        </a>
                        <a href="tel:+918826540148" className="pp-btn-secondary">
                            <Phone />
                            +91-8826540148
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="pp-footer">
                <div className="pp-footer-inner">
                    © 2026 Syara Retails. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
