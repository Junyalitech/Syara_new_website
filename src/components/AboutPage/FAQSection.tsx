import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import './FAQSection.css';
import { fetchFaqs } from '../../features/about/faqSlice';
import { useDispatch, useSelector } from 'react-redux';

// const faqs = [
//   {
//     q: 'Do you offer fresh and organic products?',
//     a: 'Yes, we provide a wide range of fresh, organic, and high-quality groceries sourced directly from trusted farmers and suppliers.',
//   },
//   {
//     q: 'How do I place an order?',
//     a: 'Simply browse products, add items to your cart, and proceed to checkout. We offer multiple secure payment options for your convenience.',
//   },
//   {
//     q: 'How fast is delivery?',
//     a: 'We offer same-day or next-day delivery depending on your location, ensuring your groceries arrive fresh and on time.',
//   },
//   {
//     q: 'What is your return or refund policy?',
//     a: 'If you receive damaged or incorrect items, you can request a replacement or refund within 24 hours of delivery.',
//   },
// ];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const dispatch = useDispatch();
  const { faqs, loading } = useSelector((state: any) => state.faq);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);


  return (
    <section className="faq">
      <h2 className="faq__title">Frequently Asked Questions</h2>
      <p className="faq__subtitle">Our friendly team would love to answer your questions.</p>
      {loading ? (<div className="faq-skeleton">
        {[1, 2, 3, 4].map((_, i) => (
          <div className="faq-item skeleton" key={i}>
            <div className="skeleton-line title"></div>
            <div className="skeleton-line"></div>
          </div>
        ))}
      </div>
      ) : (
        <div className="faq__list">
          {faqs.map((item: any, i: number) => (
            <div className="faq-item" key={i}>
              <button
                className="faq-item__question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {item.question}
                <Plus
                  size={18}
                  className={`faq-item__icon ${openIndex === i ? 'faq-item__icon--open' : ''}`}
                />
              </button>
              <div className={`faq-item__answer ${openIndex === i ? 'faq-item__answer--open' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FAQSection;
