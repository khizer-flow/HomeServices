import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/bookings');
            const data = await response.json();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const assignTechnician = (id) => {
        // Optimistic UI update
        const updatedBookings = bookings.map(booking => {
            if (booking._id === id) {
                return { ...booking, status: 'assigned' };
            }
            return booking;
        });
        setBookings(updatedBookings);
        alert(`Technician assigned for booking ID: ${id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Booking Requests</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Total: {bookings.length}
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No bookings found.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Service</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800">{booking.user}</td>
                                    <td className="p-4 text-gray-600">{booking.service?.name || "Unknown Service"}</td>
                                    <td className="p-4 text-gray-600 text-sm">{booking.location}</td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        {new Date(booking.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    booking.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => assignTechnician(booking._id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors shadow-sm"
                                            >
                                                Assign Technician
                                            </button>
                                        )}
                                        {booking.status === 'assigned' && (
                                            <span className="text-gray-400 text-sm italic">Technician Assigned</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
