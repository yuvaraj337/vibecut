"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  signOut,
} from "@/lib/authService";
import {
  getAppointments,
  updateAppointmentStatus,
} from "@/lib/appointmentService";

export default function AdminPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    const user = await getCurrentUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    const result = await getAppointments();

    if (result.success) {
      setAppointments(result.data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function changeStatus(id: string, status: string) {
    await updateAppointmentStatus(id, status as any);
    await loadDashboard();
  }

  async function logout() {
    await signOut();
    router.replace("/admin/login");
  }

  const pending = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  const confirmed = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;

  const today = new Date().toISOString().slice(0, 10);

  const todayAppointments = appointments.filter(
    (a) => a.appointment_date === today
  ).length;

  const revenue = appointments
    .filter((a) => a.status !== "cancelled" && a.status !== "rejected")
    .reduce((sum, a) => sum + Number(a.price || 0), 0);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#02080f",
          color: "#dcae46",
          display: "grid",
          placeItems: "center",
        }}
      >
        LOADING ADMIN...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#02080f",
        color: "#f5f0e5",
        padding: 24,
      }}
    >
      <header
        style={{
          maxWidth: 1200,
          margin: "0 auto 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#dcae46",
              fontSize: 10,
              letterSpacing: "0.2em",
            }}
          >
            VIBE CUT MEN'S SALON
          </div>

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 32,
              fontWeight: 500,
              margin: "5px 0",
            }}
          >
            ADMIN DASHBOARD
          </h1>
        </div>

        <button
          onClick={logout}
          style={{
            border: "1px solid #806323",
            background: "#031321",
            color: "#dcae46",
            padding: "10px 18px",
            borderRadius: 4,
          }}
        >
          LOG OUT
        </button>
      </header>

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto 28px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
        }}
      >
        <Stat title="TODAY'S APPOINTMENTS" value={todayAppointments} />
        <Stat title="PENDING REQUESTS" value={pending} />
        <Stat title="CONFIRMED" value={confirmed} />
        <Stat
          title="ESTIMATED REVENUE"
          value={`₹${revenue}`}
        />
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          border: "1px solid #5a481d",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 18,
            borderBottom: "1px solid #4b3c1c",
            color: "#dcae46",
            letterSpacing: "0.15em",
            fontSize: 11,
          }}
        >
          APPOINTMENTS
        </div>

        {appointments.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#888",
            }}
          >
            No appointments yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
              }}
            >
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.customer_name}</td>
                    <td>{appointment.service_name}</td>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.appointment_time}</td>
                    <td>{appointment.phone}</td>
                    <td>{appointment.status}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        {appointment.status === "pending" && (
                          <>
                            <Action
                              text="CONFIRM"
                              onClick={() =>
                                changeStatus(
                                  appointment.id,
                                  "confirmed"
                                )
                              }
                            />

                            <Action
                              text="REJECT"
                              onClick={() =>
                                changeStatus(
                                  appointment.id,
                                  "rejected"
                                )
                              }
                            />
                          </>
                        )}

                        {appointment.status === "confirmed" && (
                          <>
                            <Action
                              text="COMPLETE"
                              onClick={() =>
                                changeStatus(
                                  appointment.id,
                                  "completed"
                                )
                              }
                            />

                            <Action
                              text="CANCEL"
                              onClick={() =>
                                changeStatus(
                                  appointment.id,
                                  "cancelled"
                                )
                              }
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        border: "1px solid #5a481d",
        background: "#031321",
        borderRadius: 7,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#999",
          fontSize: 9,
          letterSpacing: "0.13em",
        }}
      >
        {title}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: 8,
          color: "#dcae46",
          fontFamily: "Georgia, serif",
          fontSize: 28,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Action({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#071522",
        border: "1px solid #806323",
        color: "#dcae46",
        borderRadius: 3,
        padding: "6px 8px",
        fontSize: 8,
        fontWeight: 700,
      }}
    >
      {text}
    </button>
  );
}