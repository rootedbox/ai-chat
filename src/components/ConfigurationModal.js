import React, { useState, useEffect } from "react";
import { useConfiguration } from "../context/ConfigurationContext"; 

const ConfigurationModal = ({ isOpen, onClose }) => {
  const { url, model, apiKey, systemPrompt, saveConfiguration } =
    useConfiguration();
  const [localUrl, setLocalUrl] = useState(url);
  const [localModel, setLocalModel] = useState(model);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLocalUrl(url);
    setLocalModel(model);
    setLocalApiKey(apiKey);
    setLocalSystemPrompt(systemPrompt);
  }, [url, model, apiKey, systemPrompt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const success = await saveConfiguration({
      url: localUrl,
      model: localModel,
      apiKey: localApiKey,
      systemPrompt: localSystemPrompt,
    });

    if (success) {
      onClose();
    } else {
      setErrorMessage(
        "Failed to connect with provided settings. Please check your API Key, URL, and other details."
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl mb-4">Configuration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">API URL</label>
            <input
              type="text"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Model</label>
            <input
              type="text"
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">API Key</label>
            <input
              type="text"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">System Prompt</label>
            <textarea
              value={localSystemPrompt}
              onChange={(e) => setLocalSystemPrompt(e.target.value)}
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
