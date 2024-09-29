import React, { createContext, useState, useEffect, useContext } from "react";
import OpenAI from "openai";

const ConfigurationContext = createContext();

export const useConfiguration = () => useContext(ConfigurationContext);

export const ConfigurationProvider = ({ children }) => {
  const [url, setUrl] = useState(null);
  const [model, setModel] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfigFromLocalStorage = async () => {
      const getDefault = (key, fallback) =>
        localStorage.getItem(key) || fallback;

      const defaultUrl = getDefault(
        "openai_api_url",
        process.env.REACT_APP_API_URL || "https://api.openai.com/v1"
      );
      const defaultModel = getDefault(
        "openai_model",
        process.env.REACT_APP_MODEL || "gpt-4"
      );
      const defaultApiKey = getDefault(
        "openai_api_key",
        process.env.REACT_APP_API_KEY || ""
      );
      const defaultSystemPrompt = getDefault(
        "openai_system_prompt",
        process.env.REACT_APP_SYSTEM_PROMPT || "You are a helpful assistant."
      );

      setUrl(defaultUrl);
      setModel(defaultModel);
      setApiKey(defaultApiKey);
      setSystemPrompt(defaultSystemPrompt);

      const config = {
        url: defaultUrl,
        model: defaultModel,
        apiKey: defaultApiKey,
        systemPrompt: defaultSystemPrompt,
      };
      const isValid = await validateConfig(config);
      setModalOpen(!isValid);
      setLoading(false);
    };

    loadConfigFromLocalStorage();
  }, []);

  const validateConfig = async (config) => {
    try {
      const { url, apiKey } = config;
      const configuration = {
        apiKey,
        basePath: url,
        dangerouslyAllowBrowser: true,
      };
      const openai = new OpenAI(configuration);
      await openai.models.list();
      return true;
    } catch (error) {
      console.error("Validation failed", error);
      return false;
    }
  };

  const saveConfiguration = async (newConfig) => {
    const { url, model, apiKey, systemPrompt } = newConfig;
    const isValid = await validateConfig(newConfig);

    if (!isValid) return false;

    localStorage.setItem("openai_api_url", url);
    localStorage.setItem("openai_model", model);
    localStorage.setItem("openai_api_key", apiKey);
    localStorage.setItem("openai_system_prompt", systemPrompt);

    setUrl(url);
    setModel(model);
    setApiKey(apiKey);
    setSystemPrompt(systemPrompt);

    return true;
  };

  return (
    <ConfigurationContext.Provider
      value={{
        url,
        model,
        apiKey,
        systemPrompt,
        validateConfig,
        saveConfiguration,
        modalOpen,
        setModalOpen,
        loading,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};
