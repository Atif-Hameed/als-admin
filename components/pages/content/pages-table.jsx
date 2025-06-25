'use client';
import React, { useState } from 'react';
import Button from '@/components/shared/custom-btn';
import Modal from '@/components/shared/modal';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { deletePage } from '@/app/actions/content-pages';

const PagesTable = ({ pages: initialPages }) => {
    const [pages, setPages] = useState(initialPages);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); // New loading state
    const router = useRouter();

    const handleDelete = async (pageId) => {
        setIsDeleting(true); // Start loading
        try {
            const response = await deletePage(pageId);
            console.log(response)
            if (response.error) throw new Error(response.error);

            setPages((prev) => prev.filter((page) => page._id !== pageId));
            toast.success('Page deleted successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to delete page');
        } finally {
            setIsDeleting(false); // End loading
        }
    };

    const handleOpenDelete = (id) => {
        setOpenDelete(true);
        setSelectedPageId(id);
    };

    const handleCloseDelete = () => {
        if (!isDeleting) { 
            setOpenDelete(false);
            setSelectedPageId(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedPageId && !isDeleting) {
            console.log(selectedPageId)
            await handleDelete(selectedPageId);
            handleCloseDelete();
        }
    };

    return (
        <div className="overflow-x-auto max-w-[90vw] w-full">
            <table className="w-full overflow-x-auto bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 border-b border-border">
                        <th className="py-2 px-4 text-left whitespace-nowrap">#</th>
                        <th className="py-2 px-4 text-left whitespace-nowrap">Page Name</th>
                        <th className="py-2 px-4 text-left whitespace-nowrap">Slug</th>
                        <th className="py-2 px-4 text-left whitespace-nowrap">Last Updated</th>
                        <th className="py-2 px-4 text-left whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map((page, index) => (
                        <tr key={page._id} className="hover:bg-gray-50 border-b border-border">
                            <td className="py-2 px-4 whitespace-nowrap">{index + 1}</td>
                            <td className="py-2 px-4 whitespace-nowrap">{page.pageName}</td>
                            <td className="py-2 px-4 whitespace-nowrap">{page.slug}</td>
                            <td className="py-2 px-4 whitespace-nowrap">
                                {new Date(page.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 whitespace-nowrap flex items-center space-x-2">
                                <Button
                                    style="!bg-blue-500 !text-white !px-2 !py-1 rounded"
                                    label={<FaRegEdit />}
                                    onClick={() => router.push(`/admin/web-pages/${page.slug}`)}
                                />
                                <Button
                                    style="!bg-red-500 !text-white !px-2 !py-1 rounded"
                                    label={<FaTrash />}
                                    onClick={() => handleOpenDelete(page._id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={openDelete} onClose={handleCloseDelete}>
                <div className="bg-white p-6 rounded-xl max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                    <p className="mb-6">Are you sure you want to delete this page? This action cannot be undone.</p>
                    <div className="flex justify-end gap-3">
                        <Button
                            style="!bg-gray-500 !text-white !px-4 !py-2 rounded-lg"
                            label="Cancel"
                            onClick={handleCloseDelete}
                        />
                        <Button
                            style="!bg-red-600 !text-white !px-4 !py-2 rounded-lg"
                            label="Delete"
                            loading={isDeleting}
                            disabled={isDeleting}
                            loadingLabel='Deleting...'
                            onClick={handleConfirmDelete}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PagesTable;
