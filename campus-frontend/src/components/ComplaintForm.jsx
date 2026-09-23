import { useState } from 'react'

function ComplaintForm({ onComplaintCreated }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('OTHER')
    const [message, setMessage] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessage('')

        const token = localStorage.getItem('token')

        try {
            const response = await fetch('http://localhost:8080/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    status: 'OPEN',
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create complaint')
            }

            setTitle('')
            setDescription('')
            setCategory('OTHER')
            setMessage('Complaint submitted successfully!')

            onComplaintCreated()
        } catch (error) {
            setMessage('Failed to submit complaint.')
        }
    }

    return (
        <div className="complaint-form">
            <h2>Raise a Complaint</h2>

            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    type="text"
                    placeholder="Complaint title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />

                <label>Description</label>
                <textarea
                    placeholder="Describe your complaint"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows="4"
                    required
                />

                <label>Category</label>
                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                >
                    <option value="OTHER">Other</option>
                    <option value="WIFI">WiFi</option>
                    <option value="ELECTRICITY">Electricity</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="CLEANING">Cleaning</option>
                    <option value="ACADEMIC">Academic</option>
                </select>

                <button type="submit">Submit Complaint</button>
            </form>

            {message && <p className="success">{message}</p>}
        </div>
    )
}

export default ComplaintForm