import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { apiClient, getErrorMessage } from '../../lib/api';
import './Pricing.css'

const PLANS = [
  {
    id: 'freelance',
    name: 'Freelance',
    price: '9.99',
    features: ['1 GB of space', 'Support at $25/hour', 'Limited cloud access'],
  },
  {
    id: 'business',
    name: 'Business',
    price: '19.99',
    featured: true,
    features: ['5 GB of space', 'Support at $5/hour', 'Full cloud access'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '29.99',
    features: ['10 GB of space', 'Support at $5/hour', 'Full cloud access'],
  },
];

const Wave = () => (
  <svg className='pricing-deco-img' height='100px' preserveAspectRatio='none' viewBox='0 0 300 100' width='300px' aria-hidden>
    <path className='deco-layer deco-layer--1' d='M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z' opacity='0.6' />
    <path className='deco-layer deco-layer--2' d='M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z' opacity='0.6' />
    <path className='deco-layer deco-layer--3' d='M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z' opacity='0.7' />
    <path className='deco-layer deco-layer--4' d='M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z' />
  </svg>
);

const Pricing = () => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [searchParams] = useSearchParams();
  const [pendingPlan, setPendingPlan] = useState('');
  const [error, setError] = useState('');

  const choosePlan = async (planId: string) => {
    if (!isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: '/pricing' } });
      return;
    }
    setPendingPlan(planId);
    setError('');
    try {
      const response = await apiClient.post<{ url: string }>('/checkout', {
        plan: planId,
        email: user?.email,
        userId: user?.sub,
        successUrl: `${window.location.origin}/profile?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
      });
      window.location.assign(response.data.url);
    } catch (err) {
      setError(getErrorMessage(err));
      setPendingPlan('');
    }
  };

  return (
    <section className="pricing-section">
      <header className="section-header">
        <h1>Simple, predictable pricing</h1>
        <p className="muted">Pick the plan that fits your practice and start sketching today.</p>
      </header>

      {searchParams.get('checkout') === 'cancelled' && (
        <p className="alert">Checkout was cancelled. You have not been charged.</p>
      )}
      {error && <p className="alert alert-error" role="alert">{error}</p>}

      <div className='pricing'>
        {PLANS.map((plan) => (
          <div key={plan.id} className={`pricing-item ${plan.featured ? 'pricing-item--featured' : ''}`}>
            {plan.featured && <span className="pricing-ribbon">Most popular</span>}
            <div className='pricing-deco'>
              <Wave />
              <div className='pricing-price'>
                <span className='pricing-currency'>$</span>{plan.price}
                <span className='pricing-period'>/ mo</span>
              </div>
              <h2 className='pricing-title'>{plan.name}</h2>
            </div>
            <ul className='pricing-feature-list'>
              {plan.features.map((feature) => (
                <li key={feature} className='pricing-feature'>
                  <FontAwesomeIcon icon={faCheck} /> {feature}
                </li>
              ))}
            </ul>
            <button
              className={`btn ${plan.featured ? 'btn-primary' : ''} pricing-action`}
              onClick={() => choosePlan(plan.id)}
              disabled={Boolean(pendingPlan)}
            >
              {pendingPlan === plan.id ? <><span className="spinner" aria-hidden /> Redirecting…</> : 'Choose plan'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
