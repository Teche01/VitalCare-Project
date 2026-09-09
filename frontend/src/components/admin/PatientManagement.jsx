import { useEffect, useState } from "react";

import {
  getAllPatients,
} from "../../services/adminService";

function PatientManagement() {

  const [patients, setPatients] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadPatients = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getAllPatients();

      setPatients(data);

    } catch (err) {

      console.error(
        "Failed to load patients",
        err
      );

      setError(
        "Unable to load patients."
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients =
    patients.filter((patient) => {

      const value =
        search.toLowerCase();

      return (
        patient.fullName
          ?.toLowerCase()
          .includes(value) ||

        patient.phone
          ?.toLowerCase()
          .includes(value) ||

        patient.email
          ?.toLowerCase()
          .includes(value)
      );
    });

  return (
    <div className="mt-10">

      <div className="mb-5">

        <h2 className="text-2xl font-bold text-slate-900">
          Patient Management
        </h2>

        <p className="mt-1 text-slate-600">
          View registered VitalCare patients.
        </p>

      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Registered Patients
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Total: {patients.length}
              </p>

            </div>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search name, phone or email"
              className="w-full md:w-80 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

        </div>

        {loading ? (

          <div className="p-10 text-center text-blue-600">
            Loading patients...
          </div>

        ) : filteredPatients.length === 0 ? (

          <div className="p-10 text-center text-slate-500">
            No patients found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-5 py-4">
                    Patient
                  </th>

                  <th className="px-5 py-4">
                    Contact
                  </th>

                  <th className="px-5 py-4">
                    Gender
                  </th>

                  <th className="px-5 py-4">
                    Date of Birth
                  </th>

                  <th className="px-5 py-4">
                    Address
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPatients.map(
                  (patient) => (

                    <tr
                      key={
                        patient.patientId
                      }
                      className="border-t border-slate-100"
                    >

                      <td className="px-5 py-4">

                        <p className="font-medium text-slate-900">
                          {
                            patient.fullName
                          }
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Patient ID:{" "}
                          {
                            patient.patientId
                          }
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-slate-700">
                          {
                            patient.phone
                          }
                        </p>

                        <p className="text-sm text-slate-500">
                          {
                            patient.email
                          }
                        </p>

                      </td>

                      <td className="px-5 py-4">
                        {
                          patient.gender ||
                          "-"
                        }
                      </td>

                      <td className="px-5 py-4">
                        {
                          patient.dateOfBirth ||
                          "-"
                        }
                      </td>

                      <td className="px-5 py-4 max-w-xs text-slate-600">
                        {
                          patient.address ||
                          "-"
                        }
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default PatientManagement;