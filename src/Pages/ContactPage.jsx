import React, { useState } from 'react';
import "./ContactPage.css";
import { useNavigate } from 'react-router-dom';

import toast from "react-hot-toast";

function ContactUs() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });


    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;

        // Name validation (only letters + space)
        if (name === "name") {
            updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
        }

        // Phone validation (only numbers, max 10 digits)
        if (name === "phone") {
            updatedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
        }

        setFormData({
            ...formData,
            [name]: updatedValue,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Name validation
        if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            toast.error("❌ Name should contain only letters");
            return;
        }

        // Phone validation (10 digits)
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.error("❌ Phone must be 10 digits");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/contact-us`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data);

                toast.success("✅ Message sent successfully!");

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });

            } else {
                console.error("Error:", data);
                toast.error(data.message || "❌ Something went wrong");
            }

        } catch (error) {
            console.error("Network Error:", error);
            toast.error("❌ Server not responding");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="contact-us">
            <div className="contact-banner">
                {/* <p className="about-hero__breadcrumb">
                    <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                    <span className="about-hero__separator">/</span>
                    <span>Contact Us</span>
                </p> */}
                <h1>Contact Us</h1>

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
                <div className="contact-box" >
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-box">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    // placeholder='Your Name'
                                    required
                                />
                                <label htmlFor="name">Your Name</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-box">
                                <input
                                    type="text"
                                    id="phone"
                                    maxLength={10}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="phone">Your Phone Number</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-box">
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="subject">Subject</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-box">
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                                <label htmlFor="message">Message</label>
                            </div>
                        </div>


                        {/* <div className="form-row">
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
                        </div> */}
                        <button className='contact-button' type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
