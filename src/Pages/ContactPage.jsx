import React, { useState } from 'react';
import "./ContactPage.css";

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/contact-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Contact form submitted successfully:', data);
                alert("Contact form submitted successfully");
                // Optionally reset the form fields here
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                // Handle success (e.g., show success message to user)
            } else {
                const errorData = await response.json();
                console.error('Contact form submission failed:', errorData);
                // Handle error (e.g., show error message to user)
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            // Handle network error or other exceptions
        }
    };

    return (
        <div className="contact-us">
            <div className="contact-banner">
                <h1>Contact Us</h1>
                <p>We’d love to hear from you. Let’s connect 🚀</p>
            </div>

            <div className="contactus-container">
                <div className="contact-box">
                    <div className="we-are-here-to-help-container">
                        <div className="heading-of-we-are-hear">
                            We are Here to Help!
                        </div>
                        <div className="heading-of-we-are-hear-paragraph">
                            R-89, Ground Floor, Khichripur Rd, Mayur Vihar Phase I, Kalyanvas, Vinod Nagar East, Delhi, 110091, 9717190148
                        </div>
                        <div>
                            Wednesday - Monday: 10AM - 9PM
                        </div>
                    </div>
                    <div style={{ textAlign: "left" }} className='map-in-contact-us'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.250557006115!2d77.30902987528867!3d28.622251775670467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4c83c3d2edf%3A0x936e4182e8f593d0!2sSyara%20Retails%20-%20An%20Uttarakhandi%20Store!5e0!3m2!1sen!2sin!4v1718613207804!5m2!1sen!2sin"
                            width={500}
                            height={250}
                            style={{ border: '0' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
                <div className="contact-box" style={{ background: 'rgba(11, 141, 63, 0.6)' }}>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Enter your name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Enter your email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Enter your phone number:</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject:</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group full-width">
                                <label htmlFor="message">Enter your message:</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                        <button className='contact-button' type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
