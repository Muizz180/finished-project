-- Create the database
CREATE DATABASE IF NOT EXISTS project7;

-- Use the project7 database
USE project7;

-- Create the patient table
CREATE TABLE patient (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(225) NOT NULL
);

-- Create the doctor table
CREATE TABLE doctor (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(225) NOT NULL,
    specialization VARCHAR(225) NOT NULL UNIQUE
);

-- Create the appointment table
CREATE TABLE appointment (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    doctor_name VARCHAR(225) NOT NULL,
    specialization VARCHAR(225) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(225) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);

-- Create the patient_appointments table
CREATE TABLE patient_appointments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    patient_name VARCHAR(225) NOT NULL,
    doctor_name VARCHAR(225) NOT NULL,
    specialization VARCHAR(225) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(225) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);
