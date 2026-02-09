import React from 'react';
import { Card, Button, Badge } from './UI.jsx';
import { formatDate, getStatusColor, getPriorityColor } from '../utils/helpers.js';

export const CaseCard = ({ caseData, onView, onDelete }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="text-lg font-bold text-gray-900">{caseData.title}</h3>
                <p className="text-sm text-gray-600">{caseData.case_number}</p>
            </div>
            <div className="flex gap-2">
                <Badge variant={getStatusColor(caseData.status)}>{caseData.status}</Badge>
                <Badge variant={getPriorityColor(caseData.priority)}>{caseData.priority}</Badge>
            </div>
        </div>
        <p className="text-gray-700 text-sm mb-4">{caseData.description}</p>
        <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Created: {formatDate(caseData.created_at)}</p>
            <div className="flex gap-2">
                <Button size="sm" onClick={() => onView(caseData.id)}>View</Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(caseData.id)}>Delete</Button>
            </div>
        </div>
    </Card>
);

export const CaseForm = ({ onSubmit, initialData = null, loading = false }) => {
    const [formData, setFormData] = React.useState(
        initialData || {
            title: '',
            description: '',
            priority: 'medium',
            status: 'open',
            clientId: '',
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                        <option value="closed">Closed</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
                {initialData ? 'Update Case' : 'Create Case'}
            </Button>
        </form>
    );
};
