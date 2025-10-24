'use client'

import { useState, useEffect } from 'react'
import { ordersAPI } from '@/lib/api'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'
import toast from 'react-hot-toast'
import Link from 'next/link'
import styles from './orders.module.css'

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [statusNotes, setStatusNotes] = useState('')
    const [updatingStatus, setUpdatingStatus] = useState(false)

    const statusOptions = [
        'pending',
        'confirmed', 
        'payment_received',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    ]

    useEffect(() => {
        fetchOrders()
    }, [selectedStatus, currentPage])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await ordersAPI.getAllOrders(selectedStatus || null, currentPage, 20)
            setOrders(response.orders || [])
            setTotalPages(response.total_pages || 1)
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            setError('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status) => {
        const statusColors = {
            'pending': '#fbbf24',
            'confirmed': '#3b82f6',
            'payment_received': '#10b981',
            'processing': '#8b5cf6',
            'shipped': '#06b6d4',
            'delivered': '#22c55e',
            'cancelled': '#ef4444'
        }
        return statusColors[status] || '#6b7280'
    }

    const getStatusText = (status) => {
        return status.replace('_', ' ').toUpperCase()
    }

    const handleStatusUpdate = (order) => {
        setSelectedOrder(order)
        setNewStatus(order.status)
        setStatusNotes('')
        setShowStatusModal(true)
    }

    const confirmStatusUpdate = async () => {
        if (!selectedOrder || !newStatus) return

        try {
            setUpdatingStatus(true)
            
            const statusData = {
                status: newStatus,
                updated_by: 'admin',
                notes: statusNotes.trim() || null
            }

            await ordersAPI.updateOrderStatus(selectedOrder.id, statusData)
            
            toast.success(`Order status updated to ${getStatusText(newStatus)}`)
            setShowStatusModal(false)
            setSelectedOrder(null)
            
            // Refresh orders
            fetchOrders()
        } catch (error) {
            console.error('Failed to update order status:', error)
            toast.error('Failed to update order status')
        } finally {
            setUpdatingStatus(false)
        }
    }

    const handleQuickConfirm = async (order) => {
        try {
            const statusData = {
                status: 'confirmed',
                updated_by: 'admin',
                notes: 'Order confirmed by admin'
            }

            await ordersAPI.updateOrderStatus(order.id, statusData)
            toast.success('Order confirmed successfully')
            fetchOrders()
        } catch (error) {
            console.error('Failed to confirm order:', error)
            toast.error('Failed to confirm order')
        }
    }

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading orders...</p>
                    </div>
                </div>
            </ProtectedAdminRoute>
        )
    }

    return (
        <ProtectedAdminRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1>Orders Management</h1>
                        <p>Manage all customer orders and update their status</p>
                    </div>
                    <Link href="/admin/dashboard" className={styles.backButton}>
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value)
                            setCurrentPage(1)
                        }}
                        className={styles.statusFilter}
                    >
                        <option value="">All Orders</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {getStatusText(status)}
                            </option>
                        ))}
                    </select>
                    
                    <button onClick={fetchOrders} className={styles.refreshButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="23 4 23 10 17 10"/>
                            <polyline points="1 20 1 14 7 14"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                        </svg>
                        Refresh
                    </button>
                </div>

                {error ? (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button onClick={fetchOrders} className={styles.retryButton}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Orders Table */}
                        <div className={styles.tableContainer}>
                            {orders.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <h3>No orders found</h3>
                                    <p>There are no orders matching the selected criteria.</p>
                                </div>
                            ) : (
                                <table className={styles.ordersTable}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td>
                                                    <Link 
                                                        href={`/order/${order.order_id}`}
                                                        className={styles.orderLink}
                                                        target="_blank"
                                                    >
                                                        {order.order_id}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <div className={styles.customerInfo}>
                                                        <div className={styles.customerName}>
                                                            {order.customer_name}
                                                        </div>
                                                        <div className={styles.customerContact}>
                                                            {order.customer_phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={styles.total}>
                                                    {formatPrice(order.total)}
                                                </td>
                                                <td>
                                                    <span 
                                                        className={styles.statusBadge}
                                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                                    >
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </td>
                                                <td className={styles.date}>
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        {order.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleQuickConfirm(order)}
                                                                className={styles.confirmButton}
                                                                title="Quick Confirm"
                                                            >
                                                                ✓ Confirm
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleStatusUpdate(order)}
                                                            className={styles.updateButton}
                                                            title="Update Status"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={styles.pageButton}
                                >
                                    Previous
                                </button>
                                <span className={styles.pageInfo}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={styles.pageButton}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Status Update Modal */}
                {showStatusModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h3>Update Order Status</h3>
                            <p>Order: {selectedOrder?.order_id}</p>
                            <p>Customer: {selectedOrder?.customer_name}</p>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="status">New Status:</label>
                                <select
                                    id="status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className={styles.statusSelect}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {getStatusText(status)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="notes">Notes (Optional):</label>
                                <textarea
                                    id="notes"
                                    value={statusNotes}
                                    onChange={(e) => setStatusNotes(e.target.value)}
                                    placeholder="Add any notes about this status update..."
                                    className={styles.notesTextarea}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className={styles.cancelButton}
                                    disabled={updatingStatus}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusUpdate}
                                    className={styles.confirmButton}
                                    disabled={updatingStatus}
                                >
                                    {updatingStatus ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedAdminRoute>
    )
}