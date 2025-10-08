import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // <-- Update this to your backend URL

const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    role: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    axios
      .get(`${BASE_URL}/profile/personal-info/${userId}`)
      .then((response) => {
        const { fullName, email, phone, dob, gender, role } = response.data;
        setPersonalInfo(response.data);
        setFormData({
          fullName,
          email,
          phone,
          dob: dob || "",
          gender,
          role,
        });
      })
      .catch((error) => {
        console.error("Error fetching personal info:", error);
        setError("Unable to retrieve personal details. Please try again.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID is missing.");
      return;
    }

    if (formData.role === "admin" && personalInfo.role !== "admin") {
      setError("You cannot change your role to admin.");
      return;
    }

    axios
      .put(`${BASE_URL}/profile/update-personal-info/${userId}`, formData)
      .then((response) => {
        setPersonalInfo(response.data);
        setIsEditing(false);
        setError("");
      })
      .catch((error) => {
        console.error("Error updating personal info:", error);
        setError("An error occurred while updating your details.");
      });
  };

  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      paddingLeft: "280px",
      paddingRight: "40px",
      transition: "padding-left 0.3s ease-in-out",
    },
    container: {
      width: "650px",
      padding: "30px",
      background: "white",
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      borderRadius: "16px",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "3px solid #0077b6",
      paddingBottom: "10px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#0077b6",
    },
    editButton: {
      backgroundColor: "#0077b6",
      color: "white",
      padding: "8px 12px",
      fontSize: "14px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "0.3s",
    },
    errorText: {
      color: "red",
      fontSize: "14px",
      marginBottom: "10px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
      marginTop: "10px",
    },
    infoBox: {
      padding: "12px",
      background: "#f8f9fa",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    label: {
      fontWeight: "700",
      color: "#005682",
    },
    inputGroup: {
      marginBottom: "15px",
      textAlign: "left",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "15px",
      outline: "none",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
    },
    saveButton: {
      backgroundColor: "#0077b6",
      color: "white",
      padding: "10px 14px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      border: "none",
    },
    cancelButton: {
      backgroundColor: "#e63946",
      color: "white",
      padding: "10px 14px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      border: "none",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Personal Information</h2>
          {!isEditing && (
            <button style={styles.editButton} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        {personalInfo ? (
          isEditing ? (
            <div>
              {["fullName", "email", "phone", "dob", "gender", "role"].map((field) => (
                <div key={field} style={styles.inputGroup}>
                  <label style={styles.label}>
                    {field.replace(/^\w/, (c) => c.toUpperCase())}:
                  </label>
                  <input
                    type={field === "dob" ? "date" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              ))}
              <div style={styles.buttonGroup}>
                <button style={styles.saveButton} onClick={handleSave}>
                  Save Changes
                </button>
                <button style={styles.cancelButton} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.infoGrid}>
              <div style={styles.infoBox}>
                <span style={styles.label}>Full Name:</span> {personalInfo.fullName}
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Email:</span> {personalInfo.email}
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Phone:</span> {personalInfo.phone}
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>DOB:</span> {personalInfo.dob}
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Gender:</span> {personalInfo.gender}
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Role:</span> {personalInfo.role}
              </div>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
