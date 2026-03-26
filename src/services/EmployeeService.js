// src/services/EmployeeService.js
import api from "./api.js";

// Pomoćna funkcija za pretvaranje Backend (snake_case) u Frontend (camelCase)
function normalizeEmployee(d) {
  if (!d) return null;
  return {
    id: d.id,
    firstName: d.first_name,
    lastName: d.last_name,
    email: d.email,
    position: d.position,
    phone: d.phone_number,
    address: d.address,
    active: d.active,
    gender: d.gender,
    department: d.department,
    username: d.username,
    permissions: d.permissions || [],
    dateOfBirth: d.birth_date || d.date_of_birth || 0
  };
}

// 1. Dobijanje liste svih zaposlenih (sa opcionim filterima)
export async function getEmployees(params = {}) {
  const response = await api.get("/employees", { params });
  // Backend vraća ili niz direktno ili objekat { employees: [] }
  const data = response.data.employees ?? response.data;
  return Array.isArray(data) ? data.map(normalizeEmployee) : [];
}

// 2. Dobijanje jednog zaposlenog po ID-u
export async function getEmployeeById(id) {
  const response = await api.get(`/employees/${id}`);
  return normalizeEmployee(response.data);
}

// 3. KREIRANJE novog zaposlenog (Ova funkcija ti je falila)
export async function createEmployee(employeeData) {
  // Podaci se šalju u formatu koji backend očekuje (obično onako kako ih prikupiš iz forme)
  const response = await api.post("/employees", employeeData);
  return response.data;
}

// 4. AZURIRANJE postojećeg zaposlenog
export async function updateEmployee(id, employeeData) {
  const response = await api.put(`/employees/${id}`, employeeData);
  return response.data;
}

// 5. BRISANJE zaposlenog
export async function deleteEmployee(id) {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
}