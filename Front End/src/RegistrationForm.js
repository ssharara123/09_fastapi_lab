// RegistrationForm.js
import React, { useState } from 'react';
import './RegistrationForm.css'; // Import the CSS file for styling

function RegistrationForm() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform frontend validations
        const errors = {};
        if (formData.username.length <= 5) {
            errors.username = "Username must have more than 5 characters";
        }
        if (formData.password.length <= 6) {
            errors.password = "Password must have more than 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        if (formData.email === '') {
            errors.email = "Email is required";
        }
        if (!validateEmail(formData.email)) {
            errors.email = "Invalid email format";
        }
        if (formData.phoneNumber.length !== 11) {
            errors.phoneNumber = "Phone number must have exactly 11 digits";
        }
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            // Send formData to backend
            fetch('http://127.0.0.1:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
            setFormData({
                username: '',
                password: '',
                confirmPassword: '',
                email: '',
                phoneNumber: ''
            });
        }
    };


    const validateEmail = (email) => {
        // Very basic email validation
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <div className="form-container"> {}
            
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                    {errors.username && <span>{errors.username}</span>}
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                    {errors.password && <span>{errors.password}</span>}
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
                    {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                    {errors.email && <span>{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
                    {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );

}


export default RegistrationForm;
