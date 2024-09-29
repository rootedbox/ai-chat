import React, { useState, useEffect } from "react";
import { OpenAI } from "openai";

const ConfigurationModal = ({ isOpen, onClose, onSave }) => {
  const getDefault = (key, fallback) => {
    return localStorage.getItem(key) || fallback;
  };

  const defaultUrl = getDefault(
    "openai_api_url",
    process.env.REACT_APP_API_URL || "https://api.openai.com/v1"
  );
  const defaultModel = getDefault(
    "openai_model",
    process.env.REACT_APP_MODEL || "gpt-4o"
  );
  const defaultApiKey = getDefault(
    "openai_api_key",
    process.env.REACT_APP_API_KEY || ""
  );
  const defaultSystemPrompt = getDefault(
    "openai_system_prompt",
    process.env.REACT_APP_SYSTEM_PROMPT || "You are a helpful assistant."
  );

  const [url, setUrl] = useState(defaultUrl);
  const [model, setModel] = useState(defaultModel);
  const [apiKey, setApiKey] = useState(defaultApiKey);
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [errorMessage, setErrorMessage] = useState("");

  const validateConfig = async () => {
    try {
      const configuration = {
        apiKey: apiKey,
        basePath: url,
        dangerouslyAllowBrowser: true,
      };
      const openai = new OpenAI(configuration);
      await openai.models.list();
      return true;
    } catch (error) {
      setErrorMessage(
        "Failed to connect with provided settings: " + error.message
      );
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const isValid = await validateConfig();
    if (isValid) {
      localStorage.setItem("openai_api_url", url);
      localStorage.setItem("openai_model", model);
      localStorage.setItem("openai_api_key", apiKey);
      localStorage.setItem("openai_system_prompt", systemPrompt);

      onSave({ url, model, apiKey, systemPrompt });
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl mb-4">Configure OpenAI Service</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 p-2 bg-gray-600 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationModal;
