import { useEffect, useState } from 'react'
import ComplaintForm from './ComplaintForm'

function Dashboard({ onLogout }) {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState('STUDENT')

    const getRoleFromToken = () => {
        const token = localStorage.getItem('token')

        if (!token) {
            return 'STUDENT'
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.role || 'STUDENT'
        } catch (error) {
            return 'STUDENT'
        }
    }

    const fetchComplaints = async () => {
        const token = localStorage.getItem('token')

        try {
            const response = await fetch('http://localhost:8080/complaints', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch complaints')
            }

            const data = await response.json()
            setComplaints(data)
        } catch (error) {
            console.error('Error fetching complaints:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setRole(getRoleFromToken())
        fetchComplaints()
    }, [])

    const updateStatus = async (complaintId, newStatus) => {
        const token = localStorage.getItem('token')

        try {
            const response = await fetch(
                `http://localhost:8080/complaints/${complaintId}/status?status=${newStatus}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            await fetchComplaints()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        onLogout()
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Campus Complaint Management System</h1>
                    <p>
                        {role === 'ADMIN'
                            ? 'Admin Dashboard'
                            : 'Student Complaint Dashboard'}
                    </p>
                </div>

                <button onClick={handleLogout}>Logout</button>
            </header>

            <main className="dashboard-content">

                {role === 'STUDENT' && (
                    <ComplaintForm onComplaintCreated={fetchComplaints} />
                )}

                <section className="complaints-section">
                    <h2>
                        {role === 'ADMIN' ? 'All Complaints' : 'My Complaints'}
                    </h2>

                    {loading ? (
                        <p>Loading complaints...</p>
                    ) : complaints.length === 0 ? (
                        <p>No complaints found.</p>
                    ) : (
                        <div className="complaint-list">
                            {complaints.map((complaint) => (
                                <div className="complaint-card" key={complaint.id}>
                                    <h3>{complaint.title}</h3>

                                    <p>{complaint.description}</p>

                                    <div className="complaint-details">
                    <span>
                      <strong>Category:</strong> {complaint.category}
                    </span>

                                        <span>
                      <strong>Status:</strong> {complaint.status}
                    </span>

                                        <span>
                      <strong>ID:</strong> #{complaint.id}
                    </span>
                                    </div>

                                    {role === 'ADMIN' && (
                                        <div className="status-controls">
                                            <label>Update Status:</label>

                                            <select
                                                value={complaint.status}
                                                onChange={(event) =>
                                                    updateStatus(
                                                        complaint.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="OPEN">OPEN</option>
                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                <option value="RESOLVED">RESOLVED</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>
        </div>
    )
}

export default Dashboard