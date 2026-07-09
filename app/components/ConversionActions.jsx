'use client';

import { useState } from 'react';
import {
  trackContactClick,
  trackEventRegistration,
  trackLeadSubmit,
} from '../../src/app/lib/analytics.js';
import { getAttributionPayload } from '../../src/app/lib/attribution.js';

export function TrackedContactLink({ href, method, location = 'unknown', className = '', children, ...props }) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackContactClick(method, location, getAttributionPayload())}
      {...props}
    >
      {children}
    </a>
  );
}

function ConsentNotice() {
  return (
    <p className="text-xs leading-relaxed text-gray-500">
      Нажимая кнопку, вы соглашаетесь на обработку контактных данных для ответа на заявку.
    </p>
  );
}

export function EventRegistrationForm({ eventId, eventSlug }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    position: '',
    comment: '',
    website: '',
  });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');

    try {
      const attribution = getAttributionPayload();
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, attribution }),
      });

      if (!response.ok) throw new Error('Event registration failed');

      trackEventRegistration(eventSlug, attribution);
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', company: '', position: '', comment: '', website: '' });
    } catch (_error) {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">
          Спасибо! Мы получили регистрацию и свяжемся с вами для подтверждения участия.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`event-${eventSlug}-website`}>Сайт</label>
        <input
          id={`event-${eventSlug}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(inputEvent) => setFormData({ ...formData, website: inputEvent.target.value })}
        />
      </div>
      {[
        ['name', 'Имя', 'text', true, 'name'],
        ['phone', 'Телефон', 'tel', true, 'tel'],
        ['email', 'Email', 'email', true, 'email'],
        ['company', 'Компания', 'text', false, 'organization'],
        ['position', 'Должность', 'text', false, 'organization-title'],
      ].map(([field, label, type, required, autoComplete]) => (
        <div key={field}>
          <label className="mb-1 block text-sm font-medium" htmlFor={`event-${eventSlug}-${field}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            id={`event-${eventSlug}-${field}`}
            type={type}
            required={required}
            value={formData[field]}
            onChange={(inputEvent) => setFormData({ ...formData, [field]: inputEvent.target.value })}
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            autoComplete={autoComplete}
          />
        </div>
      ))}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`event-${eventSlug}-comment`}>
          Комментарий
        </label>
        <textarea
          id={`event-${eventSlug}-comment`}
          rows={3}
          value={formData.comment}
          onChange={(inputEvent) => setFormData({ ...formData, comment: inputEvent.target.value })}
          className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {status === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Не удалось зарегистрироваться. Попробуйте позже или напишите в WhatsApp.
        </div>
      )}

      <ConsentNotice />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Отправка...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}

export default function LeadFormClient({ source = 'site' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    comment: '',
    website: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const attribution = getAttributionPayload();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source, attribution }),
      });

      if (!response.ok) throw new Error('Lead submit failed');

      trackLeadSubmit(source, attribution);
      setStatus('success');
      setFormData({ name: '', phone: '', company: '', comment: '', website: '' });
    } catch (_error) {
      setStatus('error');
      setErrorMessage('Не удалось отправить заявку. Попробуйте позже или напишите в WhatsApp.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">
          Спасибо! Мы получили заявку, отправим программу и предложим подходящий формат работы.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${source}-website`}>Сайт</label>
        <input
          id={`${source}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(event) => setFormData({ ...formData, website: event.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${source}-name`}>
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          id={`${source}-name`}
          type="text"
          required
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          autoComplete="name"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${source}-phone`}>
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          id={`${source}-phone`}
          type="tel"
          required
          value={formData.phone}
          onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
          className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          autoComplete="tel"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${source}-company`}>
          Компания
        </label>
        <input
          id={`${source}-company`}
          type="text"
          value={formData.company}
          onChange={(event) => setFormData({ ...formData, company: event.target.value })}
          className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          autoComplete="organization"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${source}-comment`}>
          Комментарий
        </label>
        <textarea
          id={`${source}-comment`}
          rows={4}
          value={formData.comment}
          onChange={(event) => setFormData({ ...formData, comment: event.target.value })}
          className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {status === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <ConsentNotice />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}
