import { useState, useEffect } from "react";
import { getClientsForSearch } from "../../../api/get/getClientsForSearch";
import { getEmployees } from "../../../api/get/getEmployee";

export const useClientsAndEmployees = () => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, employeesData] = await Promise.all([
          getClientsForSearch(),
          getEmployees(),
        ]);
        
        const sortedClients = [...clientsData].sort((a, b) =>
          a.name.localeCompare(b.name, "ru")
        );
        const sorteDemployeesData = [...employeesData].sort((a, b) =>
          a.Name.localeCompare(b.Name, "ru")
        );

        setClients(sortedClients);
        setEmployees(sorteDemployeesData);
      } catch (err) {
        console.error("Ошибка при загрузке клиентов и сотрудников:", err);
        setClients([]);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const employeeOptions = employees.map((e) => ({ id: e.Code, name: e.Name }));

  return { clients, employees, employeeOptions, loading };
};
