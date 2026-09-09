import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="max-w-3xl">

          <p className="text-blue-600 font-semibold mb-4">
            Multi-Speciality Healthcare Platform
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Your healthcare journey,
            <span className="text-blue-600">
              {" "}made simpler.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            VitalCare helps patients find doctors,
            book appointments and manage consultations
            across multiple hospital specialities through
            one convenient platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Book an Appointment
            </Link>

            <Link
              to="/login"
              className="border border-slate-300 bg-white text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition"
            >
              Login
            </Link>

          </div>

        </div>

      </section>

      <section className="bg-white border-t border-slate-200">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold text-slate-900">
              How VitalCare Works
            </h2>

            <p className="mt-3 text-slate-600">
              A simple healthcare journey from appointment
              booking to consultation.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-slate-50 p-7 rounded-xl border border-slate-200">
              <div className="text-blue-600 font-bold text-xl mb-3">
                01
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                Find a Doctor
              </h3>

              <p className="mt-2 text-slate-600">
                Browse doctors by department and
                specialization.
              </p>
            </div>

            <div className="bg-slate-50 p-7 rounded-xl border border-slate-200">
              <div className="text-blue-600 font-bold text-xl mb-3">
                02
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                Book Appointment
              </h3>

              <p className="mt-2 text-slate-600">
                Choose an available date and appointment
                time that suits you.
              </p>
            </div>

            <div className="bg-slate-50 p-7 rounded-xl border border-slate-200">
              <div className="text-blue-600 font-bold text-xl mb-3">
                03
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                Consult & Follow Up
              </h3>

              <p className="mt-2 text-slate-600">
                Consult your doctor and access your
                digital prescription afterward.
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default HomePage;