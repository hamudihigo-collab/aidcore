import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/Layout.jsx';
import { Card, Button, Modal } from '../components/UI.jsx';
import { CaseCard, CaseForm } from '../components/CaseComponents.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { caseService } from '../services/caseService.js';

export const CasesPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const [filters, setFilters] = React.useState({});
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { data: casesData, isLoading } = useFetch(
        () => caseService.getCases(filters, page),
        [page, filters]
    );

    const handleCreateCase = async (formData) => {
        try {
            setLoading(true);
            await caseService.createCase(formData);
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating case:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCase = async (id) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            try {
                await caseService.deleteCase(id);
                window.location.reload();
            } catch (error) {
                console.error('Error deleting case:', error);
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar active="cases" />
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Cases</h1>
                        <Button onClick={() => setIsModalOpen(true)}>+ New Case</Button>
                    </div>

                    <Card className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="">All</option>
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Priority</label>
                                <select
                                    onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="">All</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search cases..."
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </Card>

                    {isLoading ? (
                        <p className="text-center text-gray-600">Loading cases...</p>
                    ) : casesData?.data && casesData.data.length > 0 ? (
                        <>
                            {casesData.data.map((caseItem) => (
                                <CaseCard
                                    key={caseItem.id}
                                    caseData={caseItem}
                                    onView={(id) => navigate(`/cases/${id}`)}
                                    onDelete={handleDeleteCase}
                                />
                            ))}

                            <div className="flex justify-between items-center mt-8">
                                <Button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-gray-600">
                                    Page {casesData.pagination?.page} of {casesData.pagination?.totalPages || 1}
                                </span>
                                <Button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= (casesData.pagination?.totalPages || 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Card>
                            <p className="text-center text-gray-600">No cases found</p>
                        </Card>
                    )}

                    <Modal isOpen={isModalOpen} title="Create New Case" onClose={() => setIsModalOpen(false)}>
                        <CaseForm onSubmit={handleCreateCase} loading={loading} />
                    </Modal>
                </main>
            </div>
        </div>
    );
};
