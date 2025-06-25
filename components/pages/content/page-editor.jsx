'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/shared/custom-btn';
import { useRouter } from 'next/navigation';
import { createPage, updatePage } from '@/app/actions/content-pages';
import toast from 'react-hot-toast';
import Back from '@/components/shared/back-btn';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const pageOptions = [
    { pageName: 'Acceptable Use Policy', slug: 'acceptable-use-policy' },
    { pageName: 'Terms & Conditions', slug: 'terms-and-conditions' },
    { pageName: 'Privacy Policy', slug: 'privacy-policy' },
    { pageName: 'Other' }
];

const PageEditorForm = ({ pageData }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [formData, setFormData] = useState({
        pageName: pageData?.pageName || '',
        slug: pageData?.slug || '',
        content: pageData?.content || '',
    });

    useEffect(() => {
        if (pageData) {
            setFormData({
                pageName: pageData.pageName,
                slug: pageData.slug,
                content: pageData.content,
            });
            // Check if existing page name is not in predefined options
            if (!pageOptions.some(option => option.pageName === pageData.pageName)) {
                setShowCustomInput(true);
            }
        }
    }, [pageData]);

    const handlePageOptionChange = (e) => {
        const selectedValue = e.target.value;
        const isOtherSelected = selectedValue === 'Other';
        setShowCustomInput(isOtherSelected);

        if (!isOtherSelected) {
            const selectedOption = pageOptions.find(option => option.pageName === selectedValue);
            setFormData(prev => ({
                ...prev,
                pageName: selectedOption.pageName,
                slug: selectedOption.slug || selectedOption.pageName.toLowerCase().replace(/\s+/g, '-'),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                pageName: '',
                slug: '',
            }));
        }
    };

    const handleCustomPageNameChange = (e) => {
        const pageName = e.target.value;
        setFormData(prev => ({
            ...prev,
            pageName,
            slug: pageName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let response;
            if (pageData) {
                response = await updatePage(formData, pageData._id);
            } else {
                response = await createPage(formData);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            toast.success(pageData ? 'Page updated successfully' : 'Page created successfully');
            router.push('/admin/web-pages');
        } catch (error) {
            toast.error(
                error.message || (pageData ? 'Failed to update page' : 'Failed to create page')
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen pb-6">
            <Back href={'/admin/web-pages'} />
            <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-4 ">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    {pageData ? `Edit ${pageData.pageName}` : 'Create New Page'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-xl font-medium mb-2">Page Type</label>
                        <select
                            name="pageType"
                            value={showCustomInput ? 'Other' : formData.pageName}
                            onChange={handlePageOptionChange}
                            className="w-full border outline-none border-gray-300 rounded p-2"
                            required
                        >
                            <option value="" disabled>Select a page type</option>
                            {pageOptions.map((option) => (
                                <option key={option.slug || option.pageName} value={option.pageName}>
                                    {option.pageName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {showCustomInput && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xl font-medium mb-2">Custom Page Name</label>
                            <input
                                type="text"
                                name="customPageName"
                                value={formData.pageName}
                                onChange={handleCustomPageNameChange}
                                className="w-full border outline-none border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-xl font-medium mb-2">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="w-full border border-gray-300 outline-none rounded p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-xl font-medium mb-2">Content</label>
                        <div className='h-[400px] mb-16'>
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                className="h-full"
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        ['link', 'image'],
                                        [{ align: [] }],
                                        ['clean'],
                                        ['table'],
                                        ['code-block']
                                    ],
                                    table: true
                                }}
                                formats={[
                                    'header',
                                    'bold', 'italic', 'underline', 'strike',
                                    'list',
                                    'link', 'image',
                                    'align',
                                    'table',
                                    'code-block'
                                ]}
                            />
                        </div>
                    </div>

                    <div className='flex justify-end gap-4'>
                        <Button
                            type="button"
                            style="!bg-gray-500 !text-white !px-4 !py-2 rounded-lg"
                            label="Cancel"
                            onClick={() => router.back()}
                        />
                        <Button
                            type="submit"
                            style="!bg-[#002B4B] !text-white !px-4 !py-2 rounded-lg"
                            label={pageData ? 'Update Page' : 'Create Page'}
                            loading={isSubmitting}
                            loadingLabel={pageData ? 'Updating...' : 'Creating...'}
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PageEditorForm;