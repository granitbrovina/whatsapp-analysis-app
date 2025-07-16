import React from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="mb-4 flex flex-col items-center">
      <label htmlFor="language" className="mb-1 font-medium text-gray-700">
        Select chat language
      </label>
      <select
        id="language"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-medium"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
