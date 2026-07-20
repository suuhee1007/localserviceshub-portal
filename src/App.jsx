import { useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useParams
} from 'react-router-dom';

const API_BASE = 'https://localserviceshub-services.onrender.com/api';
const SERVICE_TYPES = [
  { key: 'roomsharing', label: 'Room Sharing', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80' },
  { key: 'beautyservice', label: 'Beauty Services', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
  { key: 'foodservice', label: 'Food Services', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80' },
  { key: 'helpers', label: 'Helpers', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
  { key: 'eventmanager', label: 'Event Managers', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80' },
  { key: 'plumbers', label: 'Plumbers', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80' },
  { key: 'electrician', label: 'Electricians', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' },
  { key: 'cleaning', label: 'Cleaning Services', image: 'https://images.unsplash.com/photo-1581572473681-3b7d7b47e9bc?auto=format&fit=crop&w=900&q=80' },
  { key: 'laundry', label: 'Laundry', image: 'https://images.unsplash.com/photo-1626806787461-1234d8a4e9f6?auto=format&fit=crop&w=900&q=80' },
  { key: 'insurance', label: 'Insurance', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80' },
  { key: 'taxfiling', label: 'Tax Filing', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80' }
];

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
];

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <NavLink to="/" className="brand">
            DesisLocalServicesHub
          </NavLink>
          <NavLink to="/register" className="primary-button">
            Register Your Service
          </NavLink>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/type/:serviceType" element={<ServiceTypePage />} />
            <Route path="/service/:serviceId" element={<ServiceDetailsPage />} />
            <Route path="/register" element={<RegisterServicePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <section className="page page-home">
      <div className="hero-banner">
        <div className="hero-card">
          <div className="hero-badge">Usa Desis community connection</div>
          <h1>Bringing trusted local support to the Usa and Desi community.</h1>
          <p>
            From neighborhood care to community connections, discover services shaped by
            American convenience and desi warmth in one beautifully curated experience.
          </p>
          <div className="hero-actions">
            <NavLink to="/register" className="primary-button">
              Register Your Service
            </NavLink>
            <NavLink to="/type/beautyservice" className="primary-button">
              Explore Nearby Services
            </NavLink>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Browse Services</h2>
        <p>Select a service category to explore local providers and view full details.</p>
        <div className="service-grid">
          {SERVICE_TYPES.map((type) => (
            <NavLink
              key={type.key}
              to={`/type/${type.key}`}
              className="service-card"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(248, 250, 252, 0.94) 0%, rgba(191, 219, 254, 0.82) 100%), url('${type.image}')`
              }}
            >
              <div>
                <strong>{type.label}</strong>
              </div>
              <div className="service-link">View Providers</div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceTypePage() {
  const { serviceType } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const typeLabel = SERVICE_TYPES.find((item) => item.key === serviceType)?.label || serviceType;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('type', serviceType);
    if (stateFilter) {
      params.set('state', stateFilter);
    }
    if (cityFilter) {
      params.set('city', cityFilter);
    }

    fetch(`${API_BASE}/services?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load services.');
        }
        return response.json();
      })
      .then((data) => {
        setServices(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [serviceType, stateFilter, cityFilter]);

  return (
    <section className="page page-list">
      <h2>{typeLabel}</h2>
      <p>Search local providers by state and city within this category.</p>

      <div className="search-filters">
        <div className="filter-field">
          <label>State</label>
          <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
            <option value="">All states</option>
            {US_STATES.map((stateName) => (
              <option key={stateName} value={stateName}>{stateName}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label>City</label>
          <input
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            placeholder="Enter city"
          />
        </div>
      </div>

      {loading && <div className="status-message">Loading services...</div>}
      {error && <div className="status-message status-error">{error}</div>}
      {!loading && !error && services.length === 0 && (
        <div className="status-message">No services found for this category yet.</div>
      )}

      <div className="services-list">
        {services.map((item) => (
          <NavLink key={item.id} to={`/service/${item.id}`} className="service-item">
            <div className="service-item-title">{item.serviceName}</div>
            <div className="service-item-meta">{item.city}, {item.state} · {item.serviceType}</div>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/services/${serviceId}`)
      .then((response) => {
        if (response.status === 404) {
          throw new Error('Service not found.');
        }
        if (!response.ok) {
          throw new Error('Unable to load service details.');
        }
        return response.json();
      })
      .then((data) => {
        setService(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [serviceId]);

  return (
    <section className="page page-details">
      {loading && <div className="status-message">Loading service details...</div>}
      {error && <div className="status-message status-error">{error}</div>}
      {service && (
        <div className="details-card">
          <h2>{service.serviceName}</h2>
          <p className="details-type">{capitalize(service.serviceType)}</p>
          <p>{service.serviceDescription}</p>
          <div className="details-meta">
            <div><strong>City</strong>: {service.city}</div>
            <div><strong>State</strong>: {service.state}</div>
            <div><strong>ZIP</strong>: {service.zipCode}</div>
            <div><strong>Address</strong>: {service.address}</div>
          </div>
        </div>
      )}
    </section>
  );
}

function RegisterServicePage() {
  const navigate = useNavigate();
  const surveyWindowRef = useRef(null);
  const [form, setForm] = useState({
    serviceName: '',
    serviceDescription: '',
    serviceType: SERVICE_TYPES[0].key,
    city: '',
    state: US_STATES[0],
    zipCode: '',
    address: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const openQualtricsSurvey = () => {
    const url = 'https://qualtricsxmj67k6986x.qualtrics.com/jfe/form/SV_4ZvE1LZ6B4TkMWW';
    const features = 'width=900,height=700,top=100,left=100,resizable=yes,scrollbars=yes';
    const popup = window.open(url, 'serviceRegistrationSurvey', features);

    if (popup) {
      popup.focus();
      surveyWindowRef.current = popup;
    } else {
      setStatus({
        type: 'error',
        message: 'Please allow pop-ups to view the follow-up survey.'
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || 'Failed to register service.');
      }

      setStatus({ type: 'success', message: 'Service registered successfully.' });
      openQualtricsSurvey();
      setForm({
        serviceName: '',
        serviceDescription: '',
        serviceType: SERVICE_TYPES[0].key,
        city: '',
        state: US_STATES[0],
        zipCode: '',
        address: ''
      });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page page-form">
      <h2>Register Your Service</h2>
      <p>Share your service with the community by adding your details below.</p>

      <form className="service-form" onSubmit={handleSubmit}>
        <label>
          Service Name
          <input
            name="serviceName"
            value={form.serviceName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Service Description
          <textarea
            name="serviceDescription"
            value={form.serviceDescription}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Service Type
          <select name="serviceType" value={form.serviceType} onChange={handleChange}>
            {SERVICE_TYPES.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          City
          <input name="city" value={form.city} onChange={handleChange} required />
        </label>

        <label>
          State
          <select name="state" value={form.state} onChange={handleChange} required>
            {US_STATES.map((stateName) => (
              <option key={stateName} value={stateName}>{stateName}</option>
            ))}
          </select>
        </label>

        <label>
          ZIP Code
          <input name="zipCode" value={form.zipCode} onChange={handleChange} required />
        </label>

        <label>
          Address
          <input name="address" value={form.address} onChange={handleChange} required />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Registering...' : 'Submit Service'}
        </button>

        {status && (
          <div className={`status-message ${status.type === 'error' ? 'status-error' : 'status-success'}`}>
            {status.message}
          </div>
        )}
      </form>
    </section>
  );
}

function NotFound() {
  return (
    <section className="page page-notfound">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
    </section>
  );
}

function capitalize(value) {
  if (!value) return '';
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default App;
