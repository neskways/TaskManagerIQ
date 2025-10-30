import { useState, useEffect } from "react";
import { getClientConfigurations } from "../../../api/get/getClientConfigurations";

export const useConfigurations = (client) => {
  const [configurations, setConfigurations] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client) {
      setConfigurations([]);
      setSelectedConfig("");
      setLoading(false);
      return;
    }

    const loadConfigs = async () => {
      setLoading(true);
      try {
        const configs = await getClientConfigurations(client.code);
        setConfigurations(Array.isArray(configs) ? configs : []);
        setSelectedConfig("");
      } catch (err) {
        console.error("Ошибка при загрузке конфигураций:", err);
        setConfigurations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConfigs();
  }, [client]);

  const configOptions = configurations.map((c, index) => ({
    id: c.id || `conf-${index}`,
    name: c.config || c.name || "Без имени",
  }));

  return {
    configurations,
    configOptions,
    selectedConfig,
    setSelectedConfig,
    loading,
  };
};
