import { getPageContent } from '@/app/actions/content-pages';
import PageEditorForm from '@/components/pages/content/page-editor';
import React from 'react';


const Page = async ({ params }) => {

    const { slug } = await params;

    let data = null;
    let error = null;

    if (slug !== 'create-page') {
        const res = await getPageContent(slug);
        data = res.data;
        error = res.error;
    }

    if (error) {
        return (
            <div>
                <h1 className='text-center py-20 text-red-500'>Something went wrong!</h1>
            </div>
        );
    }

    return (
        <div>
            <PageEditorForm pageData={data} />
        </div>
    );
};

export default Page;
