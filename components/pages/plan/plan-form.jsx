'use client';
import Button from '@/components/shared/custom-btn';
import { useState } from 'react';

const PlanForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: initialData.name,
        price: initialData.price,
        interval: initialData.interval,
        features: [...initialData.features],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex items-center gap-4'>
                <p className="w-32  text-sm text-start font-medium mb-3">Plan Name</p>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border outline-none rounded"
                    required
                />
            </div>

            <div className='flex items-center gap-4'>
                <p className="w-32  text-sm text-start font-medium mb-3">Price</p>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border outline-none rounded"
                    min="0"
                    step="0.01"
                    required
                />
            </div>

            {/* <div>
                <label className="block text-sm font-medium mb-1">Billing Interval</label>
                <select
                    name="interval"
                    value={formData.interval}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                </select>
            </div> */}

            {/* <div>
                <label className="block text-sm font-medium mb-1">Features</label>
                <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className="flex-1 p-2 border rounded"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="px-2 text-red-600"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <div className='w-full flex justify-center'>
                    <Button
                        type="button"
                        onClick={addFeature}
                        style="text-sm bg-green-400 rounded mt-2"
                        label='+ Add Feature'
                    />
                    </div>
                    
                </div>
            </div> */}

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    style="px-4 py-2 border bg-gray rounded"
                    disabled={isSubmitting}
                    label='Cancel'
                />

                <Button
                    type="submit"
                    style="px-4 py-2 bg-[#1e3264] text-white rounded disabled:opacity-50"
                    loading={isSubmitting}
                    label='Save Changes'
                    loadingLabel='Saving...'
                />
            </div>
        </form>
    );
};

export default PlanForm;