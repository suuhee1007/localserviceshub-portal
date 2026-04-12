import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useParams
} from 'react-router-dom';

const API_BASE = '/api';
const SERVICE_TYPES = [
  { key: 'roomsharing', label: 'Room Sharing' },
  { key: 'beautyservice', label: 'Beauty Services' },
  { key: 'foodservice', label: 'Food Services' },
  { key: 'helpers', label: 'Helpers' },
  { key: 'eventmanager', label: 'Event Managers' },
  { key: 'plumbers', label: 'Plumbers' },
  { key: 'electrician', label: 'Electricians' },
  { key: 'cleaning', label: 'Cleaning Services' },
  { key: 'laundry', label: 'Laundry' }
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
      <div className="hero-card">
        <h1>DesisLocalServicesHub</h1>
        <p>
          DesisLocalServicesHub is your neighborhood guide to trusted services for
          the desi community. Discover room sharing, personal care, food delivery,
          home repairs, event planners, and more—all in one place.
        </p>
      </div>

      <div className="section">
        <h2>Browse Services</h2>
        <p>Select a service category to explore local providers and view full details.</p>
        <div className="service-grid">
          {SERVICE_TYPES.map((type) => (
            <NavLink key={type.key} to={`/type/${type.key}`} className="service-card">
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

  const typeLabel = SERVICE_TYPES.find((item) => item.key === serviceType)?.label || serviceType;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/services?type=${encodeURIComponent(serviceType)}`)
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
  }, [serviceType]);

  return (
    <section className="page page-list">
      <h2>{typeLabel}</h2>
      <p>Local service providers in the selected category.</p>

      {loading && <div className="status-message">Loading services...</div>}
      {error && <div className="status-message status-error">{error}</div>}
      {!loading && !error && services.length === 0 && (
        <div className="status-message">No services found for this category yet.</div>
      )}

      <div className="services-list">
        {services.map((item) => (
          <NavLink key={item.id} to={`/service/${item.id}`} className="service-item">
            <div className="service-item-title">{item.serviceName}</div>
            <div className="service-item-meta">{item.city} · {item.serviceType}</div>
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
  const [form, setForm] = useState({
    serviceName: '',
    serviceDescription: '',
    serviceType: SERVICE_TYPES[0].key,
    city: '',
    zipCode: '',
    address: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setForm({
        serviceName: '',
        serviceDescription: '',
        serviceType: SERVICE_TYPES[0].key,
        city: '',
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
